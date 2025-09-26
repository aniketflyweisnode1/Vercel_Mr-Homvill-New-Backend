const express = require('express');
const router = express.Router();
const {
  createPrivacyPolicy,
  getAllPrivacyPolicies,
  getPrivacyPolicyById,
  updatePrivacyPolicy,
  deletePrivacyPolicy
} = require('../../../controllers/Privacy_policy.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create (auth)
router.post('/create', auth, createPrivacyPolicy);

// Get all (public)
router.get('/getall', getAllPrivacyPolicies);

// Get by id (auth)
router.get('/getbyid/:id', auth, getPrivacyPolicyById);

// Update (auth)
router.put('/update', auth, updatePrivacyPolicy);

// Delete (auth)
router.delete('/delete/:id', auth, deletePrivacyPolicy);

module.exports = router;
