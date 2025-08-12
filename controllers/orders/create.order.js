const { pool } = require('../../config/db');
const { v4: uuidv4 } = require('uuid');

const STATUTS_VALIDES = [
  'en attente de confirmation',
  'en attente de paiement',
  'en attente de réception',
  'terminé'
];

const createOrder = async (req, res) => {
  try {
    const acheteur_id = req.user.id;
    const {
      annonces_vente_id,
      quantite,
      unite,
      types_paiement_id,
      statut = 'en attente de paiement'
    } = req.body;

    if (!annonces_vente_id || !quantite || !unite || !types_paiement_id) {
      return res.status(400).json({ message: 'Champs obligatoires manquants.' });
    }

    // Vérifier que le type de paiement existe
    const mpCheck = await pool.query(
      'SELECT id FROM types_paiement WHERE id = $1',
      [types_paiement_id]
    );
    if (mpCheck.rows.length === 0) {
    }

    // Récupère le prix unitaire et le type de culture
    const annonceCheck = await pool.query(
      `SELECT a.prix_kg, t.libelle AS type_culture
       FROM annonces_vente a
       JOIN type_culture t ON a.type_culture_id = t.id
       WHERE a.id = $1`,
      [annonces_vente_id]
    );

    if (annonceCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Annonce non trouvée.' });
    }

    const { prix_kg, type_culture } = annonceCheck.rows[0];
    const quantiteKg = unite === 'T' ? quantite * 1000 : quantite;
    const prix_total = quantiteKg * prix_kg;

    if (!STATUTS_VALIDES.includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide.' });
    }

    const newCommandId = uuidv4();

    const insertQuery = `
      INSERT INTO commandes_vente (
        id, annonces_vente_id, acheteur_id, quantite, prix_total, types_paiement_id, statut, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP
      )
      RETURNING id, acheteur_id, quantite, prix_total, types_paiement_id, statut, created_at;
    `;

    const result = await pool.query(insertQuery, [
      newCommandId,
      annonces_vente_id,
      acheteur_id,
      quantiteKg,
      prix_total,
      types_paiement_id,
      statut
    ]);

    const commande = {
      ...result.rows[0],
      type_culture
    };

    return res.status(201).json({
      message: 'Commande enregistrée avec succès.',
      commande
    });

  } catch (error) {
    console.error('Erreur lors de l’enregistrement de la commande :', error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = { createOrder };
