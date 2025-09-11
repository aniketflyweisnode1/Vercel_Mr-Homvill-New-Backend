const express = require('express');
const router = express.Router();
const { searchProperties } = require('../../../controllers/Search.Controller.js');

// Search Properties (public)
router.get('/search-properties', searchProperties);

module.exports = router;
