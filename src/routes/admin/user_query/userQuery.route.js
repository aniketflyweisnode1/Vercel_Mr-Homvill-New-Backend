const express = require('express');
const router = express.Router();
const {
  createUserQuery,
  getAllUserQueries,
  getUserQueryById,
  updateUserQuery
} = require('../../../controllers/user_Query.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create (auth)
router.post('/create', auth, createUserQuery);

// Get all (public)
router.get('/getall', getAllUserQueries);

// Get by id (auth)
router.get('/getbyid/:id', auth, getUserQueryById);

// Update (auth)
router.put('/update', auth, updateUserQuery);

module.exports = router;
