const { body, param, validationResult } = require('express-validator');

const validateCreateSubscription = [
  body('name').isString().trim().notEmpty().withMessage('name is required'),
  body('emozi').optional({ nullable: true }).isString(),
  body('price').isFloat({ min: 0 }).withMessage('price must be a positive number'),
  body('Feactue_name').isString().trim().notEmpty().withMessage('Feactue_name is required'),
  body('Status').optional().isBoolean(),
  body('Lines').optional().isArray(),
  body('Lines.*.Feactue_name').optional().isString().trim().notEmpty(),
  body('Lines.*.Quantity').optional().isInt({ min: 0 }),
  body('Subscription_for').optional().isArray(),
  body('Subscription_for.*').optional().isString()
];

const validateUpdateSubscription = [
  body('id').isInt().withMessage('id is required and must be int'),
  body('name').optional().isString().trim().notEmpty(),
  body('emozi').optional({ nullable: true }).isString(),
  body('price').optional().isFloat({ min: 0 }),
  body('Feactue_name').optional().isString().trim().notEmpty(),
  body('Status').optional().isBoolean(),
  body('Lines').optional().isArray(),
  body('Lines.*.Feactue_name').optional().isString().trim().notEmpty(),
  body('Lines.*.Quantity').optional().isInt({ min: 0 }),
  body('Subscription_for').optional().isArray(),
  body('Subscription_for.*').optional().isString()
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

module.exports = {
  validateCreateSubscription,
  validateUpdateSubscription,
  handleValidationErrors
};


