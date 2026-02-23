const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate');

const router = express.Router();

// Validation rules
const registerValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('name').notEmpty().withMessage('Name is required'),
    body('birthdate').optional().isISO8601().toDate().withMessage('Invalid date format')
];

const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').exists().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.post('/admin/login', loginValidation, validate, authController.adminLogin);

module.exports = router;
