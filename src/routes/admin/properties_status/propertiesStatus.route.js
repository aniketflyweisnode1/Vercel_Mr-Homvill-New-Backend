const express = require('express');
const router = express.Router();
const {
  createPropertiesStatus,
  getAllPropertiesStatus,
  getPropertiesStatusById,
  getPropertiesStatusByAuth,
  updatePropertiesStatus,
  deletePropertiesStatus,
  softDeletePropertiesStatus
} = require('../../../controllers/Properties_Status.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  validateCreatePropertiesStatus,
  validateUpdatePropertiesStatus,
  handleValidationErrors
} = require('../../../Validation/propertiesStatusValidation.js');

// Create a new properties status
router.post('/create', auth, validateCreatePropertiesStatus, handleValidationErrors, createPropertiesStatus);

// Get all properties statuses
router.get('/getall', auth, getAllPropertiesStatus);

// Get properties status by ID
router.get('/getbyid/:id', auth, getPropertiesStatusById);

// Get properties status by auth (for authenticated user)
router.get('/getbyauth', auth, getPropertiesStatusByAuth);

// Update properties status
router.put('/update', auth, validateUpdatePropertiesStatus, handleValidationErrors, updatePropertiesStatus);

// Delete properties status (hard delete)
router.delete('/delete/:id', auth, deletePropertiesStatus);

// Soft delete properties status (deactivate)
router.patch('/:id/deactivate', auth, softDeletePropertiesStatus);

module.exports = router;
