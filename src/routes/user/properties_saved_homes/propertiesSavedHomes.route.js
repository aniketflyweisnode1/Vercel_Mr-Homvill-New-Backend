const express = require('express');
const router = express.Router();
const {
  createPropertiesSavedHomes,
  getAllPropertiesSavedHomes,
  getPropertiesSavedHomesById,
  getPropertiesSavedHomesByAuth,
  updatePropertiesSavedHomes,
  deletePropertiesSavedHomes
} = require('../../../controllers/Properties_saved_homes.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create (auth)
router.post('/create', auth, createPropertiesSavedHomes);

// Get all (public)
router.get('/getall', getAllPropertiesSavedHomes);

// Get by id (auth)
router.get('/getbyid/:id', auth, getPropertiesSavedHomesById);

// Get by auth user (auth)
router.get('/getbyauth', auth, getPropertiesSavedHomesByAuth);

// Update (auth)
router.put('/update', auth, updatePropertiesSavedHomes);

// Delete (auth)
router.delete('/delete/:id', auth, deletePropertiesSavedHomes);

module.exports = router;
