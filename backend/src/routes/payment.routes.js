const express = require('express');
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Initiate payment (Authenticated)
router.post('/khalti/initiate', authMiddleware, paymentController.initiateKhaltiPayment);

// Callback (Public - called by Khalti)
router.get('/khalti/callback', paymentController.khaltiCallback);

// Get status (Authenticated)
router.get('/:orderId', authMiddleware, paymentController.getPaymentStatus);

module.exports = router;
