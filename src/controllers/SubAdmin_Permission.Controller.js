const SubAdmin_Permission = require('../models/SubAdmin_Permission.model');
const User = require('../models/User.model');

// Create SubAdmin Permission
const createSubAdminPermission = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      user_id,
      User,
      Properties,
      Contracts,
      Subscription,
      ApprovedStatus,
      Description
    } = req.body;

    // Check if user exists
    const user = await User.findOne({ user_id: parseInt(user_id) });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if permission already exists for this user
    const existingPermission = await SubAdmin_Permission.findOne({ user_id: parseInt(user_id) });
    if (existingPermission) {
      return res.status(400).json({
        success: false,
        message: 'Permission already exists for this user'
      });
    }

    const subAdminPermission = new SubAdmin_Permission({
      user_id: parseInt(user_id),
      User: User || [{ Edit: false, View: false }],
      Properties: Properties || [{ Edit: false, View: false }],
      Contracts: Contracts || [{ Edit: false, View: false }],
      Subscription: Subscription || [{ Edit: false, View: false }],
      ApprovedStatus: ApprovedStatus || false,
      Description: Description || null,
      CreateBy: userId
    });

    const saved = await subAdminPermission.save();

    // Fetch related data
    const [userData, createByUser] = await Promise.all([
      User.findOne({ user_id: saved.user_id }),
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null
    ]);

    const response = saved.toObject();
    response.user_id = userData ? { 
      user_id: userData.user_id, 
      Name: userData.Name, 
      email: userData.email 
    } : null;
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
    } : null;

    res.status(201).json({ 
      success: true, 
      message: 'SubAdmin Permission created successfully', 
      data: response 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error creating subadmin permission', 
      error: error.message 
    });
  }
};

// Get all SubAdmin Permissions
const getAllSubAdminPermissions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'active' } = req.query;
    
    // Build query
    const query = {};
    if (status === 'active') {
      query.Status = true;
    } else if (status === 'inactive') {
      query.Status = false;
    }
    // If status is 'all', don't add Status filter

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [permissions, totalCount] = await Promise.all([
      SubAdmin_Permission.find(query)
        .sort({ CreateAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      SubAdmin_Permission.countDocuments(query)
    ]);

    const response = await Promise.all(permissions.map(async (permission) => {
      const [userData, createByUser, updatedByUser] = await Promise.all([
        User.findOne({ user_id: permission.user_id }),
        permission.CreateBy ? User.findOne({ user_id: permission.CreateBy }) : null,
        permission.UpdatedBy ? User.findOne({ user_id: permission.UpdatedBy }) : null
      ]);

      const obj = permission.toObject();
      obj.user_id = userData ? { 
        user_id: userData.user_id, 
        Name: userData.Name, 
        email: userData.email 
      } : null;
      obj.CreateBy = createByUser ? { 
        user_id: createByUser.user_id, 
        Name: createByUser.Name, 
        email: createByUser.email 
      } : null;
      obj.UpdatedBy = updatedByUser ? { 
        user_id: updatedByUser.user_id, 
        Name: updatedByUser.Name, 
        email: updatedByUser.email 
      } : null;
      return obj;
    }));

    res.status(200).json({ 
      success: true, 
      count: response.length,
      totalCount: totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      filters: { status: status },
      data: response 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching subadmin permissions', 
      error: error.message 
    });
  }
};

// Get SubAdmin Permission by ID
const getSubAdminPermissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const permission = await SubAdmin_Permission.findOne({ SubAdmin_Permission_id: parseInt(id) });
    
    if (!permission) {
      return res.status(404).json({ 
        success: false, 
        message: 'SubAdmin Permission not found' 
      });
    }

    const [userData, createByUser, updatedByUser] = await Promise.all([
      User.findOne({ user_id: permission.user_id }),
      permission.CreateBy ? User.findOne({ user_id: permission.CreateBy }) : null,
      permission.UpdatedBy ? User.findOne({ user_id: permission.UpdatedBy }) : null
    ]);

    const response = permission.toObject();
    response.user_id = userData ? { 
      user_id: userData.user_id, 
      Name: userData.Name, 
      email: userData.email 
    } : null;
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
    } : null;
    response.UpdatedBy = updatedByUser ? { 
      user_id: updatedByUser.user_id, 
      Name: updatedByUser.Name, 
      email: updatedByUser.email 
    } : null;

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching subadmin permission', 
      error: error.message 
    });
  }
};

