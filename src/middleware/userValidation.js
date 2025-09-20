const { body, validationResult } = require('express-validator');

// Validation rules for creating user
const validateCreateUser = [
  body('Name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .trim(),
  body('last_name')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .trim(),
  body('Responsibility_id')
    .notEmpty()
    .withMessage('Responsibility ID is required')
    .isInt({ min: 1 })
    .withMessage('Responsibility ID must be a positive integer'),
  body('Role_id')
    .notEmpty()
    .withMessage('Role ID is required')
    .isInt({ min: 1 })
    .withMessage('Role ID must be a positive integer'),
  body('User_Category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
  body('Language_id')
    .notEmpty()
    .withMessage('Language ID is required')
    .isInt({ min: 1 })
    .withMessage('Language ID must be a positive integer'),
  body('Country_id')
    .notEmpty()
    .withMessage('Country ID is required')
    .isInt({ min: 1 })
    .withMessage('Country ID must be a positive integer'),
  body('State_id')
    .notEmpty()
    .withMessage('State ID is required')
    .isInt({ min: 1 })
    .withMessage('State ID must be a positive integer'),
  body('City_id')
    .notEmpty()
    .withMessage('City ID is required')
    .isInt({ min: 1 })
    .withMessage('City ID must be a positive integer'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 characters')
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('user_image')
    .optional()
    .isURL()
    .withMessage('User image must be a valid URL'),
  body('OnboardingDate')
    .optional()
    .isISO8601()
    .withMessage('Onboarding date must be a valid date'),
  body('yearsWithus')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Years with us must be a non-negative integer'),
  body('isLoginPermission')
    .optional()
    .isBoolean()
    .withMessage('Login permission must be a boolean value'),
  body('Status')
    .optional()
    .isBoolean()
    .withMessage('Status must be a boolean value'),
  body('Permissions_type_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Permissions type ID must be a positive integer'),
  body('referralCode')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Referral code must not exceed 50 characters')
    .trim(),
  body('governmentId')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Government ID must not exceed 50 characters')
    .trim(),
  body('dateOfJoining')
    .optional()
    .isISO8601()
    .withMessage('Date of joining must be a valid date'),
  body('birthday')
    .optional()
    .isISO8601()
    .withMessage('Birthday must be a valid date'),
  body('deviceToken')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Device token must not exceed 500 characters')
    .trim(),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
  body('wallet')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Wallet amount must be a non-negative number'),
  body('location')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Location must not exceed 200 characters')
    .trim(),
  body('zipcode')
    .optional()
    .isLength({ min: 3, max: 10 })
    .withMessage('Zipcode must be between 3 and 10 characters')
    .trim(),
  body('adhaar_date')
    .optional()
    .isISO8601()
    .withMessage('Aadhaar date must be a valid date'),
  body('adhaar_no')
    .optional()
    .isLength({ min: 12, max: 12 })
    .withMessage('Aadhaar number must be exactly 12 digits')
    .isNumeric()
    .withMessage('Aadhaar number must contain only digits')
    .trim()
];

// Validation rules for updating user
const validateUpdateUser = [
  body('id')
    .notEmpty()
    .withMessage('User ID is required')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  body('Name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .trim(),
  body('last_name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .trim(),
  body('Responsibility_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Responsibility ID must be a positive integer'),
  body('Role_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Role ID must be a positive integer'),
  body('User_Category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
  body('Language_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Language ID must be a positive integer'),
  body('Country_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Country ID must be a positive integer'),
  body('State_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('State ID must be a positive integer'),
  body('City_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('City ID must be a positive integer'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional()
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 characters')
    .trim(),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('user_image')
    .optional()
    .isURL()
    .withMessage('User image must be a valid URL'),
  body('OnboardingDate')
    .optional()
    .isISO8601()
    .withMessage('Onboarding date must be a valid date'),
  body('yearsWithus')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Years with us must be a non-negative integer'),
  body('isLoginPermission')
    .optional()
    .isBoolean()
    .withMessage('Login permission must be a boolean value'),
  body('Status')
    .optional()
    .isBoolean()
    .withMessage('Status must be a boolean value'),
  body('Permissions_type_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Permissions type ID must be a positive integer'),
  body('referralCode')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Referral code must not exceed 50 characters')
    .trim(),
  body('governmentId')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Government ID must not exceed 50 characters')
    .trim(),
  body('dateOfJoining')
    .optional()
    .isISO8601()
    .withMessage('Date of joining must be a valid date'),
  body('birthday')
    .optional()
    .isISO8601()
    .withMessage('Birthday must be a valid date'),
  body('deviceToken')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Device token must not exceed 500 characters')
    .trim(),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
  body('wallet')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Wallet amount must be a non-negative number'),
  body('location')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Location must not exceed 200 characters')
    .trim(),
  body('zipcode')
    .optional()
    .isLength({ min: 3, max: 10 })
    .withMessage('Zipcode must be between 3 and 10 characters')
    .trim(),
  body('adhaar_date')
    .optional()
    .isISO8601()
    .withMessage('Aadhaar date must be a valid date'),
  body('adhaar_no')
    .optional()
    .isLength({ min: 12, max: 12 })
    .withMessage('Aadhaar number must be exactly 12 digits')
    .isNumeric()
    .withMessage('Aadhaar number must contain only digits')
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
  validateCreateUser,
  validateUpdateUser,
  handleValidationErrors
};
