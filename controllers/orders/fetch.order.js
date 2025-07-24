const { pool } = require('../../config/db');

const getOrders = async (req, res) => {
  try {
    // Priorité au token, puis query param, sinon valeur fictive par défaut
    const acheteur_id = req.user?.id || req.query.acheteur_id || '31721b68-a26c-4492-9950-8791e8a67db6'; // <-- ID test ici

    // Si tu veux forcer un 400 quand pas d'ID du tout, tu peux supprimer la valeur par défaut ci-dessus

    const result = await pool.query(`
      SELECT 
        c.id,
        c.quantite,
        c.prix_total,
        c.statut,
        c.created_at,
        a.type_culture_id,
        a.prix_kg,
        m.libelle AS mode_paiement
      FROM commandes_vente c
      JOIN annonces_vente a ON c.annonces_vente_id = a.id
      LEFT JOIN moyens_paiement m ON c.mode_paiement_id = m.id
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
