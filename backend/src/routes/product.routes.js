const express = require('express');
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);

// Admin routes
router.post('/',
    authMiddleware,
    roleMiddleware(['ADMIN']),
    upload.single('image'),
    productController.createProduct
);

router.put('/:id',
    authMiddleware,
    roleMiddleware(['ADMIN']),
    upload.single('image'),
    productController.updateProduct
);

router.delete('/:id',
    authMiddleware,
    roleMiddleware(['ADMIN']),
    productController.deleteProduct
);

router.put('/:id/stock',
    authMiddleware,
    roleMiddleware(['ADMIN']),
    productController.updateStock
);

module.exports = router;
