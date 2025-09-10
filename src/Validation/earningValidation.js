const { body, validationResult } = require('express-validator');

const validateCreateEarning = [
  body('seller').isInt().withMessage('seller is required and must be int'),
  body('Buyer').isInt().withMessage('Buyer is required and must be int'),
  body('Property_id').isInt().withMessage('Property_id is required and must be int'),
  body('Transaction_id').isInt().withMessage('Transaction_id is required and must be int'),
  body('Transaction_status').optional().isIn(['Panding', 'Completed', 'Process']),
  body('Status').optional().isBoolean()
];

const validateUpdateEarning = [
  body('id').isInt().withMessage('id is required and must be int'),
  body('seller').optional().isInt(),
  body('Buyer').optional().isInt(),
  body('Property_id').optional().isInt(),
  body('Transaction_id').optional().isInt(),
  body('Transaction_status').optional().isIn(['Panding', 'Completed', 'Process']),
  body('Status').optional().isBoolean()
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

module.exports = {
  validateCreateEarning,
  validateUpdateEarning,
  handleValidationErrors
};


