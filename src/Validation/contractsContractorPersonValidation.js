const { body, validationResult } = require('express-validator');

// Validation rules for creating contracts contractor person
const validateCreateContractsContractorPerson = [
  body('owner')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Owner name must not exceed 200 characters')
    .trim(),
  body('property_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Property ID must be a positive integer'),
  body('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
  body('contact')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Contact must not exceed 20 characters')
    .trim(),
  body('contractor')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Contractor name must not exceed 200 characters')
    .trim(),
  body('contracter_img')
    .optional()
    .isURL()
    .withMessage('Contractor image must be a valid URL')
    .trim(),
  body('company_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Company ID must be a positive integer'),
  body('cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost must be a non-negative number'),
  body('address')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters')
    .trim()
];

// Validation rules for updating contracts contractor person
const validateUpdateContractsContractorPerson = [
  body('id')
    .notEmpty()
    .withMessage('Contracts Contractor person ID is required')
    .isInt({ min: 1 })
    .withMessage('Contracts Contractor person ID must be a positive integer'),
  body('owner')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Owner name must not exceed 200 characters')
    .trim(),
  body('property_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Property ID must be a positive integer'),
  body('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
  body('contact')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Contact must not exceed 20 characters')
    .trim(),
  body('contractor')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Contractor name must not exceed 200 characters')
    .trim(),
  body('contracter_img')
    .optional()
    .isURL()
    .withMessage('Contractor image must be a valid URL')
    .trim(),
  body('company_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Company ID must be a positive integer'),
  body('cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost must be a non-negative number'),
  body('address')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters')
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
  validateCreateContractsContractorPerson,
  validateUpdateContractsContractorPerson,
  handleValidationErrors
};

