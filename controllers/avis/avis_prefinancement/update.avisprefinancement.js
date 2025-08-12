const { pool } = require('../../../config/db');

const updateAvisPrefinancement = async (req, res) => {
  try {
    const { avis_prefinancement_id } = req.params;
    const noteur_id = req.user.id;
    const { note, commentaire, titre } = req.body;

    const avis = await pool.query(`SELECT * FROM avis_prefinancement WHERE id = $1`, [avis_prefinancement_id]);
    if (avis.rows.length === 0) return res.status(404).json({ message: "Avis non trouvé." });

    if (avis.rows[0].noteur_id !== noteur_id) {
      return res.status(403).json({ message: "Non autorisé à modifier cet avis." });
    }

    const updateQuery = `
      UPDATE avis_prefinancement
      SET note = $1, commentaire = $2, titre = $3, created_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;

    await pool.query(updateQuery, [note, commentaire, titre, avis_prefinancement_id]);

    const selectQuery = `
      SELECT av.*,
        u.nom AS nom_noteur,
        a.photo AS photo_annonce,
        tc.libelle AS nom_produit
      FROM avis_prefinancement av
      JOIN users u ON u.id = av.noteur_id
      JOIN annonces_prefinancement a ON a.id = av.annonces_prefinancement_id
      JOIN type_culture tc ON tc.id = a.type_culture_id
      WHERE av.id = $1;
    `;

    const result = await pool.query(selectQuery, [avis_prefinancement_id]);

    res.status(200).json({
      message: "Avis modifié avec succès.",
      avis: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur modification avis préfinancement :', error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { updateAvisPrefinancement };
