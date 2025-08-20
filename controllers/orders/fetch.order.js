const { pool } = require('../../config/db');

const getOrders = async (req, res) => {
  try {
    const acheteur_id = req.user.id;

    const result = await pool.query(`
      SELECT 
        u.photo_planteur,
        c.prix_total,
        tc.libelle AS nom_culture
      FROM commandes_vente c
      JOIN annonces_vente a 
        ON c.annonces_vente_id = a.id
      JOIN type_culture tc
        ON a.type_culture_id = tc.id
      JOIN users u
        ON a.user_id = u.id
      WHERE c.acheteur_id = $1
      ORDER BY c.created_at DESC
    `, [acheteur_id]);

    return res.status(200).json({
      commandes: result.rows
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des commandes :', error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = { getOrders };