// Get SubAdmin Permission by Auth (current user)
const getSubAdminPermissionByAuth = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const permission = await SubAdmin_Permission.findOne({ user_id: userId });
    
    if (!permission) {
      return res.status(404).json({ 
        success: false, 
        message: 'SubAdmin Permission not found for current user' 
      });
    }

    const [userData, createByUser, updatedByUser] = await Promise.all([
      User.findOne({ user_id: permission.user_id }),
      permission.CreateBy ? User.findOne({ user_id: permission.CreateBy }) : null,
      permission.UpdatedBy ? User.findOne({ user_id: permission.UpdatedBy }) : null
    ]);

    const response = permission.toObject();
    response.user_id = userData ? { 
      user_id: userData.user_id, 
      Name: userData.Name, 
      email: userData.email 
    } : null;
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
    } : null;
    response.UpdatedBy = updatedByUser ? { 
      user_id: updatedByUser.user_id, 
      Name: updatedByUser.Name, 
      email: updatedByUser.email 
    } : null;

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching subadmin permission', 
      error: error.message 
    });
  }
};

// Get SubAdmin Permission by User ID
const getSubAdminPermissionByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const permission = await SubAdmin_Permission.findOne({ user_id: parseInt(user_id) });
    
    if (!permission) {
      return res.status(404).json({ 
        success: false, 
        message: 'SubAdmin Permission not found for this user' 
      });
    }

    const [userData, createByUser, updatedByUser] = await Promise.all([
      User.findOne({ user_id: permission.user_id }),
      permission.CreateBy ? User.findOne({ user_id: permission.CreateBy }) : null,
      permission.UpdatedBy ? User.findOne({ user_id: permission.UpdatedBy }) : null
    ]);

    const response = permission.toObject();
    response.user_id = userData ? { 
      user_id: userData.user_id, 
      Name: userData.Name, 
      email: userData.email 
    } : null;
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
    } : null;
    response.UpdatedBy = updatedByUser ? { 
      user_id: updatedByUser.user_id, 
      Name: updatedByUser.Name, 
      email: updatedByUser.email 
    } : null;

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching subadmin permission', 
      error: error.message 
    });
  }
};

// Update SubAdmin Permission
const updateSubAdminPermission = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'SubAdmin_Permission_id is required in request body' 
      });
    }

    const permission = await SubAdmin_Permission.findOne({ SubAdmin_Permission_id: parseInt(id) });
    if (!permission) {
      return res.status(404).json({ 
        success: false, 
        message: 'SubAdmin Permission not found' 
      });
    }

    // Update fields
    Object.keys(updateData).forEach((key) => {
      if (key !== 'SubAdmin_Permission_id') {
        permission[key] = updateData[key];
      }
    });

    permission.UpdatedBy = userId;
    permission.UpdatedAt = new Date();
    const updated = await permission.save();

    const [userData, createByUser, updatedByUser] = await Promise.all([
      User.findOne({ user_id: updated.user_id }),
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null
    ]);

    const response = updated.toObject();
    response.user_id = userData ? { 
      user_id: userData.user_id, 
      Name: userData.Name, 
      email: userData.email 
    } : null;
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
    } : null;
    response.UpdatedBy = updatedByUser ? { 
      user_id: updatedByUser.user_id, 
      Name: updatedByUser.Name, 
      email: updatedByUser.email 
    } : null;

    res.status(200).json({ 
      success: true, 
      message: 'SubAdmin Permission updated successfully', 
      data: response 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating subadmin permission', 
      error: error.message 
    });
  }
};

// Delete SubAdmin Permission
const deleteSubAdminPermission = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    
    const permission = await SubAdmin_Permission.findOne({ SubAdmin_Permission_id: parseInt(id) });
    if (!permission) {
      return res.status(404).json({ 
        success: false, 
        message: 'SubAdmin Permission not found' 
      });
    }

    // Soft delete by setting Status to false
    permission.Status = false;
    permission.UpdatedBy = userId;
    permission.UpdatedAt = new Date();
    
    const deleted = await permission.save();

    const [userData, createByUser, updatedByUser] = await Promise.all([
      User.findOne({ user_id: deleted.user_id }),
      deleted.CreateBy ? User.findOne({ user_id: deleted.CreateBy }) : null,
      deleted.UpdatedBy ? User.findOne({ user_id: deleted.UpdatedBy }) : null
    ]);

    const response = deleted.toObject();
    response.user_id = userData ? { 
      user_id: userData.user_id, 
      Name: userData.Name, 
      email: userData.email 
    } : null;
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
    } : null;
    response.UpdatedBy = updatedByUser ? { 
      user_id: updatedByUser.user_id, 
      Name: updatedByUser.Name, 
      email: updatedByUser.email 
    } : null;

    res.status(200).json({ 
      success: true, 
      message: 'SubAdmin Permission deleted successfully', 
      data: response 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting subadmin permission', 
      error: error.message 
    });
  }
};

module.exports = {
  createSubAdminPermission,
  getAllSubAdminPermissions,
  getSubAdminPermissionById,
  getSubAdminPermissionByAuth,
  getSubAdminPermissionByUserId,
  updateSubAdminPermission,
  deleteSubAdminPermission
};
