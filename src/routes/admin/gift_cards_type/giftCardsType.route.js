const express = require('express');
const router = express.Router();
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  createGiftCardsType,
  getAllGiftCardsTypes,
  getGiftCardsTypeById,
  getGiftCardsTypesByAuth,
  updateGiftCardsType
} = require('../../../controllers/Gift_cards_type.Controller');

// Create Gift_cards_type (auth)
router.post('/create', auth, createGiftCardsType);

// Get all Gift_cards_types (public)
router.get('/getall', getAllGiftCardsTypes);

// Get Gift_cards_type by ID (auth)
router.get('/getbyid/:id', auth, getGiftCardsTypeById);

// Get Gift_cards_types by auth user (auth)
router.get('/getbyauth', auth, getGiftCardsTypesByAuth);

// Update Gift_cards_type (auth)
router.put('/update', auth, updateGiftCardsType);

module.exports = router;
