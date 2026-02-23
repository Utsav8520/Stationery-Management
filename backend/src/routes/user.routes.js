const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const router = express.Router();

router.use(authMiddleware);

// User-specific routes
router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);

// Admin-specific user routes
router.use(roleMiddleware(['ADMIN']));
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUserById);
router.delete('/:id', userController.deleteUserById);

module.exports = router;
