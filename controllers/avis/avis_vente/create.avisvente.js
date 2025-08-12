const { pool } = require('../../../config/db');
const { v4: uuidv4 } = require('uuid');

const createAvisVente = async (req, res) => {
  try {
    const { note, titre, commentaire, annonces_vente_id } = req.body;
    const noteur_id = req.user.id;

    if (!note || !annonces_vente_id) {
      return res.status(400).json({ message: 'Note et ID annonce requis.' });
    }

    const avis_vente_id = uuidv4();
    const insertQuery = `
      INSERT INTO avis_vente (id, note, titre, commentaire, noteur_id, annonces_vente_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

   await pool.query(insertQuery, [avis_vente_id, note, titre, commentaire, noteur_id, annonces_vente_id]);


    const selectQuery = `SELECT av.*,
    u.nom AS nom_noteur,
    a.photo AS photo_annonce,
    tc.libelle AS nom_produit
    FROM avis_vente av
    JOIN users u ON u.id = av.noteur_id
    JOIN annonces_vente a ON a.id = av.annonces_vente_id
    JOIN type_culture tc ON tc.id = a.type_culture_id
    WHERE av.id = $1;
    `;

    const result = await pool.query(selectQuery, [avis_vente_id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur ajout avis vente:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  createAvisVente
};
