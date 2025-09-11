const express = require('express');
const router = express.Router();
const {
  createPropertiesYourHome,
  getAllPropertiesYourHome,
  getPropertiesYourHomeById,
  getPropertiesYourHomeByAuth,
  updatePropertiesYourHome,
  deletePropertiesYourHome
} = require('../../../controllers/Properties_Your_home.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create (auth)
router.post('/create', auth, createPropertiesYourHome);

// Get all (public)
router.get('/getall', getAllPropertiesYourHome);

// Get by id (auth)
router.get('/getbyid/:id', auth, getPropertiesYourHomeById);

// Get by auth user (auth)
router.get('/getbyauth', auth, getPropertiesYourHomeByAuth);

// Update (auth)
router.put('/update', auth, updatePropertiesYourHome);

// Delete (auth)
router.delete('/delete/:id', auth, deletePropertiesYourHome);

module.exports = router;
