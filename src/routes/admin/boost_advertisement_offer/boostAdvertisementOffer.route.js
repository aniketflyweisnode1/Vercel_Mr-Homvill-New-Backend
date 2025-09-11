const express = require('express');
const router = express.Router();
const {
  createBoostAdvertisementOffer,
  getAllBoostAdvertisementOffers,
  getBoostAdvertisementOfferById,
  updateBoostAdvertisementOffer
} = require('../../../controllers/Boost_Advertisement_offer.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create (auth)
router.post('/create', auth, createBoostAdvertisementOffer);

// Get all (public)
router.get('/getall', getAllBoostAdvertisementOffers);

// Get by id (auth)
router.get('/getbyid/:id', auth, getBoostAdvertisementOfferById);

// Update (auth)
router.put('/update', auth, updateBoostAdvertisementOffer);

module.exports = router;
