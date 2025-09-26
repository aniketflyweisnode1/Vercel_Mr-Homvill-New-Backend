const { body, validationResult } = require('express-validator');

const validateCreatePromoCode = [
  body('offer_name').isString().trim().notEmpty(),
  body('Coupon_code').isString().trim().notEmpty(),
  body('Coupon_type').isIn(['Public Coupon', 'Private Coupon']),
  body('Coupon_count_used').optional().isInt({ min: 0 }),
  body('use_Per_user').optional().isInt({ min: 1 }),
  body('Select_area_id').isInt(),
  body('visibility').optional().isBoolean(),
  body('Diescount_type').isIn(['Flat Discount', 'Percentage Discount']),
  body('Discount_amount').isFloat({ min: 0 }),
  body('StartDate').isISO8601().toDate(),
  body('StartTime').isString().trim().notEmpty(),
  body('EndDate').isISO8601().toDate(),
  body('EndTime').isString().trim().notEmpty(),
  body('Status').optional().isBoolean()
];

const validateUpdatePromoCode = [
  body('id').isInt().withMessage('id is required and must be int'),
  body('offer_name').optional().isString().trim().notEmpty(),
  body('Coupon_code').optional().isString().trim().notEmpty(),
  body('Coupon_type').optional().isIn(['Public Coupon', 'Private Coupon']),
  body('Coupon_count_used').optional().isInt({ min: 0 }),
  body('use_Per_user').optional().isInt({ min: 1 }),
  body('Select_area_id').optional().isInt(),
  body('visibility').optional().isBoolean(),
  body('Diescount_type').optional().isIn(['Flat Discount', 'Percentage Discount']),
  body('Discount_amount').optional().isFloat({ min: 0 }),
  body('StartDate').optional().isISO8601().toDate(),
  body('StartTime').optional().isString().trim().notEmpty(),
  body('EndDate').optional().isISO8601().toDate(),
  body('EndTime').optional().isString().trim().notEmpty(),
  body('Status').optional().isBoolean()
];

// Validation for extending promo code expiry date
const validateExtendPromoCodeExpiry = [
  body('id')
    .notEmpty()
    .withMessage('Promo Code ID is required')
    .isInt({ min: 1 })
    .withMessage('Promo Code ID must be a positive integer'),
  body('newEndDate')
    .notEmpty()
    .withMessage('New end date is required')
    .isISO8601()
    .withMessage('New end date must be a valid date')
    .toDate()
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('New end date must be in the future');
      }
      return true;
    }),
  body('newEndTime')
    .notEmpty()
    .withMessage('New end time is required')
    .isString()
    .withMessage('New end time must be a string')
    .trim()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('New end time must be in HH:MM format')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

module.exports = {
  validateCreatePromoCode,
  validateUpdatePromoCode,
  validateExtendPromoCodeExpiry,
  handleValidationErrors
};


