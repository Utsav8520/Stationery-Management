const express = require('express');
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const router = express.Router();

router.use(authMiddleware);

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);

// Admin routes
router.put('/:id/status', roleMiddleware(['ADMIN']), orderController.updateOrderStatus);

module.exports = router;
