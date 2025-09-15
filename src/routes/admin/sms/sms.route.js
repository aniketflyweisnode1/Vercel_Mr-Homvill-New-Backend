const express = require('express');
const router = express.Router();
const { auth } = require('../../../middleware/authMiddleware');
const {
  sendSingleSMS,
  sendBulkSMSMessages,
  sendRegistrationSMS,
  sendPropertyUpdateSMS,
  sendBookingConfirmationSMS,
  sendCustomSMS,
  getSMSServiceStatus
} = require('../../../controllers/SMS.Controller');

// SMS routes with authentication
router.post('/send', auth, sendSingleSMS);
router.post('/send-bulk', auth, sendBulkSMSMessages);
router.post('/send-registration', auth, sendRegistrationSMS);
router.post('/send-property-update', auth, sendPropertyUpdateSMS);
router.post('/send-booking-confirmation', auth, sendBookingConfirmationSMS);
router.post('/send-custom', auth, sendCustomSMS);
router.get('/status', auth, getSMSServiceStatus);

module.exports = router;
