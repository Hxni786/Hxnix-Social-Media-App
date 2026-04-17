const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

async function createTableAndSeed() {
  const createSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      username   VARCHAR(100)  NOT NULL UNIQUE,
      password   VARCHAR(255)  NOT NULL,
      createdAt  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  try {
    await pool.query(createSQL);
    console.log('[Model] ✅ Users table initialized');
    
    // Seed Hxni if doesn't exist
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', ['Hxni']);
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash('Hxni@786', 10);
      await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', ['Hxni', hashedPassword]);
      console.log('[Model] 👤 Seeded user: Hxni');
    }
  } catch (err) {
    console.error('[Model] ❌ Users table init failed:', err.message);
    throw err;
  }
}

async function findByUsername(username) {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
}

async function findById(id) {
  const [rows] = await pool.query('SELECT id, username, createdAt FROM users WHERE id = ?', [id]);
  return rows[0];
}

async function createUser(username, password = 'hxnix_default_pwd') {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
  return { id: result.insertId, username };
}

module.exports = { createTableAndSeed, findByUsername, findById, createUser };
