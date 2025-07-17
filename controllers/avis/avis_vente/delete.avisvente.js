const { pool } = require('../../../config/db');

const deleteAvisVente = async (req, res) => {
  try {
    const { avis_vente_id } = req.params;
    const noteur_id = req.user.id;

    const check = await pool.query(`SELECT * FROM avis_vente WHERE id = $1`, [avis_vente_id]);
    if (check.rows.length === 0) return res.status(404).json({ message: 'Avis introuvable.' });
    if (check.rows[0].noteur_id !== noteur_id) return res.status(403).json({ message: 'Non autorisé.' });

    await pool.query(`DELETE FROM avis_vente WHERE id = $1`, [avis_vente_id]);

    res.status(200).json({ message: 'Avis supprimé.' });
  } catch (error) {
    console.error('Erreur suppression avis vente:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  deleteAvisVente
};