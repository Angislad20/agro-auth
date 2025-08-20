// POST /paiement
app.post("/paiement", async (req, res) => {
  const { commandeId, acheteurId, vendeurId, montant } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO transactions (commande_id, acheteur_id, vendeur_id, montant, statut)
       VALUES ($1, $2, $3, $4, 'EN_ATTENTE')
       RETURNING *`,
      [commandeId, acheteurId, vendeurId, montant, 'EN_ATTENTE']
    );

    res.status(200).json({
      message: "Paiement reçu et stocké en séquestre",
      transaction: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
