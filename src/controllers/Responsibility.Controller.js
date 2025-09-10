const Responsibility = require('../models/Responsibility.model');
const User = require('../models/User.model');

// Create Responsibility
const createResponsibility = async (req, res) => {
  try {
    const { Responsibility_name, description } = req.body;

    // Check if responsibility already exists
    const existingResponsibility = await Responsibility.findOne({ 
      Responsibility_name: Responsibility_name 
    });
    
    if (existingResponsibility) {
      return res.status(400).json({
        success: false,
        message: 'Responsibility with this name already exists'
      });
    }

    const responsibility = new Responsibility({
      Responsibility_name,
      description,
      CreateBy: req.user?.user_id || null
    });

    const savedResponsibility = await responsibility.save();
    
    // Fetch creator information
    const createByUser = savedResponsibility.CreateBy ? 
      await User.findOne({ user_id: savedResponsibility.CreateBy }) : null;

    const response = savedResponsibility.toObject();
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
    } : null;
    
    res.status(201).json({
      success: true,
      message: 'Responsibility created successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating responsibility',
      error: error.message
    });
  }
};

// Get All Responsibilities
const getAllResponsibilities = async (req, res) => {
  try {
    const responsibilities = await Responsibility.find({ Status: true })
      .sort({ CreateAt: -1 });

    const responsibilitiesResponse = await Promise.all(responsibilities.map(async (responsibility) => {
      const createByUser = responsibility.CreateBy ? 
        await User.findOne({ user_id: responsibility.CreateBy }) : null;

      const respObj = responsibility.toObject();
      respObj.CreateBy = createByUser ? { 
        user_id: createByUser.user_id, 
        Name: createByUser.Name, 
        email: createByUser.email 
      } : null;
      return respObj;
    }));

    res.status(200).json({
      success: true,
      count: responsibilitiesResponse.length,
      data: responsibilitiesResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching responsibilities',
      error: error.message
    });
  }
};

// Get Responsibility by ID
const getResponsibilityById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const responsibility = await Responsibility.findOne({ 
      Responsibility_id: parseInt(id) 
    });
    
    if (!responsibility) {
      return res.status(404).json({
        success: false,
        message: 'Responsibility not found'
      });
    }

    const createByUser = responsibility.CreateBy ? 
      await User.findOne({ user_id: responsibility.CreateBy }) : null;
    const updatedByUser = responsibility.UpdatedBy ? 
      await User.findOne({ user_id: responsibility.UpdatedBy }) : null;

    const response = responsibility.toObject();
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
      message: 'Error fetching responsibility',
      error: error.message
    });
  }
};

// Update Responsibility
const updateResponsibility = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const userId = req.user.user_id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Responsibility ID is required in request body'
      });
    }

    const responsibility = await Responsibility.findOne({ 
      Responsibility_id: parseInt(id) 
    });
    
    if (!responsibility) {
      return res.status(404).json({
        success: false,
        message: 'Responsibility not found'
      });
    }

    // Check if name is being updated and if it already exists
    if (updateData.Responsibility_name && updateData.Responsibility_name !== responsibility.Responsibility_name) {
      const existingResponsibility = await Responsibility.findOne({ 
        Responsibility_name: updateData.Responsibility_name,
        Responsibility_id: { $ne: parseInt(id) }
      });
      
      if (existingResponsibility) {
        return res.status(400).json({
          success: false,
          message: 'Responsibility with this name already exists'
        });
      }
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key !== 'Responsibility_id') {
        responsibility[key] = updateData[key];
      }
    });

    responsibility.UpdatedBy = userId;
    responsibility.UpdatedAt = new Date();

    const updatedResponsibility = await responsibility.save();
    
    const createByUser = updatedResponsibility.CreateBy ? 
      await User.findOne({ user_id: updatedResponsibility.CreateBy }) : null;
    const updatedByUser = updatedResponsibility.UpdatedBy ? 
      await User.findOne({ user_id: updatedResponsibility.UpdatedBy }) : null;

    const response = updatedResponsibility.toObject();
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
      message: 'Responsibility updated successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating responsibility',
      error: error.message
    });
  }
};

// Delete Responsibility (hard delete)
const deleteResponsibility = async (req, res) => {
  try {
    const { id } = req.params;

    const responsibility = await Responsibility.findOne({ 
      Responsibility_id: parseInt(id) 
    });
    
    if (!responsibility) {
      return res.status(404).json({
        success: false,
        message: 'Responsibility not found'
      });
    }

    await Responsibility.findOneAndDelete({ 
      Responsibility_id: parseInt(id) 
    });

    res.status(200).json({
      success: true,
      message: 'Responsibility deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting responsibility',
      error: error.message
    });
  }
};

// Soft Delete Responsibility (deactivate)
const softDeleteResponsibility = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const responsibility = await Responsibility.findOne({ 
      Responsibility_id: parseInt(id) 
    });
    
    if (!responsibility) {
      return res.status(404).json({
        success: false,
        message: 'Responsibility not found'
      });
    }

    responsibility.Status = false;
    responsibility.UpdatedBy = userId;
    responsibility.UpdatedAt = new Date();
    await responsibility.save();

    res.status(200).json({
      success: true,
      message: 'Responsibility deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating responsibility',
      error: error.message
    });
  }
};

module.exports = {
  createResponsibility,
  getAllResponsibilities,
  getResponsibilityById,
  updateResponsibility,
  deleteResponsibility,
  softDeleteResponsibility
};
