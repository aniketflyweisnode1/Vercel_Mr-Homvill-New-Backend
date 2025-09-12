const express = require('express');
const router = express.Router();
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  createPlan,
  getAllPlans,
  getPlanById,
  getPlansByAuth,
  updatePlan
} = require('../../../controllers/Plan.Controller');

// Create Plan (auth)
router.post('/create', auth, createPlan);

// Get all Plans (public)
router.get('/getall', getAllPlans);

// Get Plan by ID (auth)
router.get('/getbyid/:id', auth, getPlanById);

// Get Plans by auth user (auth)
router.get('/getbyauth', auth, getPlansByAuth);

// Update Plan (auth)
router.put('/update', auth, updatePlan);

module.exports = router;
