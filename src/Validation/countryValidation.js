const { body, validationResult } = require('express-validator');

// Validation rules for creating country
const validateCreateCountry = [
  body('Country_name')
    .notEmpty()
    .withMessage('Country name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Country name must be between 2 and 100 characters')
    .trim(),
  body('code')
    .notEmpty()
    .withMessage('Country code is required')
    .isLength({ min: 2, max: 3 })
    .withMessage('Country code must be between 2 and 3 characters')
    .isUppercase()
    .withMessage('Country code must be uppercase')
    .trim(),
  body('phone_code')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Phone code must not exceed 10 characters')
    .trim(),
  body('currency')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Currency must not exceed 10 characters')
    .trim()
];

// Validation rules for updating country
const validateUpdateCountry = [
  body('id')
    .notEmpty()
    .withMessage('Country ID is required')
    .isInt({ min: 1 })
    .withMessage('Country ID must be a positive integer'),
  body('Country_name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Country name must be between 2 and 100 characters')
    .trim(),
  body('code')
    .optional()
    .isLength({ min: 2, max: 3 })
    .withMessage('Country code must be between 2 and 3 characters')
    .isUppercase()
    .withMessage('Country code must be uppercase')
    .trim(),
  body('phone_code')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Phone code must not exceed 10 characters')
    .trim(),
  body('currency')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Currency must not exceed 10 characters')
    .trim()
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateCreateCountry,
  validateUpdateCountry,
  handleValidationErrors
};
