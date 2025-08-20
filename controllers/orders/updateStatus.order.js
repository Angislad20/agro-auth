const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; // commande_id
    const userId = req.user.id;
    const userRole = req.user?.role; // "acheteur" ou "producteur"

    // Récupérer la commande
    const { rows } = await pool.query(
      `SELECT c.id, c.statut, c.acheteur_id, a.producteur_id, c.prix_total,
              c.livraison_deadline, c.reception_deadline
       FROM commandes_vente c
       JOIN annonces_vente a ON a.id = c.annonces_vente_id
       WHERE c.id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Commande introuvable." });
    }

    const commande = rows[0];
    let newStatus = commande.statut;
    let updates = { livraison_deadline: null, reception_deadline: null };

    // Transition selon le statut actuel
    switch (commande.statut) {
      case COMMANDE_STATUTS.EN_ATTENTE_PAIEMENT:
        if (userRole !== "acheteur" || commande.acheteur_id !== userId) {
          return res.status(403).json({ message: "Non autorisé à valider le paiement." });
        }
        newStatus = COMMANDE_STATUTS.EN_ATTENTE_LIVRAISON;
        updates.livraison_deadline = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

        // ✅ Créer transaction séquestre
        await pool.query(
          `INSERT INTO transactions (commande_id, acheteur_id, vendeur_id, montant, statut)
           VALUES ($1, $2, $3, $4, $5)`,
          [commande.id, commande.acheteur_id, commande.producteur_id, commande.prix_total, TRANSACTION_STATUTS.EN_ATTENTE]
        );
        break;

      case COMMANDE_STATUTS.EN_ATTENTE_LIVRAISON:
        if (userRole !== "producteur" || commande.producteur_id !== userId) {
          return res.status(403).json({ message: "Non autorisé à marquer comme livré." });
        }
        newStatus = COMMANDE_STATUTS.EN_ATTENTE_RECEPTION;
        updates.reception_deadline = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
        break;

      case COMMANDE_STATUTS.EN_ATTENTE_RECEPTION:
        if (userRole !== "acheteur" || commande.acheteur_id !== userId) {
          return res.status(403).json({ message: "Non autorisé à confirmer la réception." });
        }
        newStatus = COMMANDE_STATUTS.TERMINE;

        // ✅ Libérer fonds au producteur
        await pool.query(
          `UPDATE transactions
           SET statut=$1
           WHERE commande_id=$2 AND statut=$3`,
          [TRANSACTION_STATUTS.LIBERE, commande.id, TRANSACTION_STATUTS.EN_ATTENTE]
        );
        console.log("✅ Fonds libérés vers le producteur.");
        break;

      case COMMANDE_STATUTS.ANNULE:
        return res.status(400).json({ message: "Commande déjà annulée." });

      case COMMANDE_STATUTS.TERMINE:
        return res.status(400).json({ message: "Commande déjà terminée." });

      default:
        return res.status(400).json({ message: "Aucune transition possible depuis ce statut." });
    }

    // Mise à jour commande
    await pool.query(
      `UPDATE commandes_vente
       SET statut = $1,
           livraison_deadline = COALESCE($2, livraison_deadline),
           reception_deadline = COALESCE($3, reception_deadline)
       WHERE id = $4`,
      [newStatus, updates.livraison_deadline, updates.reception_deadline, commande.id]
    );

    return res.status(200).json({
      message: `Statut mis à jour : ${newStatus}`,
      newStatus
    });

  } catch (error) {
    console.error("Erreur updateOrderStatus avec séquestre :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const COMMANDE_STATUTS = {
  EN_ATTENTE_PAIEMENT: "en attente de paiement",
  EN_ATTENTE_LIVRAISON: "en attente de livraison",
  EN_ATTENTE_RECEPTION: "en attente de réception",
  TERMINE: "terminé",
  ANNULE: "annulé"
};

const TRANSACTION_STATUTS = {
  EN_ATTENTE: "EN_ATTENTE",
  LIBERE: "LIBERE",
  ANNULE: "ANNULE"
};

module.exports = { updateOrderStatus };