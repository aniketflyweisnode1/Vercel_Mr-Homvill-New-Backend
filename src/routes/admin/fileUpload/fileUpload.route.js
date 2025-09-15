const express = require('express');
const router = express.Router();
const { auth } = require('../../../middleware/authMiddleware');
const {
  uploadSingleFile,
  uploadMultipleFiles,
  getUploadConfig,
  testFileUpload
} = require('../../../controllers/FileUpload.Controller');

// File upload routes with authentication
router.post('/single', auth, uploadSingleFile);
router.post('/multiple', auth, uploadMultipleFiles);
router.get('/config', auth, getUploadConfig);
router.get('/test', auth, testFileUpload);

module.exports = router;
