const { body, validationResult } = require('express-validator');

// Validation rules for creating contracts contractor person
const validateCreateContractsContractorPerson = [
  body('Contracts_Contractor_person_name')
    .notEmpty()
    .withMessage('Contracts Contractor person name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Contracts Contractor person name must be between 2 and 100 characters')
    .trim()
];

// Validation rules for updating contracts contractor person
const validateUpdateContractsContractorPerson = [
  body('id')
    .notEmpty()
    .withMessage('Contracts Contractor person ID is required')
    .isInt({ min: 1 })
    .withMessage('Contracts Contractor person ID must be a positive integer'),
  body('Contracts_Contractor_person_name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Contracts Contractor person name must be between 2 and 100 characters')
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

