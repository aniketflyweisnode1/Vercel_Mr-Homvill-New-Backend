const express = require('express');
const router = express.Router();
const {
  createPropertiesManageTours,
  getAllPropertiesManageTours,
  getPropertiesManageToursById,
  getPropertiesManageToursByAuth,
  updatePropertiesManageTours,
  deletePropertiesManageTours
} = require('../../../controllers/Properties_Manage_tours.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create (auth)
router.post('/create', auth, createPropertiesManageTours);

// Get all (public)
router.get('/getall', getAllPropertiesManageTours);

// Get by id (auth)
router.get('/getbyid/:id', auth, getPropertiesManageToursById);

// Get by auth user (auth)
router.get('/getbyauth', auth, getPropertiesManageToursByAuth);

// Update (auth)
router.put('/update', auth, updatePropertiesManageTours);

// Delete (auth)
router.delete('/delete/:id', auth, deletePropertiesManageTours);

module.exports = router;
