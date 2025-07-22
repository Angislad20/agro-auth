const express = require('express');
const router = express.Router();

const { getAvisVenteByAnnonce } = require('../controllers/avis/avis_vente/viewall.avisvente');
const { getOneAvisVente } = require('../controllers/avis/avis_vente/viewone.avisvente');
const { createAvisVente } = require('../controllers/avis/avis_vente/create.avisvente');
const { deleteAvisVente } = require('../controllers/avis/avis_vente/delete.avisvente');
const { updateAvisVente } = require('../controllers/avis/avis_vente/update.avisvente');

const { getAvisByAchatAnnonce } = require('../controllers/avis/avis_achat/viewall.avisachat');
const { getOneAchatReview } = require('../controllers/avis/avis_achat/viewone.avisachat');
const { createAchatReview } = require('../controllers/avis/avis_achat/create.avisachat');
const { deleteAvisAchat } = require('../controllers/avis/avis_achat/delete.avisachat');
const { updateAvisAchat } = require('../controllers/avis/avis_achat/update.avisachat');

const { createAvisPrefinancement } = require('../controllers/avis/avis_prefinancement/create.avisprefinancement');
const { getAllAvisPrefinancement } = require('../controllers/avis/avis_prefinancement/viewall.avisprefinancement');
const { getOneAvisPrefinancement } = require('../controllers/avis/avis_prefinancement/viewone.avisprefinancement');
const { deleteAvisPrefinancement } = require('../controllers/avis/avis_prefinancement/delete.avisprefinancement');
const { updateAvisPrefinancement } = require('../controllers/avis/avis_prefinancement/update.avisprefinancement');

const authenticateToken = require('../middlewares/auth');

// Routes for Avis Vente
router.get('/avis-vente/annonce/:annonce_id', getAvisVenteByAnnonce);
router.get('/avis-vente/:avis_vente_id', getOneAvisVente);
router.post('/avis-vente', authenticateToken, createAvisVente);
router.delete('/avis-vente/:avis_vente_id', authenticateToken, deleteAvisVente);
router.put('/avis-vente/:avis_vente_id', authenticateToken, updateAvisVente);

// Routes for Avis Achat
router.get('/avis-achat/annonce/:annonce_id', getAvisByAchatAnnonce);
router.get('/avis-achat/:id', getOneAchatReview);
router.post('/avis-achat', authenticateToken, createAchatReview);
router.delete('/avis-achat/:id', authenticateToken, deleteAvisAchat);
router.put('/avis-achat/:id', authenticateToken, updateAvisAchat);

// Routes for Avis Prefinancement
router.get('/avis-prefinancement/annonce/:annonce_id', getAllAvisPrefinancement);
router.get('/avis-prefinancement/:avis_prefinancement_id', getOneAvisPrefinancement);
router.post('/avis-prefinancement', authenticateToken, createAvisPrefinancement);
router.delete('/avis-prefinancement/:avis_prefinancement_id', authenticateToken, deleteAvisPrefinancement);
router.put('/avis-prefinancement/:avis_prefinancement_id', authenticateToken, updateAvisPrefinancement);


module.exports = router;        