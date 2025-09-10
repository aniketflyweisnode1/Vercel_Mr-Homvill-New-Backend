const { body, validationResult } = require('express-validator');

// Validation rules for creating contracts company
const validateCreateContractsCompany = [
  body('Contracts_Company_name')
    .notEmpty()
    .withMessage('Contracts Company name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Contracts Company name must be between 2 and 100 characters')
    .trim()
];

// Validation rules for updating contracts company
const validateUpdateContractsCompany = [
  body('id')
    .notEmpty()
    .withMessage('Contracts Company ID is required')
    .isInt({ min: 1 })
    .withMessage('Contracts Company ID must be a positive integer'),
  body('Contracts_Company_name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Contracts Company name must be between 2 and 100 characters')
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
  validateCreateContractsCompany,
  validateUpdateContractsCompany,
  handleValidationErrors
};

