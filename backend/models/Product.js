const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    sizes: {
        type: DataTypes.JSON, // Stores sizes array as a JSON field in MySQL
        allowNull: true
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 10
    }
}, {
    timestamps: true
});

module.exports = Product;