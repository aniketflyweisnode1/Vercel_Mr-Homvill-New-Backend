const { body, validationResult } = require('express-validator');

// Validation rules for creating role
const validateCreateRole = [
  body('role_name')
    .notEmpty()
    .withMessage('Role name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Role name must be between 2 and 100 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters')
    .trim(),
  body('permissions')
    .optional()
    .isArray()
    .withMessage('Permissions must be an array')
];

// Validation rules for updating role
const validateUpdateRole = [
  body('id')
    .notEmpty()
    .withMessage('Role ID is required')
    .isInt({ min: 1 })
    .withMessage('Role ID must be a positive integer'),
  body('role_name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Role name must be between 2 and 100 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters')
    .trim(),
  body('permissions')
    .optional()
    .isArray()
    .withMessage('Permissions must be an array')
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
  validateCreateRole,
  validateUpdateRole,
  handleValidationErrors
};
