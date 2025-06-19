const { pool } = require('./config/db');

async function test() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('DB connect OK:', res.rows[0]);
  } catch (error) {
    console.error('Détails erreur:', error);
  }
}

test();
