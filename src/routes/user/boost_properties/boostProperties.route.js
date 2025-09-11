const express = require('express');
const router = express.Router();
const {
  createBoostProperties,
  getAllBoostProperties,
  getBoostPropertiesById,
  updateBoostProperties
} = require('../../../controllers/Boost_Properties.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create (auth)
router.post('/create', auth, createBoostProperties);

// Get all (public)
router.get('/getall', getAllBoostProperties);

// Get by id (auth)
router.get('/getbyid/:id', auth, getBoostPropertiesById);

// Update (auth)
router.put('/update', auth, updateBoostProperties);

module.exports = router;
