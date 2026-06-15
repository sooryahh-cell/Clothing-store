'use strict';
require('dotenv').config();

const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// ─── Config ─────────────────────────────────────────────────────────────────

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const SERVICE_ACCOUNT_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_FILE
    ? path.resolve(__dirname, '..', process.env.GOOGLE_SERVICE_ACCOUNT_FILE)
    : path.resolve(__dirname, '..', 'google-service-account.json');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Sheet/tab names
const SHEETS = {
    ORDERS:   'Orders',
    USERS:    'Users',
    PAYMENTS: 'Payments',
};

// Column headers for each tab
const HEADERS = {
    ORDERS: [
        'Order ID', 'Razorpay Order ID', 'User ID', 'User Name', 'User Email',
        'Items (JSON)', 'Total (₹)', 'Status',
        'Shipping Name', 'Shipping Phone', 'Shipping Address', 'Shipping City',
        'Shipping State', 'Shipping Pincode',
        'Created At', 'Updated At',
    ],
    USERS: [
        'User ID', 'Name', 'Email', 'Is Admin', 'Created At',
    ],
    PAYMENTS: [
        'Razorpay Order ID', 'Razorpay Payment ID', 'Razorpay Signature',
        'Status', 'Total (₹)', 'Verified At',
    ],
};

// ─── Auth ────────────────────────────────────────────────────────────────────

let _auth = null;

function getAuth() {
    if (_auth) return _auth;

    if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
        throw new Error(
            `Google service account file not found at: ${SERVICE_ACCOUNT_PATH}\n` +
            `Download it from Google Cloud Console and save it there.`
        );
    }

    _auth = new google.auth.GoogleAuth({
        keyFile: SERVICE_ACCOUNT_PATH,
        scopes: SCOPES,
    });

    return _auth;
}

async function getSheetsClient() {
    const auth = getAuth();
    return google.sheets({ version: 'v4', auth });
}

// ─── Sheet helpers ────────────────────────────────────────────────────────────

/**
 * Get all values from a range.
 */
async function getRange(sheets, range) {
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range,
    });
    return res.data.values || [];
}

/**
 * Ensure a tab exists; create it if not.
 */
async function ensureTab(sheets, tabName) {
    const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const exists = meta.data.sheets.some(s => s.properties.title === tabName);

    if (!exists) {
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: {
                requests: [{
                    addSheet: { properties: { title: tabName } }
                }]
            }
        });
        console.log(`[Sheets] Created tab: ${tabName}`);
    }
}

/**
 * Ensure all tabs exist and have the correct header row.
 */
async function ensureHeaders() {
    const sheets = await getSheetsClient();

    for (const [key, tabName] of Object.entries(SHEETS)) {
        await ensureTab(sheets, tabName);
        const rows = await getRange(sheets, `${tabName}!A1:Z1`);
        if (!rows || rows.length === 0) {
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${tabName}!A1`,
                valueInputOption: 'RAW',
                requestBody: { values: [HEADERS[key]] },
            });
            console.log(`[Sheets] Wrote headers for tab: ${tabName}`);
        }
    }
}

// ─── Orders tab ───────────────────────────────────────────────────────────────

/**
 * Build a row array for the Orders tab.
 * @param {object} order  - Sequelize Order instance (plain object or model)
 * @param {object} user   - Sequelize User instance (plain or plain object)
 */
function buildOrderRow(order, user) {
    const o = order.toJSON ? order.toJSON() : order;
    const u = user ? (user.toJSON ? user.toJSON() : user) : {};

    const sd = o.shippingDetails || {};
    const items = Array.isArray(o.items)
        ? o.items.map(i => `${i.name} x${i.quantity}${i.size ? ` (${i.size})` : ''} @₹${i.price}`).join('; ')
        : JSON.stringify(o.items);

    return [
        o.id,
        o.razorpayOrderId || '',
        o.userId,
        u.name || '',
        u.email || '',
        items,
        o.totalAmount,
        o.status,
        sd.name || sd.fullName || '',
        sd.phone || sd.mobile || '',
        sd.address || sd.addressLine1 || '',
        sd.city || '',
        sd.state || '',
        sd.pincode || sd.zip || '',
        o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN') : '',
        o.updatedAt ? new Date(o.updatedAt).toLocaleString('en-IN') : '',
    ];
}

/**
 * Append a new order row OR update the existing row if razorpayOrderId already exists.
 * Fire-and-forget safe — all errors are caught and logged.
 */
async function appendOrUpdateOrder(order, user) {
    if (!SPREADSHEET_ID) {
        console.warn('[Sheets] GOOGLE_SHEETS_SPREADSHEET_ID not set — skipping sync.');
        return;
    }

    try {
        const sheets = await getSheetsClient();
        await ensureHeaders();

        const tab = SHEETS.ORDERS;
        const o = order.toJSON ? order.toJSON() : order;
        const row = buildOrderRow(order, user);

        // Find existing row by razorpayOrderId (column B = index 1)
        const allRows = await getRange(sheets, `${tab}!A:B`);
        let existingRowNum = null;

        for (let i = 1; i < allRows.length; i++) { // skip header row 0
            if (allRows[i][1] === o.razorpayOrderId) {
                existingRowNum = i + 1; // 1-indexed sheet row
                break;
            }
        }

        if (existingRowNum) {
            // Update existing row
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${tab}!A${existingRowNum}`,
                valueInputOption: 'RAW',
                requestBody: { values: [row] },
            });
            console.log(`[Sheets] Updated order row ${existingRowNum} for ${o.razorpayOrderId}`);
        } else {
            // Append new row
            await sheets.spreadsheets.values.append({
                spreadsheetId: SPREADSHEET_ID,
                range: `${tab}!A1`,
                valueInputOption: 'RAW',
                insertDataOption: 'INSERT_ROWS',
                requestBody: { values: [row] },
            });
            console.log(`[Sheets] Appended new order row for ${o.razorpayOrderId}`);
        }

        // Also sync the user row
        await upsertUserRow(sheets, user);

        // Sync payment row if paid
        if (o.status === 'paid' && o.razorpayPaymentId) {
            await upsertPaymentRow(sheets, o);
        }

    } catch (err) {
        // Non-fatal: log but don't crash the order API
        console.error('[Sheets] Sync error:', err.message);
    }
}

