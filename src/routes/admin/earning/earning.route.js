const express = require('express');
const router = express.Router();
const {
  createEarning,
  getAllEarnings,
  getEarningById,
  updateEarning
} = require('../../../controllers/Earning.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  validateCreateEarning,
  validateUpdateEarning,
  handleValidationErrors
} = require('../../../Validation/earningValidation.js');

// Create (auth)
router.post('/create', auth, validateCreateEarning, handleValidationErrors, createEarning);

// Get all (public)
router.get('/getall', getAllEarnings);

// Get by id (auth)
router.get('/getbyid/:id', auth, getEarningById);

// Update (auth)
router.put('/update', auth, validateUpdateEarning, handleValidationErrors, updateEarning);

module.exports = router;


