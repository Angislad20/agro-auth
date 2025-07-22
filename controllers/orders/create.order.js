const { pool } = require('../../config/db');
const { v4: uuidv4 } = require('uuid');

const STATUTS_VALIDES = [
  'en cours',
  'en attente de paiement',
  'annulé',
  'terminé'
];

const createOrder = async (req, res) => {
  try {
    const acheteur_id = req.user.id;
    const {
      annonces_vente_id,
      quantite,
      unite,
      mode_paiement_id,
      statut = 'en attente de paiement' // valeur par défaut
    } = req.body;

    // Validation des champs essentiels
    if (!annonces_vente_id || !quantite || !unite) {
      return res.status(400).json({ message: 'Champs obligatoires manquants.' });
    }

    // Vérifier que l'annonce existe et récupérer le prix
    const annonceCheck = await pool.query(
      'SELECT prix_kg FROM annonces_vente WHERE id = $1',
      [annonces_vente_id]
    );

    if (annonceCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Annonce non trouvée.' });
    }

    const prixUnitaire = annonceCheck.rows[0].prix_kg;

    const quantiteKg = unite === 'T' ? quantite * 1000 : quantite;

    const prix_total = quantiteKg * prixUnitaire;

    // Vérifier si le statut est valide
    if (!STATUTS_VALIDES.includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide.' });
    }

    const newCommandId = uuidv4();

    const insertQuery = `
      INSERT INTO commandes_vente (
        id, annonces_vente_id, acheteur_id, quantite, prix_total, mode_paiement_id, statut, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP
      )
      RETURNING *;
    `;

    const result = await pool.query(insertQuery, [
      newCommandId,
      annonces_vente_id,
      acheteur_id,
      quantiteKg,
      prix_total,
      mode_paiement_id,
      statut
    ]);

    return res.status(201).json({
      message: 'Commande enregistrée avec succès.',
      commande: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur lors de l’enregistrement de la commande :', error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = { createOrder };
