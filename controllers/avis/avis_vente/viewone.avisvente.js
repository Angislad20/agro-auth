const { pool } = require('../../../config/db');


const getOneAvisVente = async (req, res) => {
  try {
    const { avis_vente_id } = req.params;

    const result = await pool.query(
      `SELECT * FROM avis_vente WHERE id = $1`, [avis_vente_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Avis non trouvé." });
    }

    res.status(200).json({
      message: "Avis récupéré avec succès.",
      avis: result.rows[0]
    });

  } catch (error) {
    console.error("Erreur récupération avis :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  getOneAvisVente
};
