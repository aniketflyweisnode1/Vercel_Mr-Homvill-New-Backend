const express = require('express');
const router = express.Router();
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  createIndustryGetStartedLandlord,
  getAllIndustryGetStartedLandlords,
  getIndustryGetStartedLandlordById,
  getIndustryGetStartedLandlordsByAuth,
  updateIndustryGetStartedLandlord
} = require('../../../controllers/Industry_get_started_landlord.Controller');

// Create Industry_get_started_landlord (auth)
router.post('/create', auth, createIndustryGetStartedLandlord);

// Get all Industry_get_started_landlords (public)
router.get('/getall', getAllIndustryGetStartedLandlords);

// Get Industry_get_started_landlord by ID (auth)
router.get('/getbyid/:id', auth, getIndustryGetStartedLandlordById);

// Get Industry_get_started_landlords by auth user (auth)
router.get('/getbyauth', auth, getIndustryGetStartedLandlordsByAuth);

// Update Industry_get_started_landlord (auth)
router.put('/update', auth, updateIndustryGetStartedLandlord);

module.exports = router;
