const express = require('express');
const router = express.Router();
const {
  createPaymentMode,
  getAllPaymentModes,
  getPaymentModeById,
  updatePaymentMode
} = require('../../../controllers/Payment_mode.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  validateCreatePaymentMode,
  validateUpdatePaymentMode,
  handleValidationErrors
} = require('../../../Validation/paymentModeValidation.js');

// Create (auth)
router.post('/create', auth, validateCreatePaymentMode, handleValidationErrors, createPaymentMode);

// Get all (public)
router.get('/getall', getAllPaymentModes);

// Get by id (auth)
router.get('/getbyid/:id', auth, getPaymentModeById);

// Update (auth)
router.put('/update', auth, validateUpdatePaymentMode, handleValidationErrors, updatePaymentMode);

module.exports = router;


