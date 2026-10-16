const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

/**
 * MySQL Connection Pool Configuration
 * Uses mysql2/promise for async/await queries
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'homematch_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+06:00' // Bangladesh Standard Time (BST)
});

/**
 * Test Database Connection on startup
 */
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`[Database] Connected successfully to MySQL (${process.env.DB_NAME || 'homematch_db'}) on port ${process.env.DB_PORT || 3306}`);
    connection.release();
    return true;
  } catch (error) {
    console.warn(`[Database Warning] MySQL connection failed: ${error.message}`);
    console.warn('[Database Notice] If MySQL is not running locally yet, verify credentials in backend/.env.');
    return false;
  }
};

module.exports = {
  pool,
  testConnection
};
