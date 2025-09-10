const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      user_id: user.user_id,
      email: user.email,
      role: user.Role_id // Just store the numeric role ID
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findOne({ user_id: decoded.user_id });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    // Add decoded token information to req for access in controllers
    req.tokenData = {
      id: decoded.id,
      user_id: decoded.user_id,
      email: decoded.email,
      role: decoded.role
    };

    if (!user.isLoginPermission || !user.Status) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User account is disabled.'
      });
    }

    req.user = {
      id: user.user_id, // Use the numeric user_id instead of MongoDB _id
      user_id: user.user_id,
      email: user.email,
      role: user.Role_id
    };
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.',
      error: error.message
    });
  }
};

module.exports = { auth, generateToken };
