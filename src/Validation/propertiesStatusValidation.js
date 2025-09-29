const { body, validationResult } = require('express-validator');

// Validation rules for creating properties status
const validateCreatePropertiesStatus = [
  body('Pro_Status')
    .notEmpty()
    .withMessage('Pro_Status is required')
    .isIn(['SALE', 'RENT', 'SOLD'])
    .withMessage('Pro_Status must be one of: SALE, RENT, SOLD')
];

// Validation rules for updating properties status
const validateUpdatePropertiesStatus = [
  body('id')
    .notEmpty()
    .withMessage('Properties Status ID is required')
    .isInt({ min: 1 })
    .withMessage('Properties Status ID must be a positive integer'),
  body('Pro_Status')
    .optional()
    .isIn(['SALE', 'RENT', 'SOLD'])
    .withMessage('Pro_Status must be one of: SALE, RENT, SOLD')
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
  validateCreatePropertiesStatus,
  validateUpdatePropertiesStatus,
  handleValidationErrors
};
