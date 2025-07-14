const express = require('express');
const router = express.Router();
const { CalculatePrice } = require('../controllers/orders/calculate_price.order');
const { getRecapOrder } = require('../controllers/orders/recap.order');
const authenticateToken = require('../middlewares/auth');
const { createOrder } = require('../controllers/orders/create.order');

router.get('/annonces-vente/:annonce_id/calcul-prix', CalculatePrice);
router.post('/commandes-ventes', authenticateToken, createOrder)
router.get('/commandes-ventes/recapitulatif/:command_id', authenticateToken, getRecapOrder);

module.exports = router;
