const bcrypt = require('bcrypt');
const { Wallet } = require('ethers');
const { pool } = require('../../config/db');
require('dotenv').config();

const profileMap = {
  acheteur: '7b74a4f6-67b6-474a-9bf5-d63e04d2a804',
  producteur: 'f23423d4-ca9e-409b-b3fb-26126ab66581',
  cooperatives: '35a3c32a-17f8-4771-a0d8-9295b1bc5917'
  // tu peux ajouter d'autres profils ici
};

const register = async (req, res) => {
  try {
    let { nom, email, numero_tel, password, confirmPassword, profil_id } = req.body;

    if (!profil_id) {
      return res.status(400).json({ message: 'Le champ profil est obligatoire.' });
    }

    // Convertit profil_id simple en UUID
    if (profileMap[profil_id]) {
      profil_id = profileMap[profil_id];
    }
    // Sinon, on suppose que c'est déjà un UUID valide

    // Validation selon profil
    if (profil_id === profileMap.producteur) {
      if (!nom || !numero_tel || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
      }

      // Validation numéro téléphone (10 chiffres, préfixes autorisés)
      const validPrefixes = ['07', '01', '05', '27'];
      const phoneRegex = /^[0-9]{10}$/;

      if (!phoneRegex.test(numero_tel)) {
        return res.status(400).json({ message: 'Le numéro de téléphone doit contenir exactement 10 chiffres.' });
      }

      const prefix = numero_tel.substring(0, 2);
      if (!validPrefixes.includes(prefix)) {
        return res.status(400).json({ message: 'Le numéro de téléphone doit commencer par 07, 01, 05 ou 27.' });
      }

      const phoneCheck = await pool.query('SELECT id FROM users WHERE numero_tel = $1', [numero_tel]);
      if (phoneCheck.rows.length > 0) {
        return res.status(400).json({ message: "Numéro de téléphone déjà utilisé." });
      }
    }
    else if (profil_id === profileMap.acheteur || profil_id === profileMap.cooperatives) {
      if (!nom || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
      }

      const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: "Email déjà utilisé." });
      }
    } else {
      return res.status(400).json({ message: "Profil invalide." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const wallet = Wallet.createRandom();

    const insertQuery = `
      INSERT INTO users (
        nom, email, numero_tel, password, profil_id,
        wallet_adress, is_profile_completed, statut
      )
      VALUES ($1, $2, $3, $4, $5, $6, false, 'valide')
      RETURNING id, nom, email, numero_tel, profil_id, wallet_adress
    `;

    const result = await pool.query(insertQuery, [
      nom || null, email || null, numero_tel || null, hashedPassword, profil_id, wallet.address
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
