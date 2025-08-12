const { v4: uuidv4 } = require('uuid');
const { pool } = require('../../../config/db');

const createAchatReview = async (req, res) => {
  try {
    const noteur_id = req.user.id;
    const { note, titre, commentaire, annonces_achat_id } = req.body;

    if (!note || !annonces_achat_id) {
      return res.status(400).json({ message: 'Note et ID annonce requis.' });
    }

    const avis_achat_id = uuidv4();

    const insertQuery = `
      INSERT INTO avis_achat (id, note, titre, commentaire, noteur_id, annonces_achat_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    await pool.query(insertQuery, [avis_achat_id, note, titre, commentaire, noteur_id, annonces_achat_id]);

    const selectQuery = `
      SELECT av.*,
             u.nom AS nom_noteur,
             a.photo AS photo_annonce,
             tc.libelle AS nom_produit
      FROM avis_achat av
      JOIN users u ON u.id = av.noteur_id
      JOIN annonces_achat a ON a.id = av.annonces_achat_id
      JOIN type_culture tc ON tc.id = a.type_culture_id
      WHERE av.id = $1;
    `;

    const result = await pool.query(selectQuery, [avis_achat_id]);

    return res.status(201).json({
      message: "Avis ajouté avec succès.",
      avis: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur création avis achat :', error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { createAchatReview };
