const { body, validationResult } = require('express-validator');

const validateCreatePromoMapUser = [
  body('PromoCode_id').isInt().withMessage('PromoCode_id is required and must be int'),
  body('user_id').isInt().withMessage('user_id is required and must be int'),
  body('Status').optional().isBoolean()
];

const validateUpdatePromoMapUser = [
  body('id').isInt().withMessage('id is required and must be int'),
  body('PromoCode_id').optional().isInt(),
  body('user_id').optional().isInt(),
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
  validateCreatePromoMapUser,
  validateUpdatePromoMapUser,
  handleValidationErrors
};


