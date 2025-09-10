const express = require('express');
const router = express.Router();
const {
  createContractsEnquiries,
  getAllContractsEnquiries,
  getContractsEnquiriesById,
  updateContractsEnquiries
} = require('../../../controllers/Contracts_Enquiries.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create contracts enquiry (auth)
router.post('/create', auth, createContractsEnquiries);

// Get all contracts enquiries (public per requirement)
router.get('/getall', getAllContractsEnquiries);

// Get contracts enquiry by id (auth)
router.get('/getbyid/:id', auth, getContractsEnquiriesById);

// Update contracts enquiry (auth)
router.put('/update', auth, updateContractsEnquiries);

module.exports = router;


