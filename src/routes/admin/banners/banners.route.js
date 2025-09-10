const express = require('express');
const router = express.Router();
const {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner
} = require('../../../controllers/Banners.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create (auth)
router.post('/create', auth, createBanner);

// Get all (public)
router.get('/getall', getAllBanners);

// Get by id (auth)
router.get('/getbyid/:id', auth, getBannerById);

// Update (auth)
router.put('/update', auth, updateBanner);

module.exports = router;


