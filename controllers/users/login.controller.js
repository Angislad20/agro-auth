const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../../config/db');
require('dotenv').config();

const login = async (req, res) => {
  try {
    const { identifiant, password, rememberMe } = req.body;

    if (!identifiant || !password) {
      return res.status(400).json({ message: 'Identifiant et mot de passe requis.' });
    }

    let userQuery;
    let user;

    userQuery = await pool.query(`
      SELECT * FROM users 
      WHERE numero_tel = $1
    `, [identifiant]);

    if (userQuery.rows.length > 0) {
      user = userQuery.rows[0];

      if (user.profil_id !== 'f23423d4-ca9e-409b-b3fb-26126ab66581') {
        return res.status(400).json({ message: "Seuls les producteurs peuvent se connecter avec leur numéro de téléphone." });
      }
    }

    if (!user) {
      userQuery = await pool.query(`
        SELECT * FROM users 
        WHERE email = $1
      `, [identifiant]);

      if (userQuery.rows.length > 0) {
        user = userQuery.rows[0];

        if (!['b74a4f6-67b6-474a-9bf5-d63e04d2a804', '35a3c32a-17f8-4771-a0d8-9295b1bc5917'].includes(user.profil_id)) {
          return res.status(400).json({ message: "Seuls les coopératives et acheteurs peuvent se connecter avec leur email." });
        }
      }
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign(
      { user_id: user.id, profil_id: user.profil_id },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? '30d' : '1d' }
    );

    return res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        numero_tel: user.numero_tel,
        profil_id: user.profil_id,
        is_profile_completed: user.is_profile_completed
      }
    });

  } catch (error) {
    console.error('Erreur login:', error.message);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = { login };
