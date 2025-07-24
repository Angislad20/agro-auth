const express = require('express');
const router = express.Router();
const { CalculatePrice } = require('../controllers/orders/calculate_price.order');
const { getRecapOrder } = require('../controllers/orders/recap.order');
const authenticateToken = require('../middlewares/auth');
const { createOrder } = require('../controllers/orders/create.order');
const { getOrders } = require('../controllers/orders/fetch.order');

router.get('/annonces-vente/:annonce_id/calcul-prix', CalculatePrice);
router.post('/commandes-ventes', createOrder);
router.get('/commandes-ventes/recapitulatif/:command_id', getRecapOrder);
router.get('/commandes-ventes', getOrders);


module.exports = router;
