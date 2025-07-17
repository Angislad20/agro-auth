const { pool } = require('../../../config/db');

const getOneAchatReview = async (req, res) => {
  try {
    const avis_achat_id = req.params.avis_achat_id;

    const query = `SELECT * FROM avis_achat WHERE id = $1`;
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
