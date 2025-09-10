const express = require('express');
const router = express.Router();
const {
  createPushNotification,
  getAllPushNotifications,
  getPushNotificationById,
  updatePushNotification
} = require('../../../controllers/Push_Notification.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create (auth)
router.post('/create', auth, createPushNotification);

// Get all (public)
router.get('/getall', getAllPushNotifications);

// Get by id (auth)
router.get('/getbyid/:id', auth, getPushNotificationById);

// Update (auth)
router.put('/update', auth, updatePushNotification);

module.exports = router;
