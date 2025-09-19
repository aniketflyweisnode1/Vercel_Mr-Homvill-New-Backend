const express = require('express');
const router = express.Router();
const {
  createCountry,
  getAllCountries,
  getCountryById,
  updateCountry,
  deleteCountry,
  softDeleteCountry
} = require('../../../controllers/Country.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  validateCreateCountry,
  validateUpdateCountry,
  handleValidationErrors
} = require('../../../Validation/countryValidation.js');

// Create a new country
router.post('/create', auth, validateCreateCountry, handleValidationErrors, createCountry);

// Get all countries
router.get('/getall', getAllCountries);

// Get country by ID
router.get('/getbyid/:id', auth, getCountryById);

// Update country
router.put('/update', auth, validateUpdateCountry, handleValidationErrors, updateCountry);

// Delete country (hard delete)
router.delete('/delete/:id', auth, deleteCountry);

// Soft delete country (deactivate)
router.patch('/:id/deactivate', auth, softDeleteCountry);

module.exports = router;
