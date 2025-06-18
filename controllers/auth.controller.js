const bcrypt = require('bcrypt');
const { Wallet } = require('ethers');
const pool = require('../config/db');
const { sendUserCreateEvent } = require('../kafka/producer');

exports.register = async (req, res) => {
    try {
        const { username, email, telephone, password, profil_id } = req.body;

        // Validation des champs obligatoires
         if (!username || !email || !telephone || !password || !profil_id ) {
            return res.status(400).json({
                message: 'tous les champs sont obligatoires.'
            });
        }

        // Vérification unicité du nom d'utilisateur
        const existingUsername = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
        if (existingUsername.rows.length > 0) {
            return res.status(400).json({
                message: "Ce nom d'utlisateur est déja utilisé."
            })
        }

        // Vérification unicité de l'email
        const existingEmail = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingEmail.rows.length > 0) {
            return res.status(409).json({
                message: "Cet email à appartient déja à un utilisateur."
            })
        }

        // Hasher le mot de passe
        const hashePassword = await bcrypt.hash(password, 10)

        // Generation de l'adresse wallet (blockachain)
        const wallet = Wallet.createRandom();
        const wallet_address = wallet.address;

        // Insertion utilisateur dans la BD
        const insertQuery = `
        INSERT INTO users (
            username, email, telephone, password, profil_id,
            wallet_address, is_profile_completed
        ) VALUES (
            $1, $2, $3, $4,
            $5, $6, false
        )
        RETURNING id, email, telephone, profil_id, nom, prenoms, wallet_address
        `;

        const values = [username, email, telephone, hashePassword, profil_id, wallet_address];
        const result = await pool.query(insertQuery, values);
        const user = result.rows[0];


        // Envoi d'evenement Kafka
        await sendUserCreateEvent(user);
        return res.status(201).json({
        message: 'Compte créé avec succès.',
        user
        });

    } catch(error) {
        console.error('Erreur lors de l\'inscription:', error);
        return res.status(500).json({ 
            message: 'Erreur serveur.' 
        });
    }      
}; 
