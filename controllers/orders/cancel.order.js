const cancelOrder = async (req, res) => {
  try {
    const acheteur_id = req.user.id;
    const { commandes_vente_id } = req.params;

    // Récupérer la commande
    const { rows } = await pool.query(
      `SELECT id, statut, acheteur_id
       FROM commandes_vente
       WHERE id = $1`,
      [commandes_vente_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Commande introuvable." });
    }

    const commande = rows[0];

    // Vérifier propriétaire
    if (commande.acheteur_id !== acheteur_id) {
      return res.status(403).json({ message: "Non autorisé à annuler cette commande." });
    }

    // Vérifier que ce n'est pas déjà terminé ou annulé
    if (["terminé", "annulé"].includes(commande.statut)) {
      return res.status(400).json({ message: "Impossible d’annuler cette commande." });
    }

    // Mise à jour du statut
    await pool.query(
      `UPDATE commandes_vente
       SET statut = 'annulé'
       WHERE id = $1`,
      [commandes_vente_id]
    );

    return res.status(200).json({ message: "Commande annulée avec succès." });
  } catch (error) {
    console.error("Erreur lors de l’annulation :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};
