const { body, validationResult } = require('express-validator');

// Validation rules for creating state
const validateCreateState = [
  body('state_name')
    .notEmpty()
    .withMessage('State name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('State name must be between 2 and 100 characters')
    .trim(),
  body('Code')
    .notEmpty()
    .withMessage('State code is required')
    .isLength({ min: 2, max: 10 })
    .withMessage('State code must be between 2 and 10 characters')
    .isUppercase()
    .withMessage('State code must be uppercase')
    .trim(),
  body('Country_id')
    .notEmpty()
    .withMessage('Country ID is required')
    .isInt({ min: 1 })
    .withMessage('Country ID must be a positive integer')
];

// Validation rules for updating state
const validateUpdateState = [
  body('id')
    .notEmpty()
    .withMessage('State ID is required')
    .isInt({ min: 1 })
    .withMessage('State ID must be a positive integer'),
  body('state_name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('State name must be between 2 and 100 characters')
    .trim(),
  body('Code')
    .optional()
    .isLength({ min: 2, max: 10 })
    .withMessage('State code must be between 2 and 10 characters')
    .isUppercase()
    .withMessage('State code must be uppercase')
    .trim(),
  body('Country_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Country ID must be a positive integer')
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
  validateCreateState,
  validateUpdateState,
  handleValidationErrors
};
