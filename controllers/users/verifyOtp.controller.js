const { pool } = require('../../config/db');

const verifyOtp = async (req, res) => {
  try {
    const { identifiant, code } = req.body;

    if (!identifiant || !code) {
      return res.status(400).json({ message: 'Identifiant et code OTP requis.' });
    }

    // Récupérer l’utilisateur par téléphone ou email
    let userQuery = await pool.query('SELECT * FROM users WHERE numero_tel = $1', [identifiant]);
    if (userQuery.rows.length === 0) {
      userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [identifiant]);
    }

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    const user = userQuery.rows[0];

    // Vérifier l’OTP
    const otpQuery = await pool.query(`
      SELECT * FROM otps 
      WHERE user_id = $1 AND code = $2 AND expiration > NOW() AND used = false
      ORDER BY expiration DESC LIMIT 1
    `, [user.id, code]);

    if (otpQuery.rows.length === 0) {
      return res.status(400).json({ message: "Code OTP invalide ou expiré." });
    }

    // Marquer l’OTP comme utilisé
    await pool.query('UPDATE otps SET used = true WHERE id = $1', [otpQuery.rows[0].id]);

    return res.status(200).json({ 
      message: 'OTP vérifié avec succès.',
      user_id: user.id
    });

  } catch (error) {
    console.error('Erreur verify OTP:', error.message);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = { verifyOtp };
