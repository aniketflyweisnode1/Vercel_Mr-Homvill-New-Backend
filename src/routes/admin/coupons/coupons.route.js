const express = require('express');
const router = express.Router();
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  createCoupons,
  getAllCoupons,
  getCouponsById,
  updateCoupons
} = require('../../../controllers/Coupons.Controller');

// Create Coupons (auth)
router.post('/create', auth, createCoupons);

// Get all Coupons (public)
router.get('/getall', getAllCoupons);

// Get Coupons by ID (auth)
router.get('/getbyid/:id', auth, getCouponsById);

// Update Coupons (auth)
router.put('/update', auth, updateCoupons);

module.exports = router;
