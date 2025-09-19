const express = require('express');
const router = express.Router();
const {
  createResponsibility,
  getAllResponsibilities,
  getResponsibilityById,
  updateResponsibility,
  deleteResponsibility,
  softDeleteResponsibility
} = require('../../../controllers/Responsibility.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  validateCreateResponsibility,
  validateUpdateResponsibility,
  handleValidationErrors
} = require('../../../Validation/responsibilityValidation.js');

// Create a new responsibility
router.post('/create', auth, validateCreateResponsibility, handleValidationErrors, createResponsibility);

// Get all responsibilities
router.get('/getall', getAllResponsibilities);

// Get responsibility by ID
router.get('/getbyid/:id', auth, getResponsibilityById);

// Update responsibility
router.put('/update', auth, validateUpdateResponsibility, handleValidationErrors, updateResponsibility);

// Delete responsibility (hard delete)
router.delete('/delete/:id', auth, deleteResponsibility);

// Soft delete responsibility (deactivate)
router.patch('/:id/deactivate', auth, softDeleteResponsibility);

module.exports = router;
