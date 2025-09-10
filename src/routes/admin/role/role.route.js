const express = require('express');
const router = express.Router();
const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  softDeleteRole
} = require('../../../controllers/Role.Controller.js');
const { auth } = require('../../../middleware/authMiddleware.js');
const {
  validateCreateRole,
  validateUpdateRole,
  handleValidationErrors
} = require('../../../Validation/roleValidation.js');

// Create a new role
router.post('/create', auth, validateCreateRole, handleValidationErrors, createRole);

// Get all roles
router.get('/getall', auth, getAllRoles);

// Get role by ID
router.get('/getbyid/:id', auth, getRoleById);

// Update role
router.put('/update', auth, validateUpdateRole, handleValidationErrors, updateRole);

// Delete role (hard delete)
router.delete('/delete/:id', auth, deleteRole);

// Soft delete role (deactivate)
router.patch('/:id/deactivate', auth, softDeleteRole);

module.exports = router;
