const express = require('express');
const router = express.Router();
const {
  createNotificationActivity,
  getAllNotificationActivities,
  getNotificationActivityById,
  updateAllNotificationActivities,
  updateNotificationActivity,
  deleteNotificationActivity,
  softDeleteNotificationActivity
} = require('../../../controllers/Notification_activity.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create a new notification activity
router.post('/create', auth, createNotificationActivity);

// Get all notification activities
router.get('/getall', auth, getAllNotificationActivities);

// Get notification activity by ID
router.get('/getbyid/:id', auth, getNotificationActivityById);

// Update all notification activities (bulk update)
router.put('/updateall', auth, updateAllNotificationActivities);

// Update notification activity
router.put('/update', auth, updateNotificationActivity);

// Delete notification activity (hard delete)
router.delete('/delete/:id', auth, deleteNotificationActivity);

// Soft delete notification activity (deactivate)
router.patch('/:id/deactivate', auth, softDeleteNotificationActivity);

module.exports = router;
