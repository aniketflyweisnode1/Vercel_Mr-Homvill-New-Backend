const express = require('express');
const router = express.Router();
const {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription
} = require('../../../controllers/Subscriptions.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  validateCreateSubscription,
  validateUpdateSubscription,
  handleValidationErrors
} = require('../../../Validation/subscriptionsValidation.js');

// Create subscription (auth)
router.post('/create', auth, validateCreateSubscription, handleValidationErrors, createSubscription);

// Get all subscriptions (public)
router.get('/getall', getAllSubscriptions);

// Get subscription by id (auth)
router.get('/getbyid/:id', auth, getSubscriptionById);

// Update subscription (auth)
router.put('/update', auth, validateUpdateSubscription, handleValidationErrors, updateSubscription);

module.exports = router;


