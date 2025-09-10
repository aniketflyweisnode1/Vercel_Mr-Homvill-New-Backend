const express = require('express');
const router = express.Router();
const {
  createUserCategory,
  getAllUserCategories,
  getUserCategoryById,
  updateUserCategory,
  deleteUserCategory,
  softDeleteUserCategory
} = require('../../../controllers/User_Category.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  validateCreateUserCategory,
  validateUpdateUserCategory,
  handleValidationErrors
} = require('../../../Validation/userCategoryValidation.js');

// Create a new user category
router.post('/create', auth, validateCreateUserCategory, handleValidationErrors, createUserCategory);

// Get all user categories
router.get('/getall', auth, getAllUserCategories);

// Get user category by ID
router.get('/getbyid/:id', auth, getUserCategoryById);

// Update user category
router.put('/update', auth, validateUpdateUserCategory, handleValidationErrors, updateUserCategory);

// Delete user category (hard delete)
router.delete('/delete/:id', auth, deleteUserCategory);

// Soft delete user category (deactivate)
router.patch('/:id/deactivate', auth, softDeleteUserCategory);

module.exports = router;
