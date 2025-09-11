const express = require('express');
const router = express.Router();
const {
  createBoostAdvertisementPlan,
  getAllBoostAdvertisementPlans,
  getBoostAdvertisementPlanById,
  getBoostAdvertisementPlansByAuth,
  updateBoostAdvertisementPlan
} = require('../../../controllers/Boost_Advertisement_plan.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create (auth)
router.post('/create', auth, createBoostAdvertisementPlan);

// Get all (public)
router.get('/getall', getAllBoostAdvertisementPlans);

// Get by id (auth)
router.get('/getbyid/:id', auth, getBoostAdvertisementPlanById);

// Get by auth user (auth)
router.get('/getbyauth', auth, getBoostAdvertisementPlansByAuth);

// Update (auth)
router.put('/update', auth, updateBoostAdvertisementPlan);

module.exports = router;
