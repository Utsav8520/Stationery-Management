const express = require('express');
const creditController = require('../controllers/credit.controller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN'])); // Only admins manage credit

router.post('/parties', creditController.createParty);
router.get('/parties', creditController.getParties);
router.get('/parties/:id', creditController.getPartyById);
router.post('/transactions', creditController.createTransaction);
router.get('/transactions/:partyId', creditController.getTransactions);
router.get('/balance/:partyId', creditController.getPartyBalance);

module.exports = router;
