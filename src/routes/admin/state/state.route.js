const express = require('express');
const router = express.Router();
const {
  createState,
  getAllStates,
  getStatesByCountryId,
  getStateById,
  updateState,
  deleteState,
  softDeleteState
} = require('../../../controllers/State.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  validateCreateState,
  validateUpdateState,
  handleValidationErrors
} = require('../../../Validation/stateValidation.js');

// Create a new state
router.post('/create', auth, validateCreateState, handleValidationErrors, createState);

// Get all states
router.get('/getall',  getAllStates);

// Get states by country ID
router.get('/getbycountry/:countryId', auth, getStatesByCountryId);

// Get state by ID
router.get('/getbyid/:id', auth, getStateById);

// Update state
router.put('/update', auth, validateUpdateState, handleValidationErrors, updateState);

// Delete state (hard delete)
router.delete('/delete/:id', auth, deleteState);

// Soft delete state (deactivate)
router.patch('/:id/deactivate', auth, softDeleteState);

module.exports = router;
