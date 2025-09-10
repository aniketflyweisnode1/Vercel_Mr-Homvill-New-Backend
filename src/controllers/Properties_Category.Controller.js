const Properties_Category = require('../models/Properties_Category.model');
const User = require('../models/User.model');

// Create Properties Category
const createPropertiesCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if properties category already exists
    const existingCategory = await Properties_Category.findOne({ 
      name: name,
      Status: true
    });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Properties category with this name already exists'
      });
    }

    const propertiesCategory = new Properties_Category({
      name: name,
      CreateBy: req.user?.user_id || null
    });

    const savedCategory = await propertiesCategory.save();
    
    // Fetch related data
    const createByUser = savedCategory.CreateBy ? 
      await User.findOne({ user_id: savedCategory.CreateBy }) : null;

    const response = savedCategory.toObject();
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
    } : null;
    
    res.status(201).json({
      success: true,
      message: 'Properties category created successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating properties category',
      error: error.message
    });
  }
};

// Get All Properties Categories
const getAllPropertiesCategories = async (req, res) => {
  try {
    const categories = await Properties_Category.find({ Status: true })
      .sort({ CreateAt: -1 });

    const categoriesResponse = await Promise.all(categories.map(async (category) => {
      const [createByUser, updatedByUser] = await Promise.all([
        category.CreateBy ? User.findOne({ user_id: category.CreateBy }) : null,
        category.UpdatedBy ? User.findOne({ user_id: category.UpdatedBy }) : null
      ]);

      const categoryObj = category.toObject();
      categoryObj.CreateBy = createByUser ? { 
        user_id: createByUser.user_id, 
        Name: createByUser.Name, 
        email: createByUser.email 
      } : null;
      categoryObj.UpdatedBy = updatedByUser ? { 
        user_id: updatedByUser.user_id, 
        Name: updatedByUser.Name, 
        email: updatedByUser.email 
      } : null;
      return categoryObj;
    }));

    res.status(200).json({
      success: true,
      count: categoriesResponse.length,
      data: categoriesResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching properties categories',
      error: error.message
    });
  }
};

// Get Properties Category by ID
const getPropertiesCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Properties_Category.findOne({ 
      Properties_Category_id: parseInt(id) 
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Properties category not found'
      });
    }

    const [createByUser, updatedByUser] = await Promise.all([
      category.CreateBy ? User.findOne({ user_id: category.CreateBy }) : null,
      category.UpdatedBy ? User.findOne({ user_id: category.UpdatedBy }) : null
    ]);

    const response = category.toObject();
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
      message: 'Error fetching properties category',
      error: error.message
    });
  }
};

// Update Properties Category
const updatePropertiesCategory = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const userId = req.user.user_id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Properties category ID is required in request body'
      });
    }

    const category = await Properties_Category.findOne({ 
      Properties_Category_id: parseInt(id) 
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Properties category not found'
      });
    }

    // Check if name is being updated and if it already exists
    if (updateData.name) {
      const existingCategory = await Properties_Category.findOne({ 
        name: updateData.name,
        Properties_Category_id: { $ne: parseInt(id) },
        Status: true
      });
      
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Properties category with this name already exists'
        });
      }
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key !== 'Properties_Category_id') {
        category[key] = updateData[key];
      }
    });

    category.UpdatedBy = userId;
    category.UpdatedAt = new Date();

    const updatedCategory = await category.save();
    
    const [createByUser, updatedByUser] = await Promise.all([
      updatedCategory.CreateBy ? User.findOne({ user_id: updatedCategory.CreateBy }) : null,
      updatedCategory.UpdatedBy ? User.findOne({ user_id: updatedCategory.UpdatedBy }) : null
    ]);

    const response = updatedCategory.toObject();
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
      message: 'Properties category updated successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating properties category',
      error: error.message
    });
  }
};

// Delete Properties Category (hard delete)
const deletePropertiesCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Properties_Category.findOne({ 
      Properties_Category_id: parseInt(id) 
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Properties category not found'
      });
    }

    await Properties_Category.findOneAndDelete({ 
      Properties_Category_id: parseInt(id) 
    });

    res.status(200).json({
      success: true,
      message: 'Properties category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting properties category',
      error: error.message
    });
  }
};

// Soft Delete Properties Category (deactivate)
const softDeletePropertiesCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const category = await Properties_Category.findOne({ 
      Properties_Category_id: parseInt(id) 
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Properties category not found'
      });
    }

    category.Status = false;
    category.UpdatedBy = userId;
    category.UpdatedAt = new Date();
    await category.save();

    res.status(200).json({
      success: true,
      message: 'Properties category deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating properties category',
      error: error.message
    });
  }
};

module.exports = {
  createPropertiesCategory,
  getAllPropertiesCategories,
  getPropertiesCategoryById,
  updatePropertiesCategory,
  deletePropertiesCategory,
  softDeletePropertiesCategory
};
