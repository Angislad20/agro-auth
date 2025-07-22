const bcrypt = require('bcrypt');
const { pool } = require('../../config/db');

const resetPassword = async (req, res) => {
  try {
    const { user_id, newPassword, confirmPassword } = req.body;

    if (!user_id || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Les mots de passe ne correspondent pas.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2 RETURNING id, nom, email, numero_tel',
      [hashedPassword, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    return res.status(200).json({
      message: "Mot de passe réinitialisé avec succès.",
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur resetPassword:', error.message);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = { resetPassword };
