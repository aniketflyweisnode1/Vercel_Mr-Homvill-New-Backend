const express = require('express');
const router = express.Router();
const {
  createPropertiesRenterHub,
  getAllPropertiesRenterHub,
  getPropertiesRenterHubById,
  getPropertiesRenterHubByAuth,
  updatePropertiesRenterHub,
  deletePropertiesRenterHub
} = require('../../../controllers/Properties_Renter_hub.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create (auth)
router.post('/create', auth, createPropertiesRenterHub);

// Get all (public)
router.get('/getall', getAllPropertiesRenterHub);

// Get by id (auth)
router.get('/getbyid/:id', auth, getPropertiesRenterHubById);

// Get by auth user (auth)
router.get('/getbyauth', auth, getPropertiesRenterHubByAuth);

// Update (auth)
router.put('/update', auth, updatePropertiesRenterHub);

// Delete (auth)
router.delete('/delete/:id', auth, deletePropertiesRenterHub);

module.exports = router;
