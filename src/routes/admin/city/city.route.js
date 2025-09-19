const express = require('express');
const router = express.Router();
const {
  createCity,
  getAllCities,
  getCitiesByStateId,
  getCitiesByCountryId,
  getCityById,
  updateCity,
  deleteCity,
  softDeleteCity
} = require('../../../controllers/City.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  validateCreateCity,
  validateUpdateCity,
  handleValidationErrors
} = require('../../../Validation/cityValidation.js');

// Create a new city
router.post('/create', auth, validateCreateCity, handleValidationErrors, createCity);

// Get all cities
router.get('/getall', getAllCities);

// Get cities by state ID
router.get('/getbystate/:stateId', auth, getCitiesByStateId);

// Get cities by country ID
router.get('/getbycountry/:countryId', auth, getCitiesByCountryId);

// Get city by ID
router.get('/getbyid/:id', auth, getCityById);

// Update city
router.put('/update', auth, validateUpdateCity, handleValidationErrors, updateCity);

// Delete city (hard delete)
router.delete('/delete/:id', auth, deleteCity);

// Soft delete city (deactivate)
router.patch('/:id/deactivate', auth, softDeleteCity);

module.exports = router;
