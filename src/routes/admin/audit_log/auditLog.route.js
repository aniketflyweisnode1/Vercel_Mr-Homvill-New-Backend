const express = require('express');
const router = express.Router();
const {
  createAuditLog,
  updateAuditLog,
  getAuditLogById,
  getAllAuditLogs,
  getAuditLogsByAuth
} = require('../../../controllers/Audit_log.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create (auth)
router.post('/create', auth, createAuditLog);

// Update (auth)
router.put('/update', auth, updateAuditLog);

// Get by id (auth)
router.get('/getbyid/:id', auth, getAuditLogById);

// Get all (public)
router.get('/getall', getAllAuditLogs);

// Get by auth (auth)
router.get('/getbyauth', auth, getAuditLogsByAuth);

module.exports = router;


