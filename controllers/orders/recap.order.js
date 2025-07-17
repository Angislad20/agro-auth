const { pool } = require('../../config/db');

const getRecapOrder = async (req, res) => {
  try {
    const commandId = req.params.command_id;

    const query = `
      SELECT
        c.id AS commande_id,
        c.quantite,
        c.statut AS statut_commande,
        c.mode_paiement,
        a.id AS annonce_id,
        a.type_culture_id AS nom_culture_id,
        a.prix_kg AS prix_unitaire,
        a.user_id,
        u.nom,
        u.numero_tel
      FROM commandes_vente c
      JOIN annonces_vente a ON c.annonces_vente_id = a.id
      JOIN users u ON a.user_id = u.id
      WHERE c.id = $1
    `;

    const result = await pool.query(query, [commandId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Commande non trouvée.' });
    }

    const data = result.rows[0];

    const montantTotal = data.prix_unitaire * data.quantite;
    const initiale = data.nom?.charAt(0).toUpperCase() || '';
    const peutAfficherNumero = data.mode_paiement !== 'carte_bancaire';

    return res.status(200).json({
      commande_id: data.commande_id,
      quantite: data.quantite,
      prix_unitaire: data.prix_unitaire,
      montant_total: montantTotal,
      statut_commande: data.statut_commande,
      mode_paiement: data.mode_paiement,
      producteur: {
        id: data.auteur_id,
        nom_complet: data.nom,
        initiale: initiale,
        numero_tel: peutAfficherNumero ? data.numero_tel : null
      },
      peut_afficher_numero: peutAfficherNumero
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la commande :', error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  getRecapOrder
};
