const { pool } = require('../../config/db')


const CalculatePrice = async (req, res) => {
    try {
        const annonceId = req.params.annonce_id;
        const quantity = parseFloat(req.body.quantity);

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Quantité invalide.' });
        }

        const result = await pool.query(
            'SELECT prix FROM annonces_vente WHERE id = $1',
            [annonceId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Annonce non trouvée.' });
        }

        const pricePerUnit = result.rows[0];
        const totalPrice = pricePerUnit * quantity;

        return res.status(200).json({
            pricePerUnit,
            quantity,
            totalPrice
        })
    } catch (error) {
        console.error('Erreur lors du calcul du prix:', error);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
}

module.exports = { CalculatePrice };