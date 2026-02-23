const { body } = require("express-validator");

const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),
  body("phone")
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage("Please provide a valid 10-digit phone number"),
];

const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

const paymentValidation = [
  body("subscriptionPlan")
    .notEmpty()
    .withMessage("Subscription plan is required")
    .isMongoId()
    .withMessage("Invalid subscription plan ID"),
  body("transactionId")
    .trim()
    .notEmpty()
    .withMessage("Transaction ID is required")
    .isLength({ min: 8, max: 50 })
    .withMessage("Transaction ID must be between 8 and 50 characters")
    .custom((value) => {
      // UPI Transaction ID patterns
      const upiPatterns = [
        /^[A-Z0-9]{12,20}$/, // Alphanumeric UPI IDs
        /^[0-9]{12,20}$/, // Numeric UPI IDs
        /^[A-Z]{2}[0-9]{10,18}$/, // Bank-specific patterns (e.g., SB1234567890)
        /^[0-9]{4}[A-Z]{4}[0-9]{4}$/, // Mixed pattern
        /^[A-Z]{4}[0-9]{8,12}$/, // Another common pattern
      ];

      // Bank reference ID patterns
      const bankPatterns = [
        /^[A-Z]{2}[0-9]{6,15}$/, // Bank codes + numbers
        /^[0-9]{6,20}$/, // Pure numeric references
        /^[A-Z0-9]{8,25}$/, // General alphanumeric
      ];

      const isValid = [...upiPatterns, ...bankPatterns].some((pattern) =>
        pattern.test(value.toUpperCase())
      );

      if (!isValid) {
        throw new Error(
          "Invalid transaction ID format. Please enter a valid UPI transaction ID or bank reference number."
        );
      }

      return true;
    }),
  body("paymentMethod")
    .isIn(["upi", "bank_transfer", "card", "wallet"])
    .withMessage("Invalid payment method"),
  body("amount")
    .isNumeric()
    .withMessage("Amount must be a number")
    .custom((value) => value > 0)
    .withMessage("Amount must be greater than 0"),
];

const questionValidation = [
  body("questionText")
    .trim()
    .notEmpty()
    .withMessage("Question text is required"),
  body("options")
    .isArray({ min: 4, max: 4 })
    .withMessage("Exactly 4 options are required"),
  body("correctAnswer")
    .isInt({ min: 0, max: 3 })
    .withMessage("Correct answer must be between 0 and 3"),
  body("chapter").isMongoId().withMessage("Valid chapter ID is required"),
];

module.exports = {
  registerValidation,
  loginValidation,
  paymentValidation,
  questionValidation,
};
