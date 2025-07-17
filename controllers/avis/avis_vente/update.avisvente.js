const { pool } = require('../../../config/db');

const updateAvisVente = async (req, res) => {
  try {
    const { avis_vente_id } = req.params;
    const { note, commentaire } = req.body;
    const noteur_id = req.user.id;

    const check = await pool.query(`SELECT * FROM avis_vente WHERE id = $1`, [avis_vente_id]);
    if (check.rows.length === 0) return res.status(404).json({ message: 'Avis introuvable.' });
    if (check.rows[0].noteur_id !== noteur_id) return res.status(403).json({ message: 'Non autorisé.' });

    const query = `
      UPDATE avis_vente
      SET note = $1, commentaire = $2
      WHERE id = $3
      RETURNING *;
    `;
    const result = await pool.query(query, [note, commentaire, avis_vente_id]);

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur modification avis vente:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  updateAvisVente
};
