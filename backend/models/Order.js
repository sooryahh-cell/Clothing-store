const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    items: {
        type: DataTypes.JSON, // Stores array of items as JSON in MySQL
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    shippingDetails: {
        type: DataTypes.JSON, // Stores shipping details object as JSON in MySQL
        allowNull: true
    },
    razorpayOrderId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    razorpayPaymentId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    razorpaySignature: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'failed'),
        defaultValue: 'pending'
    }
}, {
    timestamps: true
});

module.exports = Order;
