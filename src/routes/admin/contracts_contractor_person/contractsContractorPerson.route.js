const express = require('express');
const router = express.Router();
const {
  createContractsContractorPerson,
  getAllContractsContractorPersons,
  getContractsContractorPersonById,
  getContractsContractorPersonByAuth,
  updateContractsContractorPerson,
  deleteContractsContractorPerson,
  softDeleteContractsContractorPerson
} = require('../../../controllers/Contracts_Contractor_person.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  validateCreateContractsContractorPerson,
  validateUpdateContractsContractorPerson,
  handleValidationErrors
} = require('../../../Validation/contractsContractorPersonValidation.js');

// Create a new contracts contractor person
router.post('/create', auth, validateCreateContractsContractorPerson, handleValidationErrors, createContractsContractorPerson);

// Get all contracts contractor persons
router.get('/getall', auth, getAllContractsContractorPersons);

// Get contracts contractor person by ID
router.get('/getbyid/:id', auth, getContractsContractorPersonById);

// Get contracts contractor person by auth (for authenticated user)
router.get('/getbyauth', auth, getContractsContractorPersonByAuth);

// Update contracts contractor person
router.put('/update', auth, validateUpdateContractsContractorPerson, handleValidationErrors, updateContractsContractorPerson);

// Delete contracts contractor person (hard delete)
router.delete('/delete/:id', auth, deleteContractsContractorPerson);

// Soft delete contracts contractor person (deactivate)
router.patch('/:id/deactivate', auth, softDeleteContractsContractorPerson);

module.exports = router;
