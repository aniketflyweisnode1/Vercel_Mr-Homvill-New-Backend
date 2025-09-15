const express = require('express');
const router = express.Router();
const {
  createUserAddress,
  getAllUserAddresses,
  getUserAddressById,
  getUserAddressesByAuth,
  updateUserAddress,
  deleteUserAddress,
  softDeleteUserAddress
} = require('../../../controllers/User_Address.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create a new user address
router.post('/create', auth, createUserAddress);

// Get all user addresses
router.get('/getall', auth, getAllUserAddresses);

// Get user addresses by auth (current user)
router.get('/getbyauth', auth, getUserAddressesByAuth);

// Get user address by ID
router.get('/getbyid/:id', auth, getUserAddressById);

// Update user address
router.put('/update', auth, updateUserAddress);

// Delete user address (hard delete)
router.delete('/delete/:id', auth, deleteUserAddress);

// Soft delete user address (deactivate)
router.patch('/:id/deactivate', auth, softDeleteUserAddress);

module.exports = router;
