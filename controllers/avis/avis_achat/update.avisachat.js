const { pool } = require('../../../config/db');
const { v4: uuidv4 } = require('uuid');

const updateAvisAchat = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { note, commentaire } = req.body;

    const avis_achat = await pool.query('SELECT * FROM avis_achat WHERE id = $1', [id]);
    if (avis_achat.rows.length === 0) return res.status(404).json({ message: "Avis non trouvé." });

    if (avis_achat.rows[0].noteur_id !== userId) {
      return res.status(403).json({ message: "Non autorisé à modifier cet avis." });
    }

    const updateQuery = `
      UPDATE avis_achat SET note = $1, commentaire = $2, created_at = CURRENT_TIMESTAMP
      WHERE id = $3 RETURNING *;
    `;

    const result = await pool.query(updateQuery, [note, commentaire, id]);

    res.status(200).json({ message: "Avis modifié avec succès.", avis: result.rows[0] });
  } catch (error) {
    console.error('Erreur modification avis achat :', error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
    updateAvisAchat
};