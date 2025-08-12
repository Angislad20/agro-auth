const { pool } = require('../../../config/db');

const updateAvisAchat = async (req, res) => {
  try {
    const { avis_achat_id } = req.params;
    const noteur_id = req.user.id;
    const { note, titre, commentaire } = req.body;

    const avis = await pool.query(`SELECT * FROM avis_achat WHERE id = $1`, [avis_achat_id]);
    if (avis.rows.length === 0) {
      return res.status(404).json({ message: "Avis non trouvé." });
    }

    if (avis.rows[0].noteur_id !== noteur_id) {
      return res.status(403).json({ message: "Non autorisé à modifier cet avis." });
    }

    const updateQuery = `
      UPDATE avis_achat
      SET note = $1, titre = $2, commentaire = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
    `;
    await pool.query(updateQuery, [note, titre, commentaire, avis_achat_id]);

    const selectQuery = `
      SELECT av.*,
             u.nom AS nom_noteur,
             a.photo AS photo_annonce,
             tc.libelle AS nom_produit
      FROM avis_achat av
      JOIN users u ON u.id = av.noteur_id
      JOIN annonces_achat a ON a.id = av.annonces_achat_id
      JOIN type_culture tc ON tc.id = a.type_culture_id
      WHERE av.id = $1;
    `;
    const result = await pool.query(selectQuery, [avis_achat_id]);

    return res.status(200).json({
      message: "Avis modifié avec succès.",
      avis: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur modification avis achat :', error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { updateAvisAchat };
