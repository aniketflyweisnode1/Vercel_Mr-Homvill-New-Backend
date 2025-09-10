const express = require('express');
const router = express.Router();
const {
  createFaq,
  getAllFaqs,
  getFaqById,
  updateFaq
} = require('../../../controllers/faq.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create (auth)
router.post('/create', auth, createFaq);

// Get all (public)
router.get('/getall', getAllFaqs);

// Get by id (auth)
router.get('/getbyid/:id', auth, getFaqById);

// Update (auth)
router.put('/update', auth, updateFaq);

module.exports = router;
