const cron = require("node-cron");
const { pool } = require('./config/db');

cron.schedule("*/10 * * * *", async () => {
  console.time("CRON");
  console.log("⏳ Vérification des commandes en attente...");
  try {
    const livraisonRes = await pool.query(
      `UPDATE commandes_vente
       SET statut = 'annulé'
       WHERE statut = 'en attente de livraison'
       AND livraison_deadline < NOW()
       RETURNING id`
    );
    if (livraisonRes.rowCount > 0) {
      console.log(`❌ ${livraisonRes.rowCount} commande(s) annulée(s) (délai livraison dépassé)`);
    }

    const receptionRes = await pool.query(
      `UPDATE commandes_vente
       SET statut = 'annulé'
       WHERE statut = 'en attente de réception'
       AND reception_deadline < NOW()
       RETURNING id`
    );
    if (receptionRes.rowCount > 0) {
      console.log(`❌ ${receptionRes.rowCount} commande(s) annulée(s) (délai réception dépassé)`);
    }
  } catch (error) {
    console.error("Erreur CRON :", error);
  }
  console.timeEnd("CRON");
});
