const express = require('express');
const router = express.Router();
const {
  createProperties,
  getAllProperties,
  getPropertiesById,
  updateProperties,
  deleteProperties,
  softDeleteProperties
} = require('../../../controllers/Properties.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  validateCreateProperties,
  validateUpdateProperties,
  handleValidationErrors
} = require('../../../Validation/propertiesValidation.js');

// Create a new properties
router.post('/create', auth, validateCreateProperties, handleValidationErrors, createProperties);

// Get all properties
router.get('/getall', auth, getAllProperties);

// Get properties by ID
router.get('/getbyid/:id', auth, getPropertiesById);

// Update properties
router.put('/update', auth, validateUpdateProperties, handleValidationErrors, updateProperties);

// Delete properties (hard delete)
router.delete('/delete/:id', auth, deleteProperties);

// Soft delete properties (deactivate)
router.patch('/:id/deactivate', auth, softDeleteProperties);

module.exports = router;
