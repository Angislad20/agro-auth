require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.SUPABASE_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Connexion à la base Supabase réussie !');
    client.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur de connexion :', error.message);
    process.exit(1);
  }
}

testConnection();

