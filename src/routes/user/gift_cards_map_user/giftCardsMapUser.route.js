const express = require('express');
const router = express.Router();
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  createGiftCardsMapUser,
  getAllGiftCardsMapUsers,
  getGiftCardsMapUserById,
  updateGiftCardsMapUser
} = require('../../../controllers/Gift_cards_Map_user.Controller');

// Create Gift_cards_Map_user (auth)
router.post('/create', auth, createGiftCardsMapUser);

// Get all Gift_cards_Map_users (public)
router.get('/getall', getAllGiftCardsMapUsers);

// Get Gift_cards_Map_user by ID (auth)
router.get('/getbyid/:id', auth, getGiftCardsMapUserById);

// Update Gift_cards_Map_user (auth)
router.put('/update', auth, updateGiftCardsMapUser);

module.exports = router;
