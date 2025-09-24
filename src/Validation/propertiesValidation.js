const { body, validationResult } = require('express-validator');

// Validation rules for creating properties
const validateCreateProperties = [
  body('Properties_Status_id')
    .notEmpty()
    .withMessage('Properties Status ID is required')
    .isInt({ min: 1 })
    .withMessage('Properties Status ID must be a positive integer'),
  body('Properties_Category_id')
    .notEmpty()
    .withMessage('Properties Category ID is required')
    .isInt({ min: 1 })
    .withMessage('Properties Category ID must be a positive integer'),
  body('Owner_Fist_name')
    .notEmpty()
    .withMessage('Owner first name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Owner first name must be between 2 and 50 characters')
    .trim(),
  body('Owner_Last_name')
    .notEmpty()
    .withMessage('Owner last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Owner last name must be between 2 and 50 characters')
    .trim(),
  body('Owner_phone_no')
    .notEmpty()
    .withMessage('Owner phone number is required')
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 characters')
    .matches(/^[\+]?[0-9\s\-\(\)]+$/)
    .withMessage('Invalid phone number format')
    .trim(),
  body('Owner_email')
    .notEmpty()
    .withMessage('Owner email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('Property_cost')
    .notEmpty()
    .withMessage('Property cost is required')
    .isNumeric()
    .withMessage('Property cost must be a number')
    .isFloat({ min: 0 })
    .withMessage('Property cost must be a positive number'),
  body('Property_year_build')
    .notEmpty()
    .withMessage('Property year build is required')
    .isInt({ min: 1800, max: new Date().getFullYear() })
    .withMessage('Property year build must be a valid year'),
  body('Property_Plot_size')
    .notEmpty()
    .withMessage('Property plot size is required')
    .trim(),
  body('Property_finished_Sq_ft')
    .notEmpty()
    .withMessage('Property finished square feet is required')
    .trim(),
  body('Property_Bed_rooms')
    .notEmpty()
    .withMessage('Property bed rooms is required')
    .isInt({ min: 0 })
    .withMessage('Property bed rooms must be a non-negative integer'),
  body('Property_Full_Baths')
    .notEmpty()
    .withMessage('Property full baths is required')
    .isInt({ min: 0 })
    .withMessage('Property full baths must be a non-negative integer'),
  body('Property_OneTwo_Baths')
    .notEmpty()
    .withMessage('Property one/two baths is required')
    .isInt({ min: 0 })
    .withMessage('Property one/two baths must be a non-negative integer'),
  body('Property_Address')
    .notEmpty()
    .withMessage('Property address is required')
    .trim(),
  body('Property_city')
    .notEmpty()
    .withMessage('Property city is required')
    .trim(),
  body('Property_zip')
    .notEmpty()
    .withMessage('Property zip is required')
    .trim(),
  body('Property_country')
    .notEmpty()
    .withMessage('Property country is required')
    .trim(),
  body('Property_state')
    .notEmpty()
    .withMessage('Property state is required')
    .trim(),
  body('Property_Why_sell')
    .notEmpty()
    .withMessage('Property why sell is required')
    .trim(),
  body('Property_Reason_Selling')
    .notEmpty()
    .withMessage('Property reason selling is required')
    .trim(),
  body('Property_Listing_Price')
    .notEmpty()
    .withMessage('Property listing price is required')
    .isNumeric()
    .withMessage('Property listing price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Property listing price must be a positive number'),
  body('Property_Listing_plot_size')
    .notEmpty()
    .withMessage('Property listing plot size is required')
    .trim(),
  body('Property_Listing_Description')
    .notEmpty()
    .withMessage('Property listing description is required')
    .trim(),
  body('Property_photos')
    .isArray()
    .withMessage('Property photos must be an array'),
  body('Property_photos.*.Title')
    .notEmpty()
    .withMessage('Photo title is required'),
  body('Property_photos.*.image')
    .notEmpty()
    .withMessage('Photo image is required'),
  body('Appliances')
    .optional()
    .isArray()
    .withMessage('Appliances must be an array'),
  body('floors')
    .optional()
    .isArray()
    .withMessage('Floors must be an array'),
  body('others')
    .optional()
    .isArray()
    .withMessage('Others must be an array'),
  body('payment_methods')
    .optional()
    .isArray()
    .withMessage('Payment methods must be an array'),
  body('payment_methods.*')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Each payment method must be a positive integer'),
  body('parking')
    .optional()
    .isArray()
    .withMessage('Parking must be an array'),
  body('Rooms')
    .optional()
    .isArray()
    .withMessage('Rooms must be an array')
];

// Validation rules for updating properties
const validateUpdateProperties = [
  body('id')
    .notEmpty()
    .withMessage('Properties ID is required')
    .isInt({ min: 1 })
    .withMessage('Properties ID must be a positive integer'),
  body('Properties_Status_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Properties Status ID must be a positive integer'),
  body('Properties_Category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Properties Category ID must be a positive integer'),
  body('Owner_Fist_name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Owner first name must be between 2 and 50 characters')
    .trim(),
  body('Owner_Last_name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Owner last name must be between 2 and 50 characters')
    .trim(),
  body('Owner_phone_no')
    .optional()
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 characters')
    .matches(/^[\+]?[0-9\s\-\(\)]+$/)
    .withMessage('Invalid phone number format')
    .trim(),
  body('Owner_email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('Property_cost')
    .optional()
    .isNumeric()
    .withMessage('Property cost must be a number')
    .isFloat({ min: 0 })
    .withMessage('Property cost must be a positive number'),
  body('Property_year_build')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() })
    .withMessage('Property year build must be a valid year'),
  body('Property_Plot_size')
    .optional()
    .trim(),
  body('Property_finished_Sq_ft')
    .optional()
    .trim(),
  body('Property_Bed_rooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Property bed rooms must be a non-negative integer'),
  body('Property_Full_Baths')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Property full baths must be a non-negative integer'),
  body('Property_OneTwo_Baths')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Property one/two baths must be a non-negative integer'),
  body('Property_Address')
    .optional()
    .trim(),
  body('Property_city')
    .optional()
    .trim(),
  body('Property_zip')
    .optional()
    .trim(),
  body('Property_country')
    .optional()
    .trim(),
  body('Property_state')
    .optional()
    .trim(),
  body('Property_Why_sell')
    .optional()
    .trim(),
  body('Property_Reason_Selling')
    .optional()
    .trim(),
  body('Property_Listing_Price')
    .optional()
    .isNumeric()
    .withMessage('Property listing price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Property listing price must be a positive number'),
  body('Property_Listing_plot_size')
    .optional()
    .trim(),
  body('Property_Listing_Description')
    .optional()
    .trim(),
  body('Property_photos')
    .optional()
    .isArray()
    .withMessage('Property photos must be an array'),
  body('Property_photos.*.Title')
    .optional()
    .notEmpty()
    .withMessage('Photo title is required'),
  body('Property_photos.*.image')
    .optional()
    .notEmpty()
    .withMessage('Photo image is required'),
  body('Appliances')
    .optional()
    .isArray()
    .withMessage('Appliances must be an array'),
  body('floors')
    .optional()
    .isArray()
    .withMessage('Floors must be an array'),
  body('others')
    .optional()
    .isArray()
    .withMessage('Others must be an array'),
  body('payment_methods')
    .optional()
    .isArray()
    .withMessage('Payment methods must be an array'),
  body('payment_methods.*')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Each payment method must be a positive integer'),
  body('parking')
    .optional()
    .isArray()
    .withMessage('Parking must be an array'),
  body('Rooms')
    .optional()
    .isArray()
    .withMessage('Rooms must be an array')
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
  validateCreateProperties,
  validateUpdateProperties,
  handleValidationErrors
};
