const { pool } = require('../../../config/db');

const getAllAvisPrefinancement = async (req, res) => {
  try {
    const { annonces_prefinancement_id } = req.params;

    const result = await pool.query(`
      SELECT av.*,
        u.nom AS nom_noteur,
        a.photo AS photo_annonce,
        tc.libelle AS nom_produit
      FROM avis_prefinancement av
      JOIN users u ON u.id = av.noteur_id
      JOIN annonces_prefinancement a ON a.id = av.annonces_prefinancement_id
      JOIN type_culture tc ON tc.id = a.type_culture_id
      WHERE av.annonces_prefinancement_id = $1
      ORDER BY av.created_at DESC
    `, [annonces_prefinancement_id]);

    res.status(200).json(result.rows);

  } catch (error) {
    console.error('Erreur récupération avis préfinancement :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = { getAllAvisPrefinancement };