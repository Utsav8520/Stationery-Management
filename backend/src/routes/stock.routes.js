const express = require('express');
const stockController = require('../controllers/stock.controller');
const productController = require('../controllers/product.controller'); // Reuse bulkReduceStock from product controller
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN']));

router.get('/history', stockController.getAllStockHistory);
router.get('/history/:productId', stockController.getStockHistory);
router.post('/bulk-reduce', productController.bulkReduceStock);
router.post('/bulk-add', productController.bulkAddStock);

module.exports = router;
