const Properties_Status = require('../models/Properties_Status.model');
const User = require('../models/User.model');

// Create Properties Status
const createPropertiesStatus = async (req, res) => {
  try {
    const { Pro_Status } = req.body;

    // Check if properties status already exists
    const existingStatus = await Properties_Status.findOne({ 
      Pro_Status: Pro_Status,
      Status: true
    });
    
    if (existingStatus) {
      return res.status(400).json({
        success: false,
        message: 'Properties status with this Pro_Status already exists'
      });
    }

    const propertiesStatus = new Properties_Status({
      Pro_Status: Pro_Status,
      CreateBy: req.user?.user_id || null
    });

    const savedStatus = await propertiesStatus.save();
    
    // Fetch related data
    const createByUser = savedStatus.CreateBy ? 
      await User.findOne({ user_id: savedStatus.CreateBy }) : null;

    const response = savedStatus.toObject();
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
    } : null;
    
    res.status(201).json({
      success: true,
      message: 'Properties status created successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating properties status',
      error: error.message
    });
  }
};

// Get All Properties Status
const getAllPropertiesStatus = async (req, res) => {
  try {
    const statuses = await Properties_Status.find({ Status: true })
      .sort({ CreateAt: -1 });

    const statusesResponse = await Promise.all(statuses.map(async (status) => {
      const [createByUser, updatedByUser] = await Promise.all([
        status.CreateBy ? User.findOne({ user_id: status.CreateBy }) : null,
        status.UpdatedBy ? User.findOne({ user_id: status.UpdatedBy }) : null
      ]);

      const statusObj = status.toObject();
      statusObj.CreateBy = createByUser ? { 
        user_id: createByUser.user_id, 
        Name: createByUser.Name, 
        email: createByUser.email 
      } : null;
      statusObj.UpdatedBy = updatedByUser ? { 
        user_id: updatedByUser.user_id, 
        Name: updatedByUser.Name, 
        email: updatedByUser.email 
      } : null;
      return statusObj;
    }));

    res.status(200).json({
      success: true,
      count: statusesResponse.length,
      data: statusesResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching properties statuses',
      error: error.message
    });
  }
};

// Get Properties Status by ID
const getPropertiesStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const status = await Properties_Status.findOne({ 
      Properties_Status_id: parseInt(id) 
    });
    
    if (!status) {
      return res.status(404).json({
        success: false,
        message: 'Properties status not found'
      });
    }

    const [createByUser, updatedByUser] = await Promise.all([
      status.CreateBy ? User.findOne({ user_id: status.CreateBy }) : null,
      status.UpdatedBy ? User.findOne({ user_id: status.UpdatedBy }) : null
    ]);

    const response = status.toObject();
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
      message: 'Error fetching properties status',
      error: error.message
    });
  }
};

// Get Properties Status by Auth (for authenticated user)
const getPropertiesStatusByAuth = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const statuses = await Properties_Status.find({ 
      Status: true,
      CreateBy: userId 
    }).sort({ CreateAt: -1 });

    const statusesResponse = await Promise.all(statuses.map(async (status) => {
      const [createByUser, updatedByUser] = await Promise.all([
        status.CreateBy ? User.findOne({ user_id: status.CreateBy }) : null,
        status.UpdatedBy ? User.findOne({ user_id: status.UpdatedBy }) : null
      ]);

      const statusObj = status.toObject();
      statusObj.CreateBy = createByUser ? { 
        user_id: createByUser.user_id, 
        Name: createByUser.Name, 
        email: createByUser.email 
      } : null;
      statusObj.UpdatedBy = updatedByUser ? { 
        user_id: updatedByUser.user_id, 
        Name: updatedByUser.Name, 
        email: updatedByUser.email 
      } : null;
      return statusObj;
    }));

    res.status(200).json({
      success: true,
      count: statusesResponse.length,
      data: statusesResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching properties statuses for user',
      error: error.message
    });
  }
};

// Update Properties Status
const updatePropertiesStatus = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const userId = req.user.user_id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Properties status ID is required in request body'
      });
    }

    const status = await Properties_Status.findOne({ 
      Properties_Status_id: parseInt(id) 
    });
    
    if (!status) {
      return res.status(404).json({
        success: false,
        message: 'Properties status not found'
      });
    }

    // Check if Pro_Status is being updated and if it already exists
    if (updateData.Pro_Status) {
      const existingStatus = await Properties_Status.findOne({ 
        Pro_Status: updateData.Pro_Status,
        Properties_Status_id: { $ne: parseInt(id) },
        Status: true
      });
      
      if (existingStatus) {
        return res.status(400).json({
          success: false,
          message: 'Properties status with this Pro_Status already exists'
        });
      }
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key !== 'Properties_Status_id') {
        status[key] = updateData[key];
      }
    });

    status.UpdatedBy = userId;
    status.UpdatedAt = new Date();

    const updatedStatus = await status.save();
    
    const [createByUser, updatedByUser] = await Promise.all([
      updatedStatus.CreateBy ? User.findOne({ user_id: updatedStatus.CreateBy }) : null,
      updatedStatus.UpdatedBy ? User.findOne({ user_id: updatedStatus.UpdatedBy }) : null
    ]);

    const response = updatedStatus.toObject();
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
      message: 'Properties status updated successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating properties status',
      error: error.message
    });
  }
};

// Delete Properties Status (hard delete)
const deletePropertiesStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const status = await Properties_Status.findOne({ 
      Properties_Status_id: parseInt(id) 
    });
    
    if (!status) {
      return res.status(404).json({
        success: false,
        message: 'Properties status not found'
      });
    }

    await Properties_Status.findOneAndDelete({ 
      Properties_Status_id: parseInt(id) 
    });

    res.status(200).json({
      success: true,
      message: 'Properties status deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting properties status',
      error: error.message
    });
  }
};

// Soft Delete Properties Status (deactivate)
const softDeletePropertiesStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const status = await Properties_Status.findOne({ 
      Properties_Status_id: parseInt(id) 
    });
    
    if (!status) {
      return res.status(404).json({
        success: false,
        message: 'Properties status not found'
      });
    }

    status.Status = false;
    status.UpdatedBy = userId;
    status.UpdatedAt = new Date();
    await status.save();

    res.status(200).json({
      success: true,
      message: 'Properties status deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating properties status',
      error: error.message
    });
  }
};

module.exports = {
  createPropertiesStatus,
  getAllPropertiesStatus,
  getPropertiesStatusById,
  getPropertiesStatusByAuth,
  updatePropertiesStatus,
  deletePropertiesStatus,
  softDeletePropertiesStatus
};
