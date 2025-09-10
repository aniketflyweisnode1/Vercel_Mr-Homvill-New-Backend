const { body, validationResult } = require('express-validator');

// Validation rules for creating city
const validateCreateCity = [
  body('City_name')
    .notEmpty()
    .withMessage('City name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('City name must be between 2 and 100 characters')
    .trim(),
  body('Code')
    .notEmpty()
    .withMessage('City code is required')
    .isLength({ min: 2, max: 10 })
    .withMessage('City code must be between 2 and 10 characters')
    .isUppercase()
    .withMessage('City code must be uppercase')
    .trim(),
  body('State_id')
    .notEmpty()
    .withMessage('State ID is required')
    .isInt({ min: 1 })
    .withMessage('State ID must be a positive integer'),
  body('Country_id')
    .notEmpty()
    .withMessage('Country ID is required')
    .isInt({ min: 1 })
    .withMessage('Country ID must be a positive integer')
];

// Validation rules for updating city
const validateUpdateCity = [
  body('id')
    .notEmpty()
    .withMessage('City ID is required')
    .isInt({ min: 1 })
    .withMessage('City ID must be a positive integer'),
  body('City_name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('City name must be between 2 and 100 characters')
    .trim(),
  body('Code')
    .optional()
    .isLength({ min: 2, max: 10 })
    .withMessage('City code must be between 2 and 10 characters')
    .isUppercase()
    .withMessage('City code must be uppercase')
    .trim(),
  body('State_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('State ID must be a positive integer'),
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
  validateCreateCity,
  validateUpdateCity,
  handleValidationErrors
};
