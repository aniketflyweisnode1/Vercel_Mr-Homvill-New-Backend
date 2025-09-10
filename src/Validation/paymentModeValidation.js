const { body, validationResult } = require('express-validator');

const validateCreatePaymentMode = [
  body('name').isString().trim().notEmpty().withMessage('name is required'),
  body('Status').optional().isBoolean()
];

const validateUpdatePaymentMode = [
  body('id').isInt().withMessage('id is required and must be int'),
  body('name').optional().isString().trim().notEmpty(),
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
  validateCreatePaymentMode,
  validateUpdatePaymentMode,
  handleValidationErrors
};


