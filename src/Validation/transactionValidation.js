const { body, validationResult } = require('express-validator');

const validateCreateTransaction = [
  body('user_id').isInt().withMessage('user_id is required and must be int'),
  body('Payment_mode_id').isInt().withMessage('Payment_mode_id is required and must be int'),
  body('Amount').isFloat({ min: 0 }).withMessage('Amount must be positive number'),
  body('Date').isISO8601().toDate().withMessage('Date must be a valid date'),
  body('Payment_Status').optional().isString().trim().notEmpty(),
  body('Status').optional().isBoolean()
];

const validateUpdateTransaction = [
  body('id').isInt().withMessage('id is required and must be int'),
  body('user_id').optional().isInt(),
  body('Payment_mode_id').optional().isInt(),
  body('Amount').optional().isFloat({ min: 0 }),
  body('Date').optional().isISO8601().toDate(),
  body('Payment_Status').optional().isString().trim().notEmpty(),
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
  validateCreateTransaction,
  validateUpdateTransaction,
  handleValidationErrors
};


