const { body, validationResult } = require('express-validator');

const validateCreateArea = [
  body('Area_name').isString().trim().notEmpty().withMessage('Area_name is required'),
  body('Status').optional().isBoolean()
];

const validateUpdateArea = [
  body('id').isInt().withMessage('id is required and must be int'),
  body('Area_name').optional().isString().trim().notEmpty(),
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
  validateCreateArea,
  validateUpdateArea,
  handleValidationErrors
};


