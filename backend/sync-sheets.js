'use strict';
/**
 * sync-sheets.js
 *
 * One-time bulk sync script — imports ALL existing orders + users into Google Sheets.
 *
 * Usage:
 *   node sync-sheets.js
 *
 * Make sure you have:
 *   1. GOOGLE_SHEETS_SPREADSHEET_ID set in .env
 *   2. google-service-account.json in the backend/ directory
 */

require('dotenv').config();

const { connectDB } = require('./config/db');
const Order = require('./models/Order');
const User = require('./models/User');
const { syncAllOrders } = require('./services/sheets');

async function main() {
    console.log('🔄 TerraFit → Google Sheets Bulk Sync');
    console.log('──────────────────────────────────────');

    // Connect to MySQL
    console.log('📦 Connecting to database...');
    await connectDB();

    // Load all orders
    console.log('📋 Fetching all orders...');
    const orders = await Order.findAll({ order: [['createdAt', 'ASC']] });
    console.log(`   Found ${orders.length} order(s)`);

    // Load all users referenced by orders (+ any extra users)
    const userIds = [...new Set(orders.map(o => o.userId))];
    const users = await User.findAll({ where: { id: userIds } });

    // Also load ALL users for the Users tab
    const allUsers = await User.findAll({ order: [['createdAt', 'ASC']] });
    console.log(`   Found ${allUsers.length} user(s)`);

    // Build a userId → user map for order row building
    const usersMap = {};
    for (const u of allUsers) {
        usersMap[u.id] = u;
    }

    // Sync to Google Sheets
    console.log('\n📊 Syncing to Google Sheets...');
    await syncAllOrders(orders, usersMap);

    const sheetUrl = `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEETS_SPREADSHEET_ID}`;
    console.log(`\n✅ Done! Open your sheet: ${sheetUrl}`);
    process.exit(0);
}

main().catch(err => {
    console.error('❌ Sync failed:', err.message);
    console.error(err.stack);
    process.exit(1);
});
