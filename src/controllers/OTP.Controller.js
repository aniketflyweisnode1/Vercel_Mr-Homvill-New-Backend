const User = require('../models/User.model');
const { generateOTP } = require('../utils/otpGenerator');
const { sendEmail } = require('../utils/emailService');

// Send OTP for forgot password
const sendForgetPasswordOTPController = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email address'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP in user document (you might want to create a separate OTP collection)
    // For now, we'll use a simple approach by storing in user document
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send OTP via email
    const emailSubject = 'Password Reset OTP';
    const emailBody = `
      <h2>Password Reset Request</h2>
      <p>Hello ${user.Name},</p>
      <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
      <h3 style="color: #007bff; font-size: 24px; letter-spacing: 5px;">${otp}</h3>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you did not request this password reset, please ignore this email.</p>
      <br>
      <p>Best regards,<br>Your Application Team</p>
    `;

    try {
      await sendEmail(user.email, emailSubject, emailBody);
      
      res.status(200).json({
        success: true,
        message: 'OTP sent successfully to your email address'
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      res.status(500).json({
        success: false,
        OTP : otp,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending OTP',
      error: error.message
    });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email address'
      });
    }

    // Check if OTP exists and is not expired
    if (!user.resetPasswordOTP || !user.resetPasswordOTPExpiry) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found or OTP has expired. Please request a new OTP.'
      });
    }

    if (new Date() > user.resetPasswordOTPExpiry) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please check and try again.'
      });
    }

    // OTP is valid
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message
    });
  }
};

// Verify OTP and reset password
const verifyOTPAndResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email address'
      });
    }

    // Check if OTP exists and is not expired
    if (!user.resetPasswordOTP || !user.resetPasswordOTPExpiry) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found or OTP has expired. Please request a new OTP.'
      });
    }

    if (new Date() > user.resetPasswordOTPExpiry) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please check and try again.'
      });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    user.UpdatedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
};

module.exports = {
  sendForgetPasswordOTPController,
  verifyOTP,
  verifyOTPAndResetPassword
};
