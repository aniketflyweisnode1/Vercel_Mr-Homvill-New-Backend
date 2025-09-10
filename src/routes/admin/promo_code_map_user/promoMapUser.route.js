const express = require('express');
const router = express.Router();
const {
  createPromoMapUser,
  getAllPromoMapUsers,
  getPromoMapUsersByAuth,
  getPromoMapUserById,
  updatePromoMapUser
} = require('../../../controllers/Promo_code_map_user.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  validateCreatePromoMapUser,
  validateUpdatePromoMapUser,
  handleValidationErrors
} = require('../../../Validation/promoMapUserValidation.js');

// Create (auth)
router.post('/create', auth, validateCreatePromoMapUser, handleValidationErrors, createPromoMapUser);

// Get all (public)
router.get('/getall', getAllPromoMapUsers);

// Get by auth (auth)
router.get('/getbyauth', auth, getPromoMapUsersByAuth);

// Get by id (auth)
router.get('/getbyid/:id', auth, getPromoMapUserById);

// Update (auth)
router.put('/update', auth, validateUpdatePromoMapUser, handleValidationErrors, updatePromoMapUser);

module.exports = router;


