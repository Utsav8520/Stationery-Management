const express = require('express');
const analyticsController = require('../controllers/analytics.controller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN']));

router.get('/sales', analyticsController.getSalesAnalytics);
router.get('/stock', analyticsController.getStockAnalytics);
router.get('/orders', analyticsController.getOrderAnalytics);

module.exports = router;
