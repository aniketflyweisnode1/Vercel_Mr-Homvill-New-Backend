const express = require('express');
const router = express.Router();
const {
  createPromoCode,
  getAllPromoCodes,
  getPromoCodeById,
  updatePromoCode,
  extendPromoCodeExpiry,
  deletePromoCode
} = require('../../../controllers/Promo_Code.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  validateCreatePromoCode,
  validateUpdatePromoCode,
  validateExtendPromoCodeExpiry,
  handleValidationErrors
} = require('../../../Validation/promoCodeValidation.js');

// Create (auth)
router.post('/create', auth, validateCreatePromoCode, handleValidationErrors, createPromoCode);

// Get all (public)
router.get('/getall', getAllPromoCodes);

// Get by id (auth)
router.get('/getbyid/:id', auth, getPromoCodeById);

// Update (auth)
router.put('/update', auth, validateUpdatePromoCode, handleValidationErrors, updatePromoCode);

// Extend expiry date (auth)
router.put('/extend-expiry', auth, validateExtendPromoCodeExpiry, handleValidationErrors, extendPromoCodeExpiry);

// Delete (auth)
router.delete('/delete/:id', auth, deletePromoCode);

module.exports = router;


