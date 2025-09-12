const express = require('express');
const router = express.Router();
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  createCouponsMapUser,
  getAllCouponsMapUsers,
  getCouponsMapUserById,
  updateCouponsMapUser
} = require('../../../controllers/Coupons_Map_user.Controller');

// Create Coupons_Map_user (auth)
router.post('/create', auth, createCouponsMapUser);

// Get all Coupons_Map_users (public)
router.get('/getall', getAllCouponsMapUsers);

// Get Coupons_Map_user by ID (auth)
router.get('/getbyid/:id', auth, getCouponsMapUserById);

// Update Coupons_Map_user (auth)
router.put('/update', auth, updateCouponsMapUser);

module.exports = router;
