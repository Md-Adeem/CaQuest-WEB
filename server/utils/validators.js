const { body } = require('express-validator');

const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const paymentValidation = [
  body('subscriptionPlan')
    .notEmpty()
    .withMessage('Subscription plan is required')
    .isMongoId()
    .withMessage('Invalid subscription plan ID'),
  body('transactionId')
    .trim()
    .notEmpty()
    .withMessage('Transaction ID is required'),
  body('paymentMethod')
    .isIn(['upi', 'bank_transfer', 'card', 'wallet'])
    .withMessage('Invalid payment method'),
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
    .custom((value) => value > 0)
    .withMessage('Amount must be greater than 0'),
];

const questionValidation = [
  body('questionText')
    .trim()
    .notEmpty()
    .withMessage('Question text is required'),
  body('options')
    .isArray({ min: 4, max: 4 })
    .withMessage('Exactly 4 options are required'),
  body('correctAnswer')
    .isInt({ min: 0, max: 3 })
    .withMessage('Correct answer must be between 0 and 3'),
  body('chapter')
    .isMongoId()
    .withMessage('Valid chapter ID is required'),
  body('difficulty')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),
];

module.exports = {
  registerValidation,
  loginValidation,
  paymentValidation,
  questionValidation,
};