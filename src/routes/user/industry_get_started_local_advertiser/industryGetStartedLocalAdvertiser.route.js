const express = require('express');
const router = express.Router();
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  createIndustryGetStartedLocalAdvertiser,
  getAllIndustryGetStartedLocalAdvertisers,
  getIndustryGetStartedLocalAdvertiserById,
  getIndustryGetStartedLocalAdvertisersByAuth,
  updateIndustryGetStartedLocalAdvertiser
} = require('../../../controllers/Industry_get_started_local_advertiser.Controller');

// Create Industry_get_started_local_advertiser (auth)
router.post('/create', auth, createIndustryGetStartedLocalAdvertiser);

// Get all Industry_get_started_local_advertisers (public)
router.get('/getall', getAllIndustryGetStartedLocalAdvertisers);

// Get Industry_get_started_local_advertiser by ID (auth)
router.get('/getbyid/:id', auth, getIndustryGetStartedLocalAdvertiserById);

// Get Industry_get_started_local_advertisers by auth user (auth)
router.get('/getbyauth', auth, getIndustryGetStartedLocalAdvertisersByAuth);

// Update Industry_get_started_local_advertiser (auth)
router.put('/update', auth, updateIndustryGetStartedLocalAdvertiser);

module.exports = router;
