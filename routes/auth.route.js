const express = require('express');
const router = express.Router()
const authController = require('../controllers/auth.controller')


router.post('/inscription', authController.register);

module.exports = router