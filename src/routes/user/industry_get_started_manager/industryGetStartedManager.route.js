const express = require('express');
const router = express.Router();
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  createIndustryGetStartedManager,
  getAllIndustryGetStartedManagers,
  getIndustryGetStartedManagerById,
  getIndustryGetStartedManagersByAuth,
  updateIndustryGetStartedManager
} = require('../../../controllers/Industry_get_started_manager.Controller');

// Create Industry_get_started_manager (auth)
router.post('/create', auth, createIndustryGetStartedManager);

// Get all Industry_get_started_managers (public)
router.get('/getall', getAllIndustryGetStartedManagers);

// Get Industry_get_started_manager by ID (auth)
router.get('/getbyid/:id', auth, getIndustryGetStartedManagerById);

// Get Industry_get_started_managers by auth user (auth)
router.get('/getbyauth', auth, getIndustryGetStartedManagersByAuth);

// Update Industry_get_started_manager (auth)
router.put('/update', auth, updateIndustryGetStartedManager);

module.exports = router;
