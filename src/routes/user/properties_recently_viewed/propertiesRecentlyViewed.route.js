const express = require('express');
const router = express.Router();
const {
  createPropertiesRecentlyViewed,
  getAllPropertiesRecentlyViewed,
  getPropertiesRecentlyViewedById,
  getPropertiesRecentlyViewedByAuth,
  updatePropertiesRecentlyViewed,
  deletePropertiesRecentlyViewed
} = require('../../../controllers/Properties_Recently_viewed.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create (auth)
router.post('/create', auth, createPropertiesRecentlyViewed);

// Get all (public)
router.get('/getall', getAllPropertiesRecentlyViewed);

// Get by id (auth)
router.get('/getbyid/:id', auth, getPropertiesRecentlyViewedById);

// Get by auth user (auth)
router.get('/getbyauth', auth, getPropertiesRecentlyViewedByAuth);

// Update (auth)
router.put('/update', auth, updatePropertiesRecentlyViewed);

// Delete (auth)
router.delete('/delete/:id', auth, deletePropertiesRecentlyViewed);

module.exports = router;
