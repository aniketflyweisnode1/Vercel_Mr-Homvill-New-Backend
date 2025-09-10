const { body, validationResult } = require('express-validator');

// Validation rules for sending OTP
const validateSendOTP = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
];

// Validation rules for verifying OTP
const validateVerifyOTP = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('otp')
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 4, max: 6 })
    .withMessage('OTP must be between 4 and 6 characters')
    .isNumeric()
    .withMessage('OTP must contain only numbers')
];

// Validation rules for verifying OTP and resetting password
const validateVerifyOTPAndResetPassword = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('otp')
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 4, max: 6 })
    .withMessage('OTP must be between 4 and 6 characters')
    .isNumeric()
    .withMessage('OTP must contain only numbers'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    })
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
  validateSendOTP,
  validateVerifyOTP,
  validateVerifyOTPAndResetPassword,
  handleValidationErrors
};
