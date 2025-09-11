const express = require('express');
const router = express.Router();
const {
  createPropertiesSavedSearches,
  getAllPropertiesSavedSearches,
  getPropertiesSavedSearchesById,
  getPropertiesSavedSearchesByAuth,
  updatePropertiesSavedSearches,
  deletePropertiesSavedSearches
} = require('../../../controllers/Properties_saved_searches.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create (auth)
router.post('/create', auth, createPropertiesSavedSearches);

// Get all (public)
router.get('/getall', getAllPropertiesSavedSearches);

// Get by id (auth)
router.get('/getbyid/:id', auth, getPropertiesSavedSearchesById);

// Get by auth user (auth)
router.get('/getbyauth', auth, getPropertiesSavedSearchesByAuth);

// Update (auth)
router.put('/update', auth, updatePropertiesSavedSearches);

// Delete (auth)
router.delete('/delete/:id', auth, deletePropertiesSavedSearches);

module.exports = router;
