
// db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function executeQuery(query) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(query);
    return rows;
  } catch (error) {
    error.sql = query; // Attach the SQL query to the error
    console.error('DB Error:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}