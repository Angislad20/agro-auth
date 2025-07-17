const { v4: uuidv4 } = require('uuid');
const { pool } = require('../../../config/db');

const createAvisPrefinancement = async (req, res) => {
  try {
    const { note, commentaire, annonce_prefinancement_id } = req.body;
    const noteur_id = req.user.id;

    if (!note || !annonce_prefinancement_id) {
      return res.status(400).json({ message: 'Note et ID annonce requis.' });
    }

    const avis_prefinancement_id = uuidv4();

    const query = `
      INSERT INTO avis_prefinancement (id, note, commentaire, noteur_id, annonce_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
    const result = await pool.query(query, [avis_prefinancement_id, note, commentaire, noteur_id, annonce_prefinancement_id]);

    return res.status(201).json({
      message: 'Avis créé avec succès.',
      avis: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur création avis :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
module.exports = {
  createAvisPrefinancement
};