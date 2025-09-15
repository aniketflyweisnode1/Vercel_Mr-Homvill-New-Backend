const express = require('express');
const router = express.Router();
const {
  createDocumentPreferences,
  getAllDocumentPreferences,
  getDocumentPreferencesById,
  updateDocumentPreferences,
  deleteDocumentPreferences,
  softDeleteDocumentPreferences
} = require('../../../controllers/Document_preferences.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create a new document preferences
router.post('/create', auth, createDocumentPreferences);

// Get all document preferences
router.get('/getall', auth, getAllDocumentPreferences);

// Get document preferences by ID
router.get('/getbyid/:id', auth, getDocumentPreferencesById);

// Update document preferences
router.put('/update', auth, updateDocumentPreferences);

// Delete document preferences (hard delete)
router.delete('/delete/:id', auth, deleteDocumentPreferences);

// Soft delete document preferences (deactivate)
router.patch('/:id/deactivate', auth, softDeleteDocumentPreferences);

module.exports = router;
