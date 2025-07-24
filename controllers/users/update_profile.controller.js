const { pool } = require('../../config/db');

const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id; // UUID
    const authUserId = req.user.id; // Depuis JWT
    const userProfileId = req.user.profil_id;

    console.log('userId param:', userId);
    console.log('auth user ID:', authUserId);
    console.log('Egalité stricte ?', userId === authUserId);

    if (String(req.params.id) !== String(req.user.id)) {
        return res.status(403).json({ message: 'Accès refusé : vous ne pouvez modifier que votre profil.' });
    }


    // Tu peux garder les IDs numériques ou UUID selon ton système
    const profilMap = {
      "f23423d4-ca9e-409b-b3fb-26126ab66581": 'producteur',
      "35a3c32a-17f8-4771-a0d8-9295b1bc5917": 'cooperative',
      "7b74a4f6-67b6-474a-9bf5-d63e04d2a804": 'acheteur',
    };

    const allowedFieldsByProfile = {
      producteur: [
        'numero_CNI', 'numero_carte_planteur',
        'photo_carte_CNI', 'photo_planteur', 'photo_carte_planteur',
        'cooperative_affiliee_id',
        'certifie_bio', 'is_profile_completed'
      ],
      cooperative: [
        'numero_tel', 'adresse',
        'nom_entreprise', 'numero_RCCM',
        'is_profile_completed'
      ],
      acheteur: [
        'numero_tel', 'adresse',
        'nom_entreprise', 'numero_RCCM',
        'is_profile_completed'
      ]
    };

    const profilKey = profilMap[userProfileId];
    if (!profilKey) {
      return res.status(400).json({ message: 'Profil non reconnu.' });
    }

    const allowedFields = allowedFieldsByProfile[profilKey];
    const fields = [];
    const values = [];
    let idx = 1;

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        fields.push(`${key} = $${idx++}`);
        values.push(req.body[key]);
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'Aucun champ à mettre à jour.' });
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    return res.status(200).json({
      message: 'Profil mis à jour avec succès.',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Détails erreur:', error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = { updateProfile };
