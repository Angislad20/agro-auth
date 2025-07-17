const { v4: uuidv4 } = require('uuid');
const { pool } = require('../../../config/db');

const createAchatReview = async (req, res) => {
  try {
    const noteur_id = req.user.id;
    const { note, commentaire, annonce_achat_id } = req.body;

    if (!note || !annonce_achat_id) {
      return res.status(400).json({ message: 'Note et ID annonce requis.' });
    }

    const avis_achat_id = uuidv4();

    const insertQuery = `
      INSERT INTO avis_achat (id, note, commentaire, noteur_id, annonce_achat_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      avis_achat_id, note, commentaire, noteur_id, annonce_achat_id
    ]);

    return res.status(201).json({
      message: "Avis ajouté avec succès.",
      avis: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur création avis achat :', error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};


module.exports = {
  createAchatReview
};