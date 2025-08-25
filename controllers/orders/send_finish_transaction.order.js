const axios = require("axios");
const { pool } = require("../../config/db");

const finishTransaction = async (req, res) => {
  const { commande_vente_id } = req.params; // ID de la commande

  try {
    // 1️⃣ Vérifier que la commande existe et que son statut est "terminé"
    const { rows } = await pool.query(
      `SELECT id, statut FROM commandes_vente WHERE id = $1`,
      [commande_vente_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Commande introuvable." });
    }

    const commande = rows[0];

    if (commande.statut !== "terminé") {
      return res.status(400).json({ message: "La commande n'est pas terminée." });
    }

    // 2️⃣ Envoyer l'ID de la commande à l'URL externe
    const externalUrl = "http://192.168.252.249:8082/api/commandes-ventes/confirmer-reception";

    try {
      const response = await axios.post(
        externalUrl,
        { commandeId: commande.id },
        { headers: { "Content-Type": "application/json" } }
      );

      // ✅ Notification réussie
      return res.status(200).json({
        message: "Notification envoyée à l’URL externe.",
        commandeId: commande.id,
        externalResponseStatus: response.status,
        externalResponseData: response.data
      });

    } catch (axiosError) {
      // Afficher le détail de l'erreur renvoyée par le serveur externe
      console.error("Erreur notification commande terminée :", axiosError.message);
      if (axiosError.response) {
        console.error("Status :", axiosError.response.status);
        console.error("Data :", axiosError.response.data);
      }
      return res.status(500).json({
        message: "Erreur serveur lors de la notification.",
        detail: axiosError.response?.data || axiosError.message
      });
    }

  } catch (error) {
    console.error("Erreur finishTransaction :", error.message);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { finishTransaction };
