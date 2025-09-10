const express = require('express');
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket
} = require('../../../controllers/Ticket.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create (auth)
router.post('/create', auth, createTicket);

// Get all (public)
router.get('/getall', getAllTickets);

// Get by id (auth)
router.get('/getbyid/:id', auth, getTicketById);

// Update (auth)
router.put('/update', auth, updateTicket);

module.exports = router;
