const express = require('express');
const router = express.Router();
const {
  createTermsCondition,
  getAllTermsConditions,
  getTermsConditionById,
  updateTermsCondition,
  deleteTermsCondition
} = require('../../../controllers/terms_Condition.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create (auth)
router.post('/create', auth, createTermsCondition);

// Get all (public)
router.get('/getall', getAllTermsConditions);

// Get by id (auth)
router.get('/getbyid/:id', auth, getTermsConditionById);

// Update (auth)
router.put('/update', auth, updateTermsCondition);

// Delete (auth)
router.delete('/delete/:id', auth, deleteTermsCondition);

module.exports = router;
