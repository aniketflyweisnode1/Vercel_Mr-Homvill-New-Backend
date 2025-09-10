const express = require('express');
const router = express.Router();
const {
  createContractsCategory,
  getAllContractsCategories,
  getContractsCategoryById,
  updateContractsCategory,
  deleteContractsCategory,
  softDeleteContractsCategory
} = require('../../../controllers/Contracts_Category.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  validateCreateContractsCategory,
  validateUpdateContractsCategory,
  handleValidationErrors
} = require('../../../Validation/contractsCategoryValidation.js');

// Create a new contracts category
router.post('/create', auth, validateCreateContractsCategory, handleValidationErrors, createContractsCategory);

// Get all contracts categories
router.get('/getall', auth, getAllContractsCategories);

// Get contracts category by ID
router.get('/getbyid/:id', auth, getContractsCategoryById);

// Update contracts category
router.put('/update', auth, validateUpdateContractsCategory, handleValidationErrors, updateContractsCategory);

// Delete contracts category (hard delete)
router.delete('/delete/:id', auth, deleteContractsCategory);

// Soft delete contracts category (deactivate)
router.patch('/:id/deactivate', auth, softDeleteContractsCategory);

module.exports = router;
