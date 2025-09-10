const { body, validationResult } = require('express-validator');

// Validation rules for creating language
const validateCreateLanguage = [
  body('Language_name')
    .notEmpty()
    .withMessage('Language name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Language name must be between 2 and 100 characters')
    .trim(),
  body('code')
    .notEmpty()
    .withMessage('Language code is required')
    .isLength({ min: 2, max: 10 })
    .withMessage('Language code must be between 2 and 10 characters')
    .isUppercase()
    .withMessage('Language code must be uppercase')
    .trim(),
  body('isRTL')
    .optional()
    .isBoolean()
    .withMessage('isRTL must be a boolean value')
];

// Validation rules for updating language
const validateUpdateLanguage = [
  body('id')
    .notEmpty()
    .withMessage('Language ID is required')
    .isInt({ min: 1 })
    .withMessage('Language ID must be a positive integer'),
  body('Language_name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Language name must be between 2 and 100 characters')
    .trim(),
  body('code')
    .optional()
    .isLength({ min: 2, max: 10 })
    .withMessage('Language code must be between 2 and 10 characters')
    .isUppercase()
    .withMessage('Language code must be uppercase')
    .trim(),
  body('isRTL')
    .optional()
    .isBoolean()
    .withMessage('isRTL must be a boolean value')
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
  validateCreateLanguage,
  validateUpdateLanguage,
  handleValidationErrors
};
