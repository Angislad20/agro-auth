const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
require('dotenv').config();

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username et mot de passe requis.' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect.' });

    const payload = { id: user.id, username: user.username, profil_id: user.profil_id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({
      message: 'Connexion réussie.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profil_id: user.profil_id,
        wallet_address: user.wallet_address,
        status: user.status
      }
    });

  } catch (error) {
    console.error('Détails erreur:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = { login };
