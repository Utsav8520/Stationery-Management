const express = require('express');
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/item/:productId', cartController.updateCartItem);
router.delete('/item/:productId', cartController.removeCartItem);
router.delete('/', cartController.clearCart);

module.exports = router;
