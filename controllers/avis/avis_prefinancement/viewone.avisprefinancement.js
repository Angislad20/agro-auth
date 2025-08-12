const { pool } = require('../../../config/db');

const getOneAvisPrefinancement = async (req, res) => {
  try {
    const { avis_prefinancement_id } = req.params;

    const result = await pool.query(`
      SELECT av.*,
        u.nom AS nom_noteur,
        a.photo AS photo_annonce,
        tc.libelle AS nom_produit
      FROM avis_prefinancement av
      JOIN users u ON u.id = av.noteur_id
      JOIN annonces_prefinancement a ON a.id = av.annonces_prefinancement_id
      JOIN type_culture tc ON tc.id = a.type_culture_id
      WHERE av.id = $1
    `, [avis_prefinancement_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Avis non trouvé.' });
    }

    return res.status(200).json({
      message: 'Avis récupéré avec succès.',
      avis: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur récupération avis préfinancement :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = { getOneAvisPrefinancement };
