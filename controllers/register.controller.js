const bcrypt = require('bcrypt');
const { Wallet } = require('ethers');
const { pool } = require('../config/db');
require('dotenv').config();

const register = async (req, res) => {
  try {
    const { username, email, telephone, password, profil_id } = req.body;

    if (!username || !email || !telephone || !password || !profil_id) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    const usernameCheck = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (usernameCheck.rows.length > 0) {
      return res.status(400).json({ message: "Nom d'utilisateur déjà utilisé." });
    }

    const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const wallet = await Wallet.createRandom(); 

    const result = await pool.query(`
      INSERT INTO users (username, email, telephone, password, profil_id, wallet_address, is_profile_completed)
      VALUES ($1, $2, $3, $4, $5, $6, false)
      RETURNING id, username, email, telephone, profil_id, wallet_address
    `, [username, email, telephone, hashedPassword, profil_id, wallet.address]);

    const user = result.rows[0];

    if (!user) {
    return res.status(500).json({ message: "Erreur : utilisateur non retourné." });
    }

    return res.status(201).json({
      message: 'Compte créé avec succès.',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Détails erreur:', error.message);
    console.error(error.stack);
    res.status(500).json({ message: 'Erreur serveur.' });
    }
};

module.exports = { register };
