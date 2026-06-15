const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

// Read DB config from environment variables
const dbName = process.env.DB_NAME || 'terrafitdb';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = process.env.DB_PORT || 3306;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    logging: false // Toggle to console.log to debug raw queries
});

// Helper to initialize database and tables
async function connectDB() {
    try {
        // 1. Create database if it does not exist
        const connection = await mysql.createConnection({
            host: dbHost,
            port: dbPort,
            user: dbUser,
            password: dbPassword
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await connection.end();

        // 2. Authenticate Sequelize
        await sequelize.authenticate();
        console.log('✅ XAMPP MySQL Connected successfully.');

        // 3. Sync Models
        // using { alter: true } is safe and updates tables when structures change without wiping existing data
        await sequelize.sync({ alter: true });
        console.log('✅ MySQL Database Models Synced.');
    } catch (err) {
        console.error('❌ XAMPP MySQL Connection Error:', err.message);
        console.error('👉 Please make sure XAMPP Control Panel is open and MySQL service is running on port 3306!');
        process.exit(1);
    }
}

module.exports = {
    sequelize,
    connectDB
};
