const express = require('express');
const router = express.Router();
const {
  createCart,
  getAllCarts,
  getCartById,
  updateCart,
  deleteCart,
  softDeleteCart
} = require('../../../controllers/Cart.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');

// Create a new cart
router.post('/create', auth, createCart);

// Get all carts
router.get('/getall', auth, getAllCarts);

// Get cart by ID
router.get('/getbyid/:id', auth, getCartById);

// Update cart
router.put('/update', auth, updateCart);

// Delete cart (hard delete)
router.delete('/delete/:id', auth, deleteCart);

// Soft delete cart (deactivate)
router.patch('/:id/deactivate', auth, softDeleteCart);

module.exports = router;
