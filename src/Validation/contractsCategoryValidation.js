const { body, validationResult } = require('express-validator');

// Validation rules for creating contracts category
const validateCreateContractsCategory = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim(),
  body('emoji')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Emoji must not exceed 10 characters')
    .trim()
];

// Validation rules for updating contracts category
const validateUpdateContractsCategory = [
  body('id')
    .notEmpty()
    .withMessage('Contracts Category ID is required')
    .isInt({ min: 1 })
    .withMessage('Contracts Category ID must be a positive integer'),
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim(),
  body('emoji')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Emoji must not exceed 10 characters')
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
  validateCreateContractsCategory,
  validateUpdateContractsCategory,
  handleValidationErrors
};

