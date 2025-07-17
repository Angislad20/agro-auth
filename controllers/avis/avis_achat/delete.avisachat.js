const { pool } = require('../../../config/db');

const deleteAvisAchat = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const avis_achat = await pool.query('SELECT * FROM avis_achat WHERE id = $1', [id]);
    if (avis_achat.rows.length === 0) return res.status(404).json({ message: "Avis non trouvé." });

    if (avis_achat.rows[0].noteur_id !== userId) {
      return res.status(403).json({ message: "Non autorisé à supprimer cet avis." });
    }

    await pool.query('DELETE FROM avis_achat WHERE id = $1', [id]);

    res.status(200).json({ message: "Avis supprimé avec succès." });
  } catch (error) {
    console.error('Erreur suppression avis achat :', error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  deleteAvisAchat
};