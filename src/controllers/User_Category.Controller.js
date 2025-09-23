const User_Category = require('../models/User_Category.model');
const Role = require('../models/Role.model');
const User = require('../models/User.model');

// Create User Category
const createUserCategory = async (req, res) => {
  try {
    const { role_id, Category_name } = req.body;

    // Check if role exists
    const role = await Role.findOne({ Role_id: parseInt(role_id) });
    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Check if user category already exists for this role
    const existingUserCategory = await User_Category.findOne({ 
      Category_name: Category_name,
      Status: true
    });
    
    if (existingUserCategory) {
      return res.status(400).json({
        success: false,
        message: 'User category for this role already exists'
      });
    }

    const userCategory = new User_Category({
      role_id: parseInt(role_id),
      Category_name: Category_name,
      CreateBy: req.user?.user_id || null
    });

    const savedUserCategory = await userCategory.save();
    
    // Fetch related data
    const [roleData, createByUser] = await Promise.all([
      Role.findOne({ Role_id: savedUserCategory.role_id }),
      savedUserCategory.CreateBy ? User.findOne({ user_id: savedUserCategory.CreateBy }) : null
    ]);

    const response = savedUserCategory.toObject();
    response.role_id = roleData ? { 
      Role_id: roleData.Role_id, 
      role_name: roleData.role_name 
    } : null;
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
    } : null;
    
    res.status(201).json({
      success: true,
      message: 'User category created successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user category',
      error: error.message
    });
  }
};

// Get All User Categories
const getAllUserCategories = async (req, res) => {
  try {
    const userCategories = await User_Category.find({ Status: true })
      .sort({ CreateAt: -1 });

    const userCategoriesResponse = await Promise.all(userCategories.map(async (userCategory) => {
      const [roleData, createByUser] = await Promise.all([
        Role.findOne({ Role_id: userCategory.role_id }),
        userCategory.CreateBy ? User.findOne({ user_id: userCategory.CreateBy }) : null
      ]);

      const categoryObj = userCategory.toObject();
      categoryObj.role_id = roleData ? { 
        Role_id: roleData.Role_id, 
        role_name: roleData.role_name 
      } : null;
      categoryObj.CreateBy = createByUser ? { 
        user_id: createByUser.user_id, 
        Name: createByUser.Name, 
        email: createByUser.email 
      } : null;
      return categoryObj;
    }));

    res.status(200).json({
      success: true,
      count: userCategoriesResponse.length,
      data: userCategoriesResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user categories',
      error: error.message
    });
  }
};

// Get User Category by ID
const getUserCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const userCategory = await User_Category.findOne({ 
      User_Category_id: parseInt(id) 
    });
    
    if (!userCategory) {
      return res.status(404).json({
        success: false,
        message: 'User category not found'
      });
    }

    const [roleData, createByUser, updatedByUser] = await Promise.all([
      Role.findOne({ Role_id: userCategory.role_id }),
      userCategory.CreateBy ? User.findOne({ user_id: userCategory.CreateBy }) : null,
      userCategory.UpdatedBy ? User.findOne({ user_id: userCategory.UpdatedBy }) : null
    ]);

    const response = userCategory.toObject();
    response.role_id = roleData ? { 
      Role_id: roleData.Role_id, 
      role_name: roleData.role_name 
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
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user category',
      error: error.message
    });
  }
};

// Update User Category
const updateUserCategory = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const userId = req.user.user_id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User category ID is required in request body'
      });
    }

    const userCategory = await User_Category.findOne({ 
      User_Category_id: parseInt(id) 
    });
    
    if (!userCategory) {
      return res.status(404).json({
        success: false,
        message: 'User category not found'
      });
    }

    // Check if role is being updated and if it exists
    if (updateData.role_id) {
      const role = await Role.findOne({ Role_id: parseInt(updateData.role_id) });
      if (!role) {
        return res.status(400).json({
          success: false,
          message: 'Role not found'
        });
      }

      // Check if another user category already exists for this role
      const existingUserCategory = await User_Category.findOne({ 
        role_id: parseInt(updateData.role_id),
        User_Category_id: { $ne: parseInt(id) },
        Status: true
      });
      
      if (existingUserCategory) {
        return res.status(400).json({
          success: false,
          message: 'User category for this role already exists'
        });
      }
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key !== 'User_Category_id') {
        if (key === 'role_id') {
          userCategory[key] = parseInt(updateData[key]);
        } else {
          userCategory[key] = updateData[key];
        }
      }
    });

    userCategory.UpdatedBy = userId;
    userCategory.UpdatedAt = new Date();

    const updatedUserCategory = await userCategory.save();
    
    const [roleData, createByUser, updatedByUser] = await Promise.all([
      Role.findOne({ Role_id: updatedUserCategory.role_id }),
      updatedUserCategory.CreateBy ? User.findOne({ user_id: updatedUserCategory.CreateBy }) : null,
      updatedUserCategory.UpdatedBy ? User.findOne({ user_id: updatedUserCategory.UpdatedBy }) : null
    ]);

    const response = updatedUserCategory.toObject();
    response.role_id = roleData ? { 
      Role_id: roleData.Role_id, 
      role_name: roleData.role_name 
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
      message: 'User category updated successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user category',
      error: error.message
    });
  }
};

// Delete User Category (hard delete)
const deleteUserCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const userCategory = await User_Category.findOne({ 
      User_Category_id: parseInt(id) 
    });
    
    if (!userCategory) {
      return res.status(404).json({
        success: false,
        message: 'User category not found'
      });
    }

    await User_Category.findOneAndDelete({ 
      User_Category_id: parseInt(id) 
    });

    res.status(200).json({
      success: true,
      message: 'User category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user category',
      error: error.message
    });
  }
};

// Soft Delete User Category (deactivate)
const softDeleteUserCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const userCategory = await User_Category.findOne({ 
      User_Category_id: parseInt(id) 
    });
    
    if (!userCategory) {
      return res.status(404).json({
        success: false,
        message: 'User category not found'
      });
    }

    userCategory.Status = false;
    userCategory.UpdatedBy = userId;
    userCategory.UpdatedAt = new Date();
    await userCategory.save();

    res.status(200).json({
      success: true,
      message: 'User category deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating user category',
      error: error.message
    });
  }
};

module.exports = {
  createUserCategory,
  getAllUserCategories,
  getUserCategoryById,
  updateUserCategory,
  deleteUserCategory,
  softDeleteUserCategory
};
