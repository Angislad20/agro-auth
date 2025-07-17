const { pool } = require('../../../config/db');


const getAllAvisPrefinancement = async (req, res) => {
  try {
    const { annonce_prefinancement_id } = req.params;

    const result = await pool.query(
      `SELECT * FROM avis_prefinancement WHERE id = $1 ORDER BY created_at DESC`,
      [annonce_prefinancement_id]
    );

    res.status(200).json({
      message: 'Avis récupérés avec succès.',
      avis: result.rows
    });

  } catch (error) {
    console.error('Erreur récupération avis :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  getAllAvisPrefinancement
};
