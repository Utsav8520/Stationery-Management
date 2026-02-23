const express = require('express');
const deliveryController = require('../controllers/delivery.controller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const router = express.Router();

router.use(authMiddleware);

// Admin routes
router.post('/', roleMiddleware(['ADMIN']), deliveryController.createDelivery);
router.put('/:id/status', roleMiddleware(['ADMIN']), deliveryController.updateDeliveryStatus);
router.put('/:id/assign', roleMiddleware(['ADMIN']), deliveryController.assignRider);

router.get('/', roleMiddleware(['ADMIN']), deliveryController.getAllDeliveries);

// Public/User route (Authenticated)
router.get('/:orderId', deliveryController.getDeliveryDetails);

module.exports = router;
