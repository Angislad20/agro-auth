const { pool } = require('../../config/db');

const updateProfileInfo = async (req, res) => {
  try {
    const { userId } = req.params;
    const { nom, email, numero_tel, photo_planteur, adresse, cultures } = req.body;

    console.log("UUID reçu :", userId);

    // 1️⃣ Vérifier que l'utilisateur existe
    const checkUser = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);
    if (checkUser.rows.length === 0) {
      console.log("Utilisateur non trouvé pour l'UUID :", userId);
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // 2️⃣ Vérifier que les UUID de cultures sont valides et récupérer les libelle
    let cultureLibelles = [];
    if (cultures && Array.isArray(cultures) && cultures.length > 0) {
      const validCulturesQuery = `SELECT libelle FROM type_culture WHERE id = ANY($1)`;
      const validCulturesResult = await pool.query(validCulturesQuery, [cultures]);
      if (validCulturesResult.rows.length !== cultures.length) {
        return res.status(400).json({ message: "Une ou plusieurs cultures sont invalides." });
      }
      cultureLibelles = validCulturesResult.rows.map(row => row.libelle);
    }

    // 3️⃣ Mettre à jour le profil
    const updateUserQuery = `
      UPDATE users
      SET nom = COALESCE($1, nom),
          email = COALESCE($2, email),
          numero_tel = COALESCE($3, numero_tel),
          photo_planteur = COALESCE($4, photo_planteur),
          adresse = COALESCE($5, adresse),
          cultures = COALESCE($6, cultures)
      WHERE id = $7
      RETURNING id, nom, email, numero_tel, photo_planteur, adresse
    `;
    const userResult = await pool.query(updateUserQuery, [
      nom, email, numero_tel, photo_planteur, adresse, cultures || null, userId
    ]);

    console.log("Résultat update :", userResult.rows);

    return res.status(200).json({
      message: "Profil mis à jour avec succès",
      user: {
        ...userResult.rows[0],
        cultures: cultureLibelles // seulement les libelle
      }
    });

  } catch (error) {
    console.error("Erreur updateProfile:", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { updateProfileInfo };
