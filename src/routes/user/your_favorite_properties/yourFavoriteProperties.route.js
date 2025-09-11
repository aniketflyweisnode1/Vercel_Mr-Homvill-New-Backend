const express = require('express');
const router = express.Router();
const {
  createYourFavoriteProperties,
  getAllYourFavoriteProperties,
  getYourFavoritePropertiesById,
  getYourFavoritePropertiesByAuth,
  updateYourFavoriteProperties,
  deleteYourFavoriteProperties
} = require('../../../controllers/Your_Favorite_Properties.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create (auth)
router.post('/create', auth, createYourFavoriteProperties);

// Get all (public)
router.get('/getall', getAllYourFavoriteProperties);

// Get by id (auth)
router.get('/getbyid/:id', auth, getYourFavoritePropertiesById);

// Get by auth user (auth)
router.get('/getbyauth', auth, getYourFavoritePropertiesByAuth);

// Update (auth)
router.put('/update', auth, updateYourFavoriteProperties);

// Delete (auth)
router.delete('/delete/:id', auth, deleteYourFavoriteProperties);

module.exports = router;
