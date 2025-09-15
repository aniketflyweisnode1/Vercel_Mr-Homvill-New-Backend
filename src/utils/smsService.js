const axios = require('axios');

// SMS Service Configuration
const SMS_CONFIG = {
  // You can configure multiple SMS providers
  providers: {
    twilio: {
      enabled: process.env.TWILIO_ENABLED === 'true',
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      fromNumber: process.env.TWILIO_PHONE_NUMBER
    },
    aws_sns: {
      enabled: process.env.AWS_SNS_ENABLED === 'true',
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    messagebird: {
      enabled: process.env.MESSAGEBIRD_ENABLED === 'true',
      apiKey: process.env.MESSAGEBIRD_API_KEY,
      originator: process.env.MESSAGEBIRD_ORIGINATOR || 'HomVill'
    }
  }
};

/**
 * Send SMS using Twilio
 */
const sendSMSViaTwilio = async (to, message) => {
  try {
    const twilio = require('twilio');
    const client = twilio(SMS_CONFIG.providers.twilio.accountSid, SMS_CONFIG.providers.twilio.authToken);
    
    const result = await client.messages.create({
      body: message,
      from: SMS_CONFIG.providers.twilio.fromNumber,
      to: to
    });
    
    return {
      success: true,
      provider: 'twilio',
      messageId: result.sid,
      status: result.status,
      data: result
    };
  } catch (error) {
    console.error('Twilio SMS error:', error);
    return {
      success: false,
      provider: 'twilio',
      error: error.message
    };
  }
};

/**
 * Send SMS using AWS SNS
 */
const sendSMSViaAWSSNS = async (to, message) => {
  try {
    const AWS = require('aws-sdk');
    
    // Configure AWS
    AWS.config.update({
      accessKeyId: SMS_CONFIG.providers.aws_sns.accessKeyId,
      secretAccessKey: SMS_CONFIG.providers.aws_sns.secretAccessKey,
      region: SMS_CONFIG.providers.aws_sns.region
    });
    
    const sns = new AWS.SNS();
    
    const params = {
      Message: message,
      PhoneNumber: to
    };
    
    const result = await sns.publish(params).promise();
    
    return {
      success: true,
      provider: 'aws_sns',
      messageId: result.MessageId,
      data: result
    };
  } catch (error) {
    console.error('AWS SNS SMS error:', error);
    return {
      success: false,
      provider: 'aws_sns',
      error: error.message
    };
  }
};

/**
 * Send SMS using MessageBird
 */
const sendSMSViaMessageBird = async (to, message) => {
  try {
    const messagebird = require('messagebird')(SMS_CONFIG.providers.messagebird.apiKey);
    
    const params = {
      originator: SMS_CONFIG.providers.messagebird.originator,
      recipients: [to],
      body: message
    };
    
    const result = await new Promise((resolve, reject) => {
      messagebird.messages.create(params, (err, response) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
    
    return {
      success: true,
      provider: 'messagebird',
      messageId: result.id,
      data: result
    };
  } catch (error) {
    console.error('MessageBird SMS error:', error);
    return {
      success: false,
      provider: 'messagebird',
      error: error.message
    };
  }
};

/**
 * Send SMS using a generic HTTP API (for custom SMS gateways)
 */
const sendSMSViaHTTP = async (to, message, config) => {
  try {
    const response = await axios.post(config.url, {
      to: to,
      message: message,
      ...config.payload
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': config.auth ? `Bearer ${config.auth}` : undefined,
        ...config.headers
      }
    });
    
    return {
      success: true,
      provider: 'http_api',
      messageId: response.data.id || response.data.messageId || 'unknown',
      data: response.data
    };
  } catch (error) {
    console.error('HTTP SMS API error:', error);
    return {
      success: false,
      provider: 'http_api',
      error: error.message
    };
  }
};

/**
 * Main SMS sending function
 */
const sendSMS = async (to, message, options = {}) => {
  try {
    // Validate mobile number format
    const mobileRegex = /^\+?[1-9]\d{1,14}$/;
    if (!mobileRegex.test(to)) {
      return {
        success: false,
        message: 'Invalid mobile number format',
        error: 'Mobile number must be in international format (e.g., +1234567890)'
      };
    }

    // Validate message
    if (!message || message.trim().length === 0) {
      return {
        success: false,
        message: 'Message cannot be empty',
        error: 'Message content is required'
      };
    }

    // If message is too long, truncate it
    const maxLength = 1600; // SMS character limit
    if (message.length > maxLength) {
      message = message.substring(0, maxLength - 3) + '...';
    }

    let result = null;
    const preferredProvider = options.provider || 'auto';

    // Try providers in order of preference
    if (preferredProvider === 'twilio' || preferredProvider === 'auto') {
      if (SMS_CONFIG.providers.twilio.enabled) {
        result = await sendSMSViaTwilio(to, message);
        if (result.success) return result;
      }
    }

    if (preferredProvider === 'aws_sns' || preferredProvider === 'auto') {
      if (SMS_CONFIG.providers.aws_sns.enabled) {
        result = await sendSMSViaAWSSNS(to, message);
        if (result.success) return result;
      }
    }

    if (preferredProvider === 'messagebird' || preferredProvider === 'auto') {
      if (SMS_CONFIG.providers.messagebird.enabled) {
        result = await sendSMSViaMessageBird(to, message);
        if (result.success) return result;
      }
    }

    // If all providers failed, return the last error
    if (result && !result.success) {
      return {
        success: false,
        message: 'Failed to send SMS',
        error: result.error,
        provider: result.provider
      };
    }

    // If no providers are enabled, return error
    return {
      success: false,
      message: 'No SMS providers configured',
      error: 'Please configure at least one SMS provider in environment variables'
    };

  } catch (error) {
    console.error('SMS sending error:', error);
    return {
      success: false,
      message: 'Internal SMS service error',
      error: error.message
    };
  }
};

/**
 * Send bulk SMS to multiple numbers
 */
const sendBulkSMS = async (recipients, message, options = {}) => {
  try {
    if (!Array.isArray(recipients) || recipients.length === 0) {
      return {
        success: false,
        message: 'Recipients list is required',
        error: 'Recipients must be an array of mobile numbers'
      };
    }

    const results = [];
    const batchSize = options.batchSize || 10; // Send in batches to avoid rate limits
    const delay = options.delay || 1000; // 1 second delay between batches

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (recipient) => {
        const result = await sendSMS(recipient, message, options);
        return {
          recipient,
          ...result
        };
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Add delay between batches
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    return {
      success: failureCount === 0,
      message: `Bulk SMS completed: ${successCount} sent, ${failureCount} failed`,
      data: {
        total: results.length,
        successful: successCount,
        failed: failureCount,
        results: results
      }
    };

  } catch (error) {
    console.error('Bulk SMS error:', error);
    return {
      success: false,
      message: 'Bulk SMS service error',
      error: error.message
    };
  }
};

/**
 * Get SMS service status
 */
const getSMSStatus = () => {
  const status = {
    providers: {},
    configured: false
  };

  Object.keys(SMS_CONFIG.providers).forEach(provider => {
    const config = SMS_CONFIG.providers[provider];
    status.providers[provider] = {
      enabled: config.enabled,
      configured: config.enabled && Object.values(config).every(value => value !== undefined && value !== '')
    };
  });

  status.configured = Object.values(status.providers).some(provider => provider.configured);

  return status;
};

module.exports = {
  sendSMS,
  sendBulkSMS,
  getSMSStatus,
  SMS_CONFIG
};
