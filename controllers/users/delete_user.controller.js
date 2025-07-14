const { pool } = require('../../config/db');

const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) return res.status(400).json({ message: 'ID utilisateur invalide.' });

  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    return res.json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
    console.error('Détails erreur:', error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = { deleteUser };
