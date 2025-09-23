const express = require('express');
const router = express.Router();
const {
  createContractsCompany,
  getAllContractsCompanies,
  getContractsCompanyById,
  getContractsCompanyByAuth,
  getContractsCompaniesByCategoryId,
  updateContractsCompany,
  deleteContractsCompany,
  softDeleteContractsCompany
} = require('../../../controllers/Contracts_Company.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  validateCreateContractsCompany,
  validateUpdateContractsCompany,
  handleValidationErrors
} = require('../../../Validation/contractsCompanyValidation.js');

// Create a new contracts company
router.post('/create', auth, validateCreateContractsCompany, handleValidationErrors, createContractsCompany);

// Get all contracts companies
router.get('/getall', getAllContractsCompanies);

// Get contracts company by ID
router.get('/getbyid/:id', auth, getContractsCompanyById);

// Get contracts company by auth (for authenticated user)
router.get('/getbyauth', auth, getContractsCompanyByAuth);

// Get contracts companies by category ID
router.get('/getbycategoryid/:category_id', getContractsCompaniesByCategoryId);

// Update contracts company
router.put('/update', auth, validateUpdateContractsCompany, handleValidationErrors, updateContractsCompany);

// Delete contracts company (hard delete)
router.delete('/delete/:id', auth, deleteContractsCompany);

// Soft delete contracts company (deactivate)
router.patch('/:id/deactivate', auth, softDeleteContractsCompany);

module.exports = router;
