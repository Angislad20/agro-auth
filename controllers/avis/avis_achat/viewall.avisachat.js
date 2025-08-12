const { pool } = require('../../../config/db');

const getAvisByAchatAnnonce = async (req, res) => {
  try {
    const { annonces_achat_id } = req.params;

    const query = `
      SELECT av.*,
             u.nom AS nom_noteur,
             a.photo AS photo_annonce,
             tc.libelle AS nom_produit
      FROM avis_achat av
      JOIN users u ON u.id = av.noteur_id
      JOIN annonces_achat a ON a.id = av.annonces_achat_id
      JOIN type_culture tc ON tc.id = a.type_culture_id
      WHERE av.annonces_achat_id = $1
      ORDER BY av.created_at DESC;
    `;

    const result = await pool.query(query, [annonces_achat_id]);

    return res.status(200).json(result.rows);

  } catch (error) {
    console.error('Erreur récupération avis achat :', error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = { getAvisByAchatAnnonce };
