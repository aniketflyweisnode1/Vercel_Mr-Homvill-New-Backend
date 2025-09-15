const { sendSMS, sendBulkSMS, getSMSStatus } = require('../utils/smsService');

/**
 * Send single SMS message
 */
const sendSingleSMS = async (req, res) => {
  try {
    const { mobileNumber, message, provider } = req.body;

    if (!mobileNumber || !message) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number and message are required'
      });
    }

    const result = await sendSMS(mobileNumber, message, { provider });

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'SMS sent successfully',
        data: {
          mobileNumber: mobileNumber,
          message: message,
          provider: result.provider,
          messageId: result.messageId,
          sentAt: new Date().toISOString()
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message || 'Failed to send SMS',
        error: result.error
      });
    }

  } catch (error) {
    console.error('Error in sendSingleSMS:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Send bulk SMS messages
 */
const sendBulkSMSMessages = async (req, res) => {
  try {
    const { recipients, message, provider, batchSize, delay } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Recipients array is required and cannot be empty'
      });
    }

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const result = await sendBulkSMS(recipients, message, { 
      provider, 
      batchSize: batchSize || 10, 
      delay: delay || 1000 
    });

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message || 'Failed to send bulk SMS',
        error: result.error
      });
    }

  } catch (error) {
    console.error('Error in sendBulkSMSMessages:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Send SMS for user registration
 */
const sendRegistrationSMS = async (req, res) => {
  try {
    const { mobileNumber, userName } = req.body;

    if (!mobileNumber) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      });
    }

    const message = `Welcome to HomVill! ${userName ? `Hi ${userName}, ` : ''}Your account has been successfully created. Thank you for joining our platform.`;

    const result = await sendSMS(mobileNumber, message);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Registration SMS sent successfully',
        data: {
          mobileNumber: mobileNumber,
          message: message,
          provider: result.provider,
          messageId: result.messageId,
          sentAt: new Date().toISOString()
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message || 'Failed to send registration SMS',
        error: result.error
      });
    }

  } catch (error) {
    console.error('Error in sendRegistrationSMS:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Send SMS for property updates
 */
const sendPropertyUpdateSMS = async (req, res) => {
  try {
    const { mobileNumber, propertyTitle, updateType } = req.body;

    if (!mobileNumber || !propertyTitle) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number and property title are required'
      });
    }

    const message = `HomVill Update: ${updateType || 'New update'} for property "${propertyTitle}". Check your HomVill app for more details.`;

    const result = await sendSMS(mobileNumber, message);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Property update SMS sent successfully',
        data: {
          mobileNumber: mobileNumber,
          message: message,
          provider: result.provider,
          messageId: result.messageId,
          sentAt: new Date().toISOString()
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message || 'Failed to send property update SMS',
        error: result.error
      });
    }

  } catch (error) {
    console.error('Error in sendPropertyUpdateSMS:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Send SMS for booking confirmations
 */
const sendBookingConfirmationSMS = async (req, res) => {
  try {
    const { mobileNumber, bookingId, propertyTitle, bookingDate } = req.body;

    if (!mobileNumber || !bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number and booking ID are required'
      });
    }

    const message = `HomVill Booking Confirmed! Booking ID: ${bookingId}${propertyTitle ? ` for ${propertyTitle}` : ''}${bookingDate ? ` on ${bookingDate}` : ''}. Thank you for choosing HomVill!`;

    const result = await sendSMS(mobileNumber, message);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Booking confirmation SMS sent successfully',
        data: {
          mobileNumber: mobileNumber,
          message: message,
          provider: result.provider,
          messageId: result.messageId,
          sentAt: new Date().toISOString()
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message || 'Failed to send booking confirmation SMS',
        error: result.error
      });
    }

  } catch (error) {
    console.error('Error in sendBookingConfirmationSMS:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Send custom SMS message
 */
const sendCustomSMS = async (req, res) => {
  try {
    const { mobileNumber, message, provider } = req.body;

    if (!mobileNumber || !message) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number and message are required'
      });
    }

    const result = await sendSMS(mobileNumber, message, { provider });

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Custom SMS sent successfully',
        data: {
          mobileNumber: mobileNumber,
          message: message,
          provider: result.provider,
          messageId: result.messageId,
          sentAt: new Date().toISOString()
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message || 'Failed to send custom SMS',
        error: result.error
      });
    }

  } catch (error) {
    console.error('Error in sendCustomSMS:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get SMS service status
 */
const getSMSServiceStatus = async (req, res) => {
  try {
    const status = getSMSStatus();
    
    res.status(200).json({
      success: true,
      message: 'SMS service status retrieved successfully',
      data: {
        ...status,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in getSMSServiceStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  sendSingleSMS,
  sendBulkSMSMessages,
  sendRegistrationSMS,
  sendPropertyUpdateSMS,
  sendBookingConfirmationSMS,
  sendCustomSMS,
  getSMSServiceStatus
};
