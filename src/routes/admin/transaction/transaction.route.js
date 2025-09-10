const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  getTransactionsByAuth,
  updateTransaction
} = require('../../../controllers/Transaction.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  validateCreateTransaction,
  validateUpdateTransaction,
  handleValidationErrors
} = require('../../../Validation/transactionValidation.js');

// Create (auth)
router.post('/create', auth, validateCreateTransaction, handleValidationErrors, createTransaction);

// Get all (public)
router.get('/getall', getAllTransactions);

// Get by id (auth)
router.get('/getbyid/:id', auth, getTransactionById);

// Get by authenticated user (auth)
router.get('/getbyauth', auth, getTransactionsByAuth);

// Update (auth)
router.put('/update', auth, validateUpdateTransaction, handleValidationErrors, updateTransaction);

module.exports = router;