// ─── Users tab ────────────────────────────────────────────────────────────────

async function upsertUserRow(sheets, user) {
    if (!user) return;
    const u = user.toJSON ? user.toJSON() : user;
    const tab = SHEETS.USERS;

    const allRows = await getRange(sheets, `${tab}!A:A`);
    let existingRowNum = null;

    for (let i = 1; i < allRows.length; i++) {
        if (String(allRows[i][0]) === String(u.id)) {
            existingRowNum = i + 1;
            break;
        }
    }

    const row = [
        u.id,
        u.name,
        u.email,
        u.isAdmin ? 'Yes' : 'No',
        u.createdAt ? new Date(u.createdAt).toLocaleString('en-IN') : '',
    ];

    if (existingRowNum) {
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${tab}!A${existingRowNum}`,
            valueInputOption: 'RAW',
            requestBody: { values: [row] },
        });
    } else {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${tab}!A1`,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: [row] },
        });
    }
}

// ─── Payments tab ─────────────────────────────────────────────────────────────

async function upsertPaymentRow(sheets, order) {
    const o = order.toJSON ? order.toJSON() : order;
    const tab = SHEETS.PAYMENTS;

    const allRows = await getRange(sheets, `${tab}!A:A`);
    let existingRowNum = null;

    for (let i = 1; i < allRows.length; i++) {
        if (allRows[i][0] === o.razorpayOrderId) {
            existingRowNum = i + 1;
            break;
        }
    }

    const row = [
        o.razorpayOrderId,
        o.razorpayPaymentId || '',
        o.razorpaySignature || '',
        o.status,
        o.totalAmount,
        o.updatedAt ? new Date(o.updatedAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN'),
    ];

    if (existingRowNum) {
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${tab}!A${existingRowNum}`,
            valueInputOption: 'RAW',
            requestBody: { values: [row] },
        });
    } else {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${tab}!A1`,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: [row] },
        });
    }
}

// ─── Bulk Sync ────────────────────────────────────────────────────────────────

/**
 * Full bulk sync — clears all tabs and rewrites from scratch.
 * Called by sync-sheets.js one-time script.
 */
async function syncAllOrders(orders, usersMap) {
    if (!SPREADSHEET_ID) {
        throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID not set in .env');
    }

    const sheets = await getSheetsClient();
    await ensureHeaders();

    console.log(`[Sheets] Bulk syncing ${orders.length} orders...`);

    // Clear existing data (keep headers)
    for (const tabName of Object.values(SHEETS)) {
        await sheets.spreadsheets.values.clear({
            spreadsheetId: SPREADSHEET_ID,
            range: `${tabName}!A2:Z`,
        });
    }

    // Re-write headers (in case clear removed them)
    for (const [key, tabName] of Object.entries(SHEETS)) {
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${tabName}!A1`,
            valueInputOption: 'RAW',
            requestBody: { values: [HEADERS[key]] },
        });
    }

    // Build order rows
    const orderRows = orders.map(o => {
        const user = usersMap[o.userId] || null;
        return buildOrderRow(o, user);
    });

    if (orderRows.length > 0) {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEETS.ORDERS}!A2`,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: orderRows },
        });
    }

    // Build user rows (unique users)
    const uniqueUsers = Object.values(usersMap);
    const userRows = uniqueUsers.map(u => {
        const uj = u.toJSON ? u.toJSON() : u;
        return [
            uj.id, uj.name, uj.email,
            uj.isAdmin ? 'Yes' : 'No',
            uj.createdAt ? new Date(uj.createdAt).toLocaleString('en-IN') : '',
        ];
    });

    if (userRows.length > 0) {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEETS.USERS}!A2`,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: userRows },
        });
    }

    // Build payment rows (paid orders only)
    const paidOrders = orders.filter(o => {
        const oj = o.toJSON ? o.toJSON() : o;
        return oj.status === 'paid' && oj.razorpayPaymentId;
    });

    const paymentRows = paidOrders.map(o => {
        const oj = o.toJSON ? o.toJSON() : o;
        return [
            oj.razorpayOrderId,
            oj.razorpayPaymentId || '',
            oj.razorpaySignature || '',
            oj.status,
            oj.totalAmount,
            oj.updatedAt ? new Date(oj.updatedAt).toLocaleString('en-IN') : '',
        ];
    });

    if (paymentRows.length > 0) {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEETS.PAYMENTS}!A2`,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: paymentRows },
        });
    }

    console.log(`[Sheets] Bulk sync complete.`);
    console.log(`  Orders: ${orderRows.length}, Users: ${userRows.length}, Payments: ${paymentRows.length}`);
}

module.exports = {
    appendOrUpdateOrder,
    syncAllOrders,
    ensureHeaders,
};
