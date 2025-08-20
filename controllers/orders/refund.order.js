// POST /liberer-fonds
app.post("/liberer-fonds", async (req, res) => {
  const { transactions_vente_id } = req.body;

  try {
    await pool.query(
      `UPDATE transactions_vente
       SET statut='LIBERE'
       WHERE id=$1 AND statut='EN_ATTENTE'`,
      [transactions_vente_id]
    );

    res.status(200).json({ message: "Fonds libérés au vendeur" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
