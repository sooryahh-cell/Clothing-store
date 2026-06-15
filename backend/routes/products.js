const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Helper to ensure sizes is always a parsed array
const parseProductSizes = (productJson) => {
    let sizes = productJson.sizes;
    if (typeof sizes === 'string') {
        try {
            sizes = JSON.parse(sizes);
        } catch (e) {
            // If it's a comma-separated string, convert to array
            if (sizes.includes(',')) {
                sizes = sizes.split(',').map(s => s.trim());
            } else {
                sizes = [sizes];
            }
        }
    }
    // Default fallback if null or empty
    if (!Array.isArray(sizes)) {
        sizes = ["S", "M", "L"];
    }
    return sizes;
};

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll();
        // Map products to include _id for frontend backwards-compatibility
        const productsWithAlias = products.map(product => {
            const p = product.toJSON();
            return {
                ...p,
                sizes: parseProductSizes(p),
                _id: p.id // Keep _id alias for frontend stability
            };
        });
        res.json(productsWithAlias);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        
        const p = product.toJSON();
        res.json({
            ...p,
            sizes: parseProductSizes(p),
            _id: p.id // Keep _id alias for frontend stability
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST add product
router.post('/', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        const p = product.toJSON();
        res.status(201).json({
            ...p,
            sizes: parseProductSizes(p),
            _id: p.id // Keep _id alias for frontend stability
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;