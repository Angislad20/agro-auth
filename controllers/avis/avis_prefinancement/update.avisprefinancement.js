const { pool } = require('../../../config/db');


const updateAvisPrefinancement = async (req, res) => {
  try {
    const { avis_prefinancement_id } = req.params;
    const { note, commentaire } = req.body;

    const fields = [];
    const values = [];
    let index = 1;

    if (note !== undefined) {
      fields.push(`note = $${index++}`);
      values.push(note);
    }

    if (commentaire !== undefined) {
      fields.push(`commentaire = $${index++}`);
      values.push(commentaire);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'Aucune donnée à mettre à jour.' });
    }

    values.push(avis_prefinancement_id);
    const query = `UPDATE avis_prefinancement SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Avis non trouvé." });
    }

    res.status(200).json({
      message: "Avis mis à jour avec succès.",
      avis: result.rows[0]
    });

  } catch (error) {
    console.error("Erreur modification avis :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  updateAvisPrefinancement
};
