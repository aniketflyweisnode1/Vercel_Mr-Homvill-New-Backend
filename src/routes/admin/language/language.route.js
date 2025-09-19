const express = require('express');
const router = express.Router();
const {
  createLanguage,
  getAllLanguages,
  getLanguageById,
  updateLanguage,
  deleteLanguage,
  softDeleteLanguage
} = require('../../../controllers/Language.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  validateCreateLanguage,
  validateUpdateLanguage,
  handleValidationErrors
} = require('../../../Validation/languageValidation.js');

// Create a new language
router.post('/create', auth, validateCreateLanguage, handleValidationErrors, createLanguage);

// Get all languages
router.get('/getall', getAllLanguages);

// Get language by ID
router.get('/getbyid/:id', auth, getLanguageById);

// Update language
router.put('/update', auth, validateUpdateLanguage, handleValidationErrors, updateLanguage);

// Delete language (hard delete)
router.delete('/delete/:id', auth, deleteLanguage);

// Soft delete language (deactivate)
router.patch('/:id/deactivate', auth, softDeleteLanguage);

module.exports = router;
