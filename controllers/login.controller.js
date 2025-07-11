const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
require('dotenv').config();

const login = async (req, res) => {
  try {
    const { identifiant, password } = req.body;

    if (!identifiant || !password) {
      return res.status(400).json({ message: 'Identifiant et mot de passe requis.' });
    }

    // On récupère le user en fonction de l’identifiant
    const userQuery = await pool.query(`
      SELECT * FROM users 
      WHERE numero_tel = $1 OR email = $1
    `, [identifiant]);

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: "Identifiant incorrect." });
    }

    const user = userQuery.rows[0];

    // Vérification : producteur = téléphone | autres = email
    if (user.profil_id == 1 && user.numero_tel !== identifiant) {
      return res.status(400).json({ message: "Les producteurs doivent se connecter avec leur numéro de téléphone." });
    }

    if ((user.profil_id == 2 || user.profil_id == 3) && user.email !== identifiant) {
      return res.status(400).json({ message: "Les coopératives et acheteurs doivent utiliser leur email." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign(
      { user_id: user.id, profil_id: user.profil_id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
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
