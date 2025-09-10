const Role = require('../models/Role.model');
const User = require('../models/User.model');

// Create Role
const createRole = async (req, res) => {
  try {
    const { role_name, description, permissions } = req.body;

    // Check if role already exists
    const existingRole = await Role.findOne({ 
      role_name: role_name 
    });
    
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'Role with this name already exists'
      });
    }

    const role = new Role({
      role_name,
      description,
      permissions: permissions || [],
      CreateBy: req.user?.user_id || null
    });

    const savedRole = await role.save();
    
    // Fetch creator information
    const createByUser = savedRole.CreateBy ? 
      await User.findOne({ user_id: savedRole.CreateBy }) : null;

    const response = savedRole.toObject();
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
    } : null;
    
    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating role',
      error: error.message
    });
  }
};

// Get All Roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({ Status: true })
      .sort({ CreateAt: -1 });

    const rolesResponse = await Promise.all(roles.map(async (role) => {
      const createByUser = role.CreateBy ? 
        await User.findOne({ user_id: role.CreateBy }) : null;

      const roleObj = role.toObject();
      roleObj.CreateBy = createByUser ? { 
        user_id: createByUser.user_id, 
        Name: createByUser.Name, 
        email: createByUser.email 
      } : null;
      return roleObj;
    }));

    res.status(200).json({
      success: true,
      count: rolesResponse.length,
      data: rolesResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching roles',
      error: error.message
    });
  }
};

// Get Role by ID
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const role = await Role.findOne({ 
      Role_id: parseInt(id) 
    });
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    const createByUser = role.CreateBy ? 
      await User.findOne({ user_id: role.CreateBy }) : null;
    const updatedByUser = role.UpdatedBy ? 
      await User.findOne({ user_id: role.UpdatedBy }) : null;

    const response = role.toObject();
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
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching role',
      error: error.message
    });
  }
};

// Update Role
const updateRole = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const userId = req.user.user_id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Role ID is required in request body'
      });
    }

    const role = await Role.findOne({ 
      Role_id: parseInt(id) 
    });
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Check if name is being updated and if it already exists
    if (updateData.role_name && updateData.role_name !== role.role_name) {
      const existingRole = await Role.findOne({ 
        role_name: updateData.role_name,
        Role_id: { $ne: parseInt(id) }
      });
      
      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: 'Role with this name already exists'
        });
      }
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key !== 'Role_id') {
        role[key] = updateData[key];
      }
    });

    role.UpdatedBy = userId;
    role.UpdatedAt = new Date();

    const updatedRole = await role.save();
    
    const createByUser = updatedRole.CreateBy ? 
      await User.findOne({ user_id: updatedRole.CreateBy }) : null;
    const updatedByUser = updatedRole.UpdatedBy ? 
      await User.findOne({ user_id: updatedRole.UpdatedBy }) : null;

    const response = updatedRole.toObject();
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
      message: 'Role updated successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating role',
      error: error.message
    });
  }
};

// Delete Role (hard delete)
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findOne({ 
      Role_id: parseInt(id) 
    });
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    await Role.findOneAndDelete({ 
      Role_id: parseInt(id) 
    });

    res.status(200).json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting role',
      error: error.message
    });
  }
};

// Soft Delete Role (deactivate)
const softDeleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const role = await Role.findOne({ 
      Role_id: parseInt(id) 
    });
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    role.Status = false;
    role.UpdatedBy = userId;
    role.UpdatedAt = new Date();
    await role.save();

    res.status(200).json({
      success: true,
      message: 'Role deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating role',
      error: error.message
    });
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  softDeleteRole
};
