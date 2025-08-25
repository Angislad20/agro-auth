const { pool } = require('../../../config/db');


const getAvisVenteByAnnonce = async (req, res) => {
  try {
    const { annonce_id } = req.params;
    const query = `SELECT * FROM avis_vente WHERE annonce_id = $1 ORDER BY created_at DESC`;
    const result = await pool.query(query, [annonce_id]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erreur récupération avis vente:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


module.exports = {
  getAvisVenteByAnnonce
};
