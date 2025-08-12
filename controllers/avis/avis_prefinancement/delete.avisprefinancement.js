const { pool } = require('../../../config/db');

const deleteAvisPrefinancement = async (req, res) => {
  try {
    const { avis_prefinancement_id } = req.params;
    const noteur_id = req.user.id;

    const avis = await pool.query(`SELECT * FROM avis_prefinancement WHERE id = $1`, [avis_prefinancement_id]);
    if (avis.rows.length === 0) return res.status(404).json({ message: "Avis non trouvé." });

    if (avis.rows[0].noteur_id !== noteur_id) {
      return res.status(403).json({ message: "Non autorisé à supprimer cet avis." });
    }

    await pool.query(`DELETE FROM avis_prefinancement WHERE id = $1`, [avis_prefinancement_id]);

    res.status(200).json({ message: "Avis supprimé avec succès." });

  } catch (error) {
    console.error('Erreur suppression avis préfinancement :', error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { deleteAvisPrefinancement };
