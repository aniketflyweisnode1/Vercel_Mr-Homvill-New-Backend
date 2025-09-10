const express = require('express');
const router = express.Router();
const {
  createReviewsType,
  getAllReviewsTypes,
  getReviewsTypeById,
  getReviewsTypesByAuth,
  updateReviewsType
} = require('../../../controllers/Reviews_type.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create (auth)
router.post('/create', auth, createReviewsType);

// Get all (public)
router.get('/getall', getAllReviewsTypes);

// Get by id (auth)
router.get('/getbyid/:id', auth, getReviewsTypeById);

// Get by auth user (auth)
router.get('/getbyauth', auth, getReviewsTypesByAuth);

// Update (auth)
router.put('/update', auth, updateReviewsType);

module.exports = router;
