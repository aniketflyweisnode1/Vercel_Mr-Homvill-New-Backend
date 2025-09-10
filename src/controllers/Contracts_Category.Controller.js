const Contracts_Category = require('../models/Contracts_Category.model');
const User = require('../models/User.model');

// Create Contracts Category
const createContractsCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if contracts category already exists
    const existingCategory = await Contracts_Category.findOne({ 
      name: name,
      Status: true
    });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Contracts category with this name already exists'
      });
    }

    const contractsCategory = new Contracts_Category({
      name: name,
      CreateBy: req.user?.user_id || null
    });

    const savedCategory = await contractsCategory.save();
    
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
      message: 'Contracts category created successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating contracts category',
      error: error.message
    });
  }
};

// Get All Contracts Categories
const getAllContractsCategories = async (req, res) => {
  try {
    const categories = await Contracts_Category.find({ Status: true })
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
      message: 'Error fetching contracts categories',
      error: error.message
    });
  }
};

// Get Contracts Category by ID
const getContractsCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Contracts_Category.findOne({ 
      Contracts_Category_id: parseInt(id) 
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Contracts category not found'
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
      message: 'Error fetching contracts category',
      error: error.message
    });
  }
};

// Update Contracts Category
const updateContractsCategory = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const userId = req.user.user_id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Contracts category ID is required in request body'
      });
    }

    const category = await Contracts_Category.findOne({ 
      Contracts_Category_id: parseInt(id) 
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Contracts category not found'
      });
    }

    // Check if name is being updated and if it already exists
    if (updateData.name) {
      const existingCategory = await Contracts_Category.findOne({ 
        name: updateData.name,
        Contracts_Category_id: { $ne: parseInt(id) },
        Status: true
      });
      
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Contracts category with this name already exists'
        });
      }
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key !== 'Contracts_Category_id') {
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
      message: 'Contracts category updated successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating contracts category',
      error: error.message
    });
  }
};

// Delete Contracts Category (hard delete)
const deleteContractsCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Contracts_Category.findOne({ 
      Contracts_Category_id: parseInt(id) 
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Contracts category not found'
      });
    }

    await Contracts_Category.findOneAndDelete({ 
      Contracts_Category_id: parseInt(id) 
    });

    res.status(200).json({
      success: true,
      message: 'Contracts category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting contracts category',
      error: error.message
    });
  }
};

// Soft Delete Contracts Category (deactivate)
const softDeleteContractsCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const category = await Contracts_Category.findOne({ 
      Contracts_Category_id: parseInt(id) 
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Contracts category not found'
      });
    }

    category.Status = false;
    category.UpdatedBy = userId;
    category.UpdatedAt = new Date();
    await category.save();

    res.status(200).json({
      success: true,
      message: 'Contracts category deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating contracts category',
      error: error.message
    });
  }
};

module.exports = {
  createContractsCategory,
  getAllContractsCategories,
  getContractsCategoryById,
  updateContractsCategory,
  deleteContractsCategory,
  softDeleteContractsCategory
};

