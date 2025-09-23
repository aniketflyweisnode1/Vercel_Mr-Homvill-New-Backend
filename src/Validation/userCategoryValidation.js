const { body, validationResult } = require('express-validator');

// Validation rules for creating user category
const validateCreateUserCategory = [
  body('role_id')
    .notEmpty()
    .withMessage('Role ID is required')
    .isInt({ min: 1 })
    .withMessage('Role ID must be a positive integer'),
  body('Category_name')
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters')
    .trim()
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
    .withMessage('Role ID must be a positive integer'),
  body('Category_name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters')
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
  validateCreateUserCategory,
  validateUpdateUserCategory,
  handleValidationErrors
};
