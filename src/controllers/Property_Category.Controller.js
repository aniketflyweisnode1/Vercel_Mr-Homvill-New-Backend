const Property_Category = require('../models/Property_Category.model');
const User = require('../models/User.model');

// Create Property Category
const createPropertyCategory = async (req, res) => {
  try {
    const {
      Name,
      Description,
      Status
    } = req.body;

    const propertyCategory = new Property_Category({
      Name,
      Description,
      Status: Status !== undefined ? Status : true,
      CreateBy: req.user.user_id,
      UpdatedBy: req.user.user_id
    });

    await propertyCategory.save();

    res.status(201).json({
      success: true,
      message: 'Property category created successfully',
      data: propertyCategory
    });
  } catch (error) {
    console.error('Error creating property category:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get All Property Categories
const getAllPropertyCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { Name: { $regex: search, $options: 'i' } },
          { Description: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const propertyCategories = await Property_Category.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ CreateAt: -1 });

    // Manually populate user data
    for (let category of propertyCategories) {
      if (category.CreateBy) {
        const createUser = await User.findOne({ user_id: category.CreateBy });
        category.CreateBy = createUser ? { user_id: createUser.user_id, Name: createUser.Name, last_name: createUser.last_name } : null;
      }
      if (category.UpdatedBy) {
        const updateUser = await User.findOne({ user_id: category.UpdatedBy });
        category.UpdatedBy = updateUser ? { user_id: updateUser.user_id, Name: updateUser.Name, last_name: updateUser.last_name } : null;
      }
    }

    const total = await Property_Category.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Property categories retrieved successfully',
      data: propertyCategories,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error getting property categories:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get Property Category by ID
const getPropertyCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const propertyCategory = await Property_Category.findOne({ Property_Category_id: id });

    // Manually populate user data
    if (propertyCategory) {
      if (propertyCategory.CreateBy) {
        const createUser = await User.findOne({ user_id: propertyCategory.CreateBy });
        propertyCategory.CreateBy = createUser ? { user_id: createUser.user_id, Name: createUser.Name, last_name: createUser.last_name } : null;
      }
      if (propertyCategory.UpdatedBy) {
        const updateUser = await User.findOne({ user_id: propertyCategory.UpdatedBy });
        propertyCategory.UpdatedBy = updateUser ? { user_id: updateUser.user_id, Name: updateUser.Name, last_name: updateUser.last_name } : null;
      }
    }

    if (!propertyCategory) {
      return res.status(404).json({
        success: false,
        message: 'Property category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Property category retrieved successfully',
      data: propertyCategory
    });
  } catch (error) {
    console.error('Error getting property category:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update Property Category
const updatePropertyCategory = async (req, res) => {
  try {
    const { Property_Category_id, Name, Description, Status } = req.body;

    const propertyCategory = await Property_Category.findOne({ Property_Category_id });
    if (!propertyCategory) {
      return res.status(404).json({
        success: false,
        message: 'Property category not found'
      });
    }

    const updateData = {
      UpdatedBy: req.user.user_id,
      UpdatedAt: new Date()
    };

    if (Name !== undefined) updateData.Name = Name;
    if (Description !== undefined) updateData.Description = Description;
    if (Status !== undefined) updateData.Status = Status;

    const updatedPropertyCategory = await Property_Category.findOneAndUpdate(
      { Property_Category_id },
      updateData,
      { new: true }
    );

    // Manually populate user data
    if (updatedPropertyCategory) {
      if (updatedPropertyCategory.CreateBy) {
        const createUser = await User.findOne({ user_id: updatedPropertyCategory.CreateBy });
        updatedPropertyCategory.CreateBy = createUser ? { user_id: createUser.user_id, Name: createUser.Name, last_name: createUser.last_name } : null;
      }
      if (updatedPropertyCategory.UpdatedBy) {
        const updateUser = await User.findOne({ user_id: updatedPropertyCategory.UpdatedBy });
        updatedPropertyCategory.UpdatedBy = updateUser ? { user_id: updateUser.user_id, Name: updateUser.Name, last_name: updateUser.last_name } : null;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Property category updated successfully',
      data: updatedPropertyCategory
    });
  } catch (error) {
    console.error('Error updating property category:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete Property Category (Hard Delete)
const deletePropertyCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const propertyCategory = await Property_Category.findOneAndDelete({ Property_Category_id: id });
    if (!propertyCategory) {
      return res.status(404).json({
        success: false,
        message: 'Property category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Property category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting property category:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Soft Delete Property Category (Deactivate)
const softDeletePropertyCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const propertyCategory = await Property_Category.findOneAndUpdate(
      { Property_Category_id: id },
      { 
        Status: false,
        UpdatedBy: req.user.user_id,
        UpdatedAt: new Date()
      },
      { new: true }
    );

    if (!propertyCategory) {
      return res.status(404).json({
        success: false,
        message: 'Property category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Property category deactivated successfully',
      data: propertyCategory
    });
  } catch (error) {
    console.error('Error deactivating property category:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createPropertyCategory,
  getAllPropertyCategories,
  getPropertyCategoryById,
  updatePropertyCategory,
  deletePropertyCategory,
  softDeletePropertyCategory
};
