const express = require('express');
const router = express.Router();
const {
  createSubAdminPermission,
  getAllSubAdminPermissions,
  getSubAdminPermissionById,
  getSubAdminPermissionByAuth,
  getSubAdminPermissionByUserId,
  updateSubAdminPermission,
  deleteSubAdminPermission
} = require('../../../controllers/SubAdmin_Permission.Controller');
const { auth } = require('../../../middleware/authMiddleware');

// Create (auth)
router.post('/create', auth, createSubAdminPermission);

// Get all (auth)
router.get('/getall', auth, getAllSubAdminPermissions);

// Get by id (auth)
router.get('/getbyid/:id', auth, getSubAdminPermissionById);

// Get by auth (auth)
router.get('/getbyauth', auth, getSubAdminPermissionByAuth);

// Get by user_id (auth)
router.get('/getbyuser/:user_id', auth, getSubAdminPermissionByUserId);

// Update (auth)
router.put('/update', auth, updateSubAdminPermission);

// Delete (auth)
router.delete('/delete/:id', auth, deleteSubAdminPermission);

module.exports = router;


