const { pool } = require('../../../config/db');
const { v4: uuidv4 } = require('uuid');

const createAvisVente = async (req, res) => {
  try {
    const { note, commentaire, annonce_vente_id } = req.body;
    const noteur_id = req.user.id;

    if (!note || !annonce_vente_id) {
      return res.status(400).json({ message: 'Note et ID annonce requis.' });
    }

    const avis_vente_id = uuidv4();
    const query = `
      INSERT INTO avis_vente (id, note, commentaire, noteur_id, annonce_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const result = await pool.query(query, [avis_vente_id, note, commentaire, noteur_id, annonce_vente_id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur ajout avis vente:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  createAvisVente
};
