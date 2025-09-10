const express = require('express');
const router = express.Router();
const {
  createPropertiesCategory,
  getAllPropertiesCategories,
  getPropertiesCategoryById,
  updatePropertiesCategory,
  deletePropertiesCategory,
  softDeletePropertiesCategory
} = require('../../../controllers/Properties_Category.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  validateCreatePropertiesCategory,
  validateUpdatePropertiesCategory,
  handleValidationErrors
} = require('../../../Validation/propertiesCategoryValidation.js');

// Create a new properties category
router.post('/create', auth, validateCreatePropertiesCategory, handleValidationErrors, createPropertiesCategory);

// Get all properties categories
router.get('/getall', auth, getAllPropertiesCategories);

// Get properties category by ID
router.get('/getbyid/:id', auth, getPropertiesCategoryById);

// Update properties category
router.put('/update', auth, validateUpdatePropertiesCategory, handleValidationErrors, updatePropertiesCategory);

// Delete properties category (hard delete)
router.delete('/delete/:id', auth, deletePropertiesCategory);

// Soft delete properties category (deactivate)
router.patch('/:id/deactivate', auth, softDeletePropertiesCategory);

module.exports = router;
