const express = require('express');
const router = express.Router();
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  createIndustryGetStartedSeller,
  getAllIndustryGetStartedSellers,
  getIndustryGetStartedSellerById,
  getIndustryGetStartedSellersByAuth,
  updateIndustryGetStartedSeller
} = require('../../../controllers/Industry_get_started_Seller.Controller');

// Create Industry_get_started_Seller (auth)
router.post('/create', auth, createIndustryGetStartedSeller);

// Get all Industry_get_started_Sellers (public)
router.get('/getall', getAllIndustryGetStartedSellers);

// Get Industry_get_started_Seller by ID (auth)
router.get('/getbyid/:id', auth, getIndustryGetStartedSellerById);

// Get Industry_get_started_Sellers by auth user (auth)
router.get('/getbyauth', auth, getIndustryGetStartedSellersByAuth);

// Update Industry_get_started_Seller (auth)
router.put('/update', auth, updateIndustryGetStartedSeller);

module.exports = router;
