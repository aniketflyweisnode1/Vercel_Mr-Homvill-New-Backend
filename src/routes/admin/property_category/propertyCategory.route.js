const express = require('express');
const router = express.Router();
const {
  createPropertyCategory,
  getAllPropertyCategories,
  getPropertyCategoryById,
  updatePropertyCategory,
  deletePropertyCategory,
  softDeletePropertyCategory
} = require('../../../controllers/Property_Category.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create a new property category
router.post('/create', auth, createPropertyCategory);

// Get all property categories
router.get('/getall', auth, getAllPropertyCategories);

// Get property category by ID
router.get('/getbyid/:id', auth, getPropertyCategoryById);

// Update property category
router.put('/update', auth, updatePropertyCategory);

// Delete property category (hard delete)
router.delete('/delete/:id', auth, deletePropertyCategory);

// Soft delete property category (deactivate)
router.patch('/:id/deactivate', auth, softDeletePropertyCategory);

module.exports = router;
