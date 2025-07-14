// controllers/get_user.controller.js
const { pool } = require('../../config/db');

const getUserInfo = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const currentUser = req.user;

    // Récupération de l'utilisateur cible
    const result = await pool.query(
      `SELECT id, username, email, nom, prenoms, telephone, adresse,
              nom_entreprise, numero_RCCM, profil_id, wallet_address,
              certifie_bio, is_profile_completed, status, created_at, updated_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const user = result.rows[0];

    // Contrôle de ce qu'on retourne selon le profil
    let responseUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      nom: user.nom,
      prenoms: user.prenoms,
      telephone: user.telephone,
      adresse: user.adresse,
      certifie_bio: user.certifie_bio,
      is_profile_completed: user.is_profile_completed,
      profil_id: user.profil_id,
      status: user.status
    };

    // S’il est acheteur (profil_id === 2), on ajoute les infos d'entreprise
    if (user.profil_id === 2) {
      responseUser.nom_entreprise = user.nom_entreprise;
      responseUser.numero_RCCM = user.numero_RCCM;
    }

    // Si l'utilisateur connecté est un admin, il voit tout
    const isAdmin = currentUser.profil_id === 3;
    if (isAdmin) {
      responseUser.wallet_address = user.wallet_address;
      responseUser.created_at = user.created_at;
      responseUser.updated_at = user.updated_at;
    }

    return res.status(200).json({ user: responseUser });

  } catch (error) {
    console.error('Erreur récupération utilisateur :', error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = { getUserInfo };
