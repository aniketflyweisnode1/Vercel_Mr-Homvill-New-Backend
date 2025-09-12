const express = require('express');
const router = express.Router();
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  createPlanMapUser,
  getAllPlanMapUsers,
  getPlanMapUserById,
  getPlanMapUsersByAuth,
  updatePlanMapUser
} = require('../../../controllers/Plan_map_user.Controller');

// Create Plan_map_user (auth)
router.post('/create', auth, createPlanMapUser);

// Get all Plan_map_users (public)
router.get('/getall', getAllPlanMapUsers);

// Get Plan_map_user by ID (auth)
router.get('/getbyid/:id', auth, getPlanMapUserById);

// Get Plan_map_users by auth user (auth)
router.get('/getbyauth', auth, getPlanMapUsersByAuth);

// Update Plan_map_user (auth)
router.put('/update', auth, updatePlanMapUser);

module.exports = router;
