const express = require('express');
const router = express.Router();
const {
  createReviews,
  getAllReviews,
  getReviewsById,
  updateReviews
} = require('../../../controllers/Reviews.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create (auth)
router.post('/create', auth, createReviews);

// Get all (public)
router.get('/getall', getAllReviews);

// Get by id (auth)
router.get('/getbyid/:id', auth, getReviewsById);

// Update (auth)
router.put('/update', auth, updateReviews);

module.exports = router;
