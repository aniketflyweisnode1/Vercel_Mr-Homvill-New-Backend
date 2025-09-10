const { body, validationResult } = require('express-validator');

// Validation rules for creating user category
const validateCreateUserCategory = [
  body('role_id')
    .notEmpty()
    .withMessage('Role ID is required')
    .isInt({ min: 1 })
    .withMessage('Role ID must be a positive integer')
];

// Validation rules for updating user category
const validateUpdateUserCategory = [
  body('id')
    .notEmpty()
    .withMessage('User category ID is required')
    .isInt({ min: 1 })
    .withMessage('User category ID must be a positive integer'),
  body('role_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Role ID must be a positive integer')
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
  validateCreateUserCategory,
  validateUpdateUserCategory,
  handleValidationErrors
};
