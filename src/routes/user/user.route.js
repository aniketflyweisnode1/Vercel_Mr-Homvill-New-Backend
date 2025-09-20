const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  softDeleteUser,
  getUserByAuth,
  logout,
  activateUser,
  deactivateUser
} = require('../../controllers/User.Controller.js');
const {
  loginUser,
  adminLogin,
  changePassword
} = require('../../controllers/Auth.Controller.js');
const {
  sendForgetPasswordOTPController,
  verifyOTPAndResetPassword,
  verifyOTP
} = require('../../controllers/OTP.Controller.js');
const {
  validateCreateUser,
  validateUpdateUser, 
  handleValidationErrors
} = require('../../middleware/userValidation.js');
const {
  validateLogin,
  validateAdminLogin,
  validateChangePassword
} = require('../../middleware/authValidation.js');
const {
  validateSendOTP,
  validateVerifyOTP,
  validateVerifyOTPAndResetPassword
} = require('../../middleware/otpValidation.js');
const { auth } = require('../../middleware/authMiddleware.js');

// Create a new user
router.post('/create',  createUser);

// Get all users with pagination and search
router.get('/getall',  getAllUsers);

// Get user by ID
router.get('/getbyid/:id', auth, getUserById);

// Get user by auth (current logged in user)
router.get('/getbyauth', auth, getUserByAuth);

// Update user
router.put('/update', auth, validateUpdateUser, handleValidationErrors, updateUser);

// Delete user (hard delete)
router.delete('/delete/:id', auth, deleteUser);

// Soft delete user (deactivate)
router.patch('/delete/:id/deactivate', auth, softDeleteUser);

// Authentication routes
router.post('/login', validateLogin, handleValidationErrors, loginUser);
router.post('/admin-login', validateAdminLogin, handleValidationErrors, adminLogin);
router.post('/logout', auth, logout);
router.put('/change-password', auth, validateChangePassword, handleValidationErrors, changePassword);

// Forget Password routes 29/08/2025
router.post('/forget-password/send-otp', validateSendOTP, handleValidationErrors, sendForgetPasswordOTPController);
router.post('/forget-password/verify-otp', validateVerifyOTP, handleValidationErrors, verifyOTP);
router.post('/forget-password/reset-password', validateVerifyOTPAndResetPassword, handleValidationErrors, verifyOTPAndResetPassword);

// Account activation/deactivation routes 15/09/2025
router.patch('/activate', auth, activateUser);
router.patch('/deactivate', auth, deactivateUser);

module.exports = router;
