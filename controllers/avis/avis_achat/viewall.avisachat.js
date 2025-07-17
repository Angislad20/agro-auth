const { pool } = require('../../../config/db');


const getAvisByAchatAnnonce = async (req, res) => {
  try {
    const { annonce_achat_id } = req.params;

    const result = await pool.query(
      'SELECT * FROM avis_achat WHERE annonce_achat_id = $1 ORDER BY created_at DESC',
      [annonce_achat_id]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erreur récupération avis achat :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


module.exports = {
  getAvisByAchatAnnonce,
}