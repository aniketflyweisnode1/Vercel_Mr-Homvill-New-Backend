const express = require('express');
const router = express.Router();
const {
  createArea,
  getAllAreas,
  getAreasByAuth,
  getAreaById,
  updateArea
} = require('../../../controllers/Area.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  validateCreateArea,
  validateUpdateArea,
  handleValidationErrors
} = require('../../../Validation/areaValidation.js');

// Create (auth)
router.post('/create', auth, validateCreateArea, handleValidationErrors, createArea);

// Get all (public)
router.get('/getall', getAllAreas);

// Get by auth (auth)
router.get('/getbyauth', auth, getAreasByAuth);

// Get by id (auth)
router.get('/getbyid/:id', auth, getAreaById);

// Update (auth)
router.put('/update', auth, validateUpdateArea, handleValidationErrors, updateArea);

module.exports = router;


