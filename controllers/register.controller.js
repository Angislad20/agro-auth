const bcrypt = require('bcrypt');
const { Wallet } = require('ethers');
const { pool } = require('../config/db');
require('dotenv').config();

const register = async (req, res) => {
  try {
    const { nom, email, numero_tel, password, confirmPassword, profil_id } = req.body;

    if (!nom || !email || !numero_tel || !password || !confirmPassword || !profil_id) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
    }

    const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé." });
    }

    const phoneCheck = await pool.query('SELECT id FROM users WHERE numero_tel = $1', [numero_tel]);
    if (phoneCheck.rows.length > 0) {
      return res.status(400).json({ message: "Numéro de téléphone déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const wallet = Wallet.createRandom();

    const insertQuery = `
      INSERT INTO users (
        nom, email, numero_tel, password, profil_id,
        wallet_address, is_profile_completed, statut
      )
      VALUES ($1, $2, $3, $4, $5, $6, false, 'valide')
      RETURNING id, nom, email, numero_tel, profil_id, wallet_address
    `;

    const result = await pool.query(insertQuery, [
      nom, email, numero_tel, hashedPassword, profil_id, wallet.address
    ]);

    const user = result.rows[0];

    return res.status(201).json({
      message: 'Compte créé avec succès.',
      user
    });

  } catch (error) {
    console.error('Erreur dans l’inscription:', error.message);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = { register };
