const { pool } = require('../../../config/db');

const getOneAchatReview = async (req, res) => {
  try {
    const { avis_achat_id } = req.params;

    const query = `
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
    const result = await pool.query(query, [avis_achat_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Avis non trouvé.' });
    }

    return res.status(200).json({
      message: 'Avis récupéré avec succès.',
      avis: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur récupération avis achat :', error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { getOneAchatReview };
