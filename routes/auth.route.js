const express = require('express');
const router = express.Router();

const { register } = require('../controllers/register.controller');
const { login } = require('../controllers/login.controller');
const { deleteUser } = require('../controllers/delete_user.controller');
const authenticateToken = require('../middlewares/auth');
const isAdminOrSelf = require('../middlewares/authorization');
const { updateProfile } = require('../controllers/update_profile.controller');
const { getUserInfo } = require('../controllers/get_user.controller');
const { logout } = require('../controllers/logout.controller');

router.post('/inscription', register);
router.post('/connexion', login);
router.delete('/supprimer-utilisateur/:id', authenticateToken, isAdminOrSelf, deleteUser);
router.put('/modifier-profil/:id', authenticateToken, updateProfile);
router.get('/utilisateur/:id', authenticateToken, isAdminOrSelf, getUserInfo);
router.post('/deconnexion', authenticateToken, logout);

module.exports = router;
