const { pool } = require('../config/db');


const updateProfile = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const authUserId = req.user.id;
        const userProfileId = req.user.profil_id;

        // Vérification que l'utilisateur authentifié ne peut modifier que son propre profil
        if (userId !== authUserId) {
            return res.status(403).json({ message: 'Accès refusé: Vous ne pouvez modifier que votre profil.' });
        }

        const profilMap = {
            1: 'producteur',
            2: 'acheteur',
        }


        const allowsFieldsByProfile = {
            producteur: ['nom', 'prenoms', 'telephone', 'adresse', 'certifie_bio', 'is_profile_completed'],
            acheteur: ['nom', 'prenoms', 'telephone', 'adresse', 'nom_entreprise', 'numero_RCCM', 'is_profile_completed']
        };


        const profilKey = profilMap[userProfileId];

        // Vérification que le profil de l'utilisateur est reconnu
        if (!profilKey) {
            return res.status(400).json({ message: 'Profil non reconnu.' });
        }

        // Vérification que les champs à mettre à jour sont autorisés pour le profil
        const allowFields = allowsFieldsByProfile[profilKey];

        const fields = [];
        const values = [];
        let idx = 1;

        // Vérification que les champs fournis dans la requête sont autorisés
        for (const key of allowFields) {
            if (req.body[key] !== undefined) {
                fields.push(`${key} = $${idx++}`);
                values.push(req.body[key]);
            }
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: 'Aucun champ à mettre à jour.' });
        }

        // Ajout de l'ID de l'utilisateur à la fin des valeurs pour la clause WHERE
        fields.push('update_at = CURRENT_TIMESTAMP');
        values.push(userId);

        // Construction de la requête SQL pour mettre à jour le profil
        const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
        const result = await pool.query(query, values);

        if(result.rows.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        return res.status(200).json({ message: 'Profil mis à jour avec succès.', user: result.rows[0] });
    } catch (error) {
        console.error('Détails erreur:', error);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
};

module.exports = { updateProfile };