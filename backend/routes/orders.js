const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');
const sheets = require('../services/sheets');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// GET my orders (for profile page)
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (err) {
        console.error('Fetch orders error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST create order
router.post('/', auth, async (req, res) => {
    try {
        const { items, total, shippingDetails } = req.body;

        const numericTotal = Number(total);
        console.log('--- Order Request Received ---');
        console.log('Items Count:', items?.length);
        console.log('Raw total from body:', total);
        console.log('Numeric total:', numericTotal);

        if (isNaN(numericTotal) || numericTotal <= 0) {
            console.error('Invalid total received!');
            return res.status(400).json({ error: 'Invalid total amount' });
        }

        const amountInPaise = Math.round(numericTotal * 100);
        console.log(`--- LIVE MODE ---`);
        console.log(`Final Amount being sent to Razorpay: ${amountInPaise} paise`);

        // 1. Create Razorpay Order
        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `order_rcptid_${Date.now()}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // 2. Save Order in XAMPP MySQL using Sequelize
        const newOrder = await Order.create({
            userId: req.user.id,
            items: items.map(item => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size
            })),
            totalAmount: total,
            shippingDetails,
            razorpayOrderId: razorpayOrder.id,
            status: 'pending'
        });

        // 3. Sync to Google Sheets (fire-and-forget — non-blocking)
        const orderUser = await User.findByPk(req.user.id);
        sheets.appendOrUpdateOrder(newOrder, orderUser).catch(e =>
            console.error('[Sheets] Background sync error:', e.message)
        );

        res.status(201).json({
            success: true,
            order_id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
        });
    } catch (err) {
        console.error('Order creation error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST verify payment
router.post('/verify', auth, async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update order status in MySQL DB
            await Order.update(
                {
                    status: 'paid',
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature
                },
                { where: { razorpayOrderId: razorpay_order_id } }
            );

            // Sync updated order to Google Sheets (fire-and-forget)
            Order.findOne({ where: { razorpayOrderId: razorpay_order_id } })
                .then(async updatedOrder => {
                    if (updatedOrder) {
                        const paidUser = await User.findByPk(updatedOrder.userId);
                        return sheets.appendOrUpdateOrder(updatedOrder, paidUser);
                    }
                })
                .catch(e => console.error('[Sheets] Verify sync error:', e.message));

            res.json({ success: true, message: "Payment verified successfully" });
        } else {
            res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (err) {
        console.error('Verification error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST callback for redirect mode
router.post('/callback', async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        const frontendUrl = 'http://localhost:3000'; // Change to production URL later

        if (isAuthentic) {
            // Update order status in MySQL DB
            await Order.update(
                {
                    status: 'paid',
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature
                },
                { where: { razorpayOrderId: razorpay_order_id } }
            );

            // Sync updated order to Google Sheets (fire-and-forget)
            Order.findOne({ where: { razorpayOrderId: razorpay_order_id } })
                .then(async updatedOrder => {
                    if (updatedOrder) {
                        const cbUser = await User.findByPk(updatedOrder.userId);
                        return sheets.appendOrUpdateOrder(updatedOrder, cbUser);
                    }
                })
                .catch(e => console.error('[Sheets] Callback sync error:', e.message));

            // Redirect to frontend success page
            res.redirect(`${frontendUrl}/success`);
        } else {
            // Redirect to failure/checkout with error
            res.redirect(`${frontendUrl}/checkout?error=verification_failed`);
        }
    } catch (err) {
        console.error('Callback error:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;