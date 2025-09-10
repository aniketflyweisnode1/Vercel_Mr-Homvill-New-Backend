const express = require('express');
const router = express.Router();
const {
  createContractsCompany,
  getAllContractsCompanies,
  getContractsCompanyById,
  getContractsCompanyByAuth,
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
router.get('/getall', auth, getAllContractsCompanies);

// Get contracts company by ID
router.get('/getbyid/:id', auth, getContractsCompanyById);

// Get contracts company by auth (for authenticated user)
router.get('/getbyauth', auth, getContractsCompanyByAuth);

// Update contracts company
router.put('/update', auth, validateUpdateContractsCompany, handleValidationErrors, updateContractsCompany);

// Delete contracts company (hard delete)
router.delete('/delete/:id', auth, deleteContractsCompany);

// Soft delete contracts company (deactivate)
router.patch('/:id/deactivate', auth, softDeleteContractsCompany);

module.exports = router;
