const { pool } = require('../../../config/db');


const deleteAvisPrefinancement = async (req, res) => {
  try {
    const { avis_prefinancement_id } = req.params;

    const result = await pool.query(`DELETE FROM avis_prefinancement WHERE id = $1 RETURNING *`, [avis_prefinancement_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Avis non trouvé." });
    }

    res.status(200).json({ message: "Avis supprimé avec succès." });

  } catch (error) {
    console.error("Erreur suppression avis :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  deleteAvisPrefinancement
};