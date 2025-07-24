const { pool } = require('../../config/db');
const crypto = require('crypto');
const moment = require('moment');

const requestResetPassword = async (req, res) => {
  try {
    const { identifiant } = req.body;
    if (!identifiant) {
      return res.status(400).json({ message: 'Identifiant requis.' });
    }

    // Chercher user par numéro ou email
    let userQuery = await pool.query('SELECT * FROM users WHERE numero_tel = $1', [identifiant]);
    if (userQuery.rows.length === 0) {
      userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [identifiant]);
    }

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: 'Aucun utilisateur trouvé.' });
    }

    const user = userQuery.rows[0];

    // Générer un OTP à 4 chiffres
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // Stocker l’OTP en DB
    await pool.query(`
      INSERT INTO otps (user_id, code, expiration)
      VALUES ($1, $2, $3)
    `, [user.id, code, moment().add(10, 'minutes').toDate()]);

    // Envoi de l’OTP
    if (user.profil_id === 'f23423d4-ca9e-409b-b3fb-26126ab66581') {
      // Envoyer par SMS (Mock ou API Twilio etc.)
      console.log(`📲 SMS vers ${user.numero_tel}: Code OTP = ${code}`);
    } else {
      // Envoyer par email (ex: Nodemailer)
      console.log(`📧 Email vers ${user.email}: Code OTP = ${code}`);
    }

    return res.status(200).json({ message: 'Code OTP envoyé avec succès.' });

  } catch (error) {
    console.error('Erreur OTP:', error.message);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = { requestResetPassword };
