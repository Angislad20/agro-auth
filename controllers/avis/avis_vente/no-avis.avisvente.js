const { pool } = require('../../../config/db');

// Récupérer les commandes terminées dont l'avis est encore en attente
const getLoadingOpinions = async (req, res) => {
  try {
    const noteur_id = req.user.id; // noteur_id depuis le JWT

    const result = await pool.query(
      `
      SELECT 
          c.id AS commande_id,
          c.quantite,
          c.prix_total,
          c.date_fin,
          tc.libelle AS produit_nom,
          a.photo_url
      FROM commandes_vente c
      INNER JOIN annonces_vente a ON c.annonces_vente_id = a.id
      INNER JOIN type_culture tc ON a.type_culture_id = tc.id
      LEFT JOIN avis_vente av ON av.annonces_vente_id = a.id AND av.statut = 'en-attente'
      WHERE c.user_id = $1
        AND c.statut = 'terminé'
        AND av.id IS NULL
      ORDER BY c.reception_deadline DESC
      `,
      [noteur_id]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "Aucune commande en attente d'avis." });
    }

    // Formatage pour le front
    const commandes = result.rows.map((row) => ({
      numero_commande: `Commande n°${row.commande_id}`,
      produit: {
        nom: row.produit_nom,
        photo: row.photo_url
      },
      total_paye: row.prix_total,
      date_fin: row.date_fin
    }));

    res.status(200).json({
      message: "Commandes à évaluer récupérées avec succès.",
      commandes
    });

  } catch (error) {
    console.error("Erreur récupération commandes :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { getLoadingOpinions };
