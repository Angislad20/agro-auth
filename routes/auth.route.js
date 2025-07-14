const express = require('express');
const router = express.Router();

const { register } = require('../controllers/users/register.controller');
const { login } = require('../controllers/users/login.controller');
const { deleteUser } = require('../controllers/users/delete_user.controller');
const authenticateToken = require('../middlewares/auth');
const isAdminOrSelf = require('../middlewares/authorization');
const { updateProfile } = require('../controllers/users/update_profile.controller');
const { getUserInfo } = require('../controllers/users/get_user.controller');
const { logout } = require('../controllers/users/logout.controller');

router.post('/inscription', register);
router.post('/connexion', login);
router.delete('/supprimer-utilisateur/:id', authenticateToken, isAdminOrSelf, deleteUser);
router.put('/modifier-profil/:id', authenticateToken, updateProfile);
router.get('/utilisateur/:id', authenticateToken, isAdminOrSelf, getUserInfo);
router.post('/deconnexion', authenticateToken, logout);

module.exports = router;
