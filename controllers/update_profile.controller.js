const { pool } = require('../config/db');

const updateProfile = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const authUserId = req.user.id;
        const userProfileId = req.user.profil_id;

        if (userId !== authUserId) {
            return res.status(403).json({ message: 'Accès refusé : vous ne pouvez modifier que votre profil.' });
        }

        const profilMap = {
            1: 'producteur',
            2: 'cooperative',
            3: 'acheteur'
        };

        const allowedFieldsByProfile = {
            producteur: [
                'nom', 'email', 'numero_tel', 'adresse',
                'numero_CNI', 'numero_carte_planteur',
                'photo_carte_CNI', 'photo_planteur', 'photo_carte_planteur',
                'cooperative_affiliee_id',
                'certifie_bio', 'is_profile_completed'
            ],
            cooperative: [
                'nom', 'email', 'numero_tel', 'adresse',
                'nom_entreprise', 'numero_RCCM',
                'is_profile_completed'
            ],
            acheteur: [
                'nom', 'email', 'numero_tel', 'adresse',
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

        // Ajout automatique de updated_at
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
