const { body, validationResult } = require('express-validator');

// Validation rules for creating responsibility
const validateCreateResponsibility = [
  body('Responsibility_name')
    .notEmpty()
    .withMessage('Responsibility name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Responsibility name must be between 2 and 100 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters')
    .trim()
];

// Validation rules for updating responsibility
const validateUpdateResponsibility = [
  body('id')
    .notEmpty()
    .withMessage('Responsibility ID is required')
    .isInt({ min: 1 })
    .withMessage('Responsibility ID must be a positive integer'),
  body('Responsibility_name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Responsibility name must be between 2 and 100 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters')
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
  validateCreateResponsibility,
  validateUpdateResponsibility,
  handleValidationErrors
};
