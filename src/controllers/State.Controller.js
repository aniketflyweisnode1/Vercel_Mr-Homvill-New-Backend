const State = require('../models/State.model');
const Country = require('../models/Country.model');
const User = require('../models/User.model');

// Create State
const createState = async (req, res) => {
  try {
    const { state_name, Code, Country_id } = req.body;

    // Check if country exists
    const country = await Country.findOne({ Country_id: parseInt(Country_id) });
    if (!country) {
      return res.status(400).json({
        success: false,
        message: 'Country not found'
      });
    }

    // Check if state already exists in the same country
    const existingState = await State.findOne({ 
      state_name: state_name,
      Country_id: parseInt(Country_id)
    });
    
    if (existingState) {
      return res.status(400).json({
        success: false,
        message: 'State with this name already exists in the selected country'
      });
    }

    const state = new State({
      state_name,
      Code: Code.toUpperCase(),
      Country_id: parseInt(Country_id),
      CreateBy: req.user?.user_id || null
    });

    const savedState = await state.save();
    
    // Fetch related data
    const [countryData, createByUser] = await Promise.all([
      Country.findOne({ Country_id: savedState.Country_id }),
      savedState.CreateBy ? User.findOne({ user_id: savedState.CreateBy }) : null
    ]);

    const response = savedState.toObject();
    response.Country_id = countryData ? { 
      Country_id: countryData.Country_id, 
      Country_name: countryData.Country_name, 
      code: countryData.code 
    } : null;
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
    } : null;
    
    res.status(201).json({
      success: true,
      message: 'State created successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating state',
      error: error.message
    });
  }
};

// Get All States
const getAllStates = async (req, res) => {
  try {
    const states = await State.find({ Status: true })
      .sort({ CreateAt: -1 });

    const statesResponse = await Promise.all(states.map(async (state) => {
      const [countryData, createByUser] = await Promise.all([
        Country.findOne({ Country_id: state.Country_id }),
        state.CreateBy ? User.findOne({ user_id: state.CreateBy }) : null
      ]);

      const stateObj = state.toObject();
      stateObj.Country_id = countryData ? { 
        Country_id: countryData.Country_id, 
        Country_name: countryData.Country_name, 
        code: countryData.code 
      } : null;
      stateObj.CreateBy = createByUser ? { 
        user_id: createByUser.user_id, 
        Name: createByUser.Name, 
        email: createByUser.email 
      } : null;
      return stateObj;
    }));

    res.status(200).json({
      success: true,
      count: statesResponse.length,
      data: statesResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching states',
      error: error.message
    });
  }
};

// Get States by Country ID
const getStatesByCountryId = async (req, res) => {
  try {
    const { countryId } = req.params;
    
    const states = await State.find({ 
      Country_id: parseInt(countryId),
      Status: true 
    }).sort({ state_name: 1 });

    const statesResponse = await Promise.all(states.map(async (state) => {
      const [countryData, createByUser] = await Promise.all([
        Country.findOne({ Country_id: state.Country_id }),
        state.CreateBy ? User.findOne({ user_id: state.CreateBy }) : null
      ]);

      const stateObj = state.toObject();
      stateObj.Country_id = countryData ? { 
        Country_id: countryData.Country_id, 
        Country_name: countryData.Country_name, 
        code: countryData.code 
      } : null;
      stateObj.CreateBy = createByUser ? { 
        user_id: createByUser.user_id, 
        Name: createByUser.Name, 
        email: createByUser.email 
      } : null;
      return stateObj;
    }));

    res.status(200).json({
      success: true,
      count: statesResponse.length,
      data: statesResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching states by country',
      error: error.message
    });
  }
};

// Get State by ID
const getStateById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const state = await State.findOne({ 
      State_id: parseInt(id) 
    });
    
    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found'
      });
    }

    const [countryData, createByUser, updatedByUser] = await Promise.all([
      Country.findOne({ Country_id: state.Country_id }),
      state.CreateBy ? User.findOne({ user_id: state.CreateBy }) : null,
      state.UpdatedBy ? User.findOne({ user_id: state.UpdatedBy }) : null
    ]);

    const response = state.toObject();
    response.Country_id = countryData ? { 
      Country_id: countryData.Country_id, 
      Country_name: countryData.Country_name, 
      code: countryData.code 
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
      message: 'Error fetching state',
      error: error.message
    });
  }
};

// Update State
const updateState = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const userId = req.user.user_id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'State ID is required in request body'
      });
    }

    const state = await State.findOne({ 
      State_id: parseInt(id) 
    });
    
    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found'
      });
    }

    // Check if country is being updated and if it exists
    if (updateData.Country_id) {
      const country = await Country.findOne({ Country_id: parseInt(updateData.Country_id) });
      if (!country) {
        return res.status(400).json({
          success: false,
          message: 'Country not found'
        });
      }
    }

    // Check if name is being updated and if it already exists in the same country
    if (updateData.state_name) {
      const existingState = await State.findOne({ 
        state_name: updateData.state_name,
        Country_id: updateData.Country_id || state.Country_id,
        State_id: { $ne: parseInt(id) }
      });
      
      if (existingState) {
        return res.status(400).json({
          success: false,
          message: 'State with this name already exists in the selected country'
        });
      }
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key !== 'State_id') {
        if (key === 'Code') {
          state[key] = updateData[key].toUpperCase();
        } else if (key === 'Country_id') {
          state[key] = parseInt(updateData[key]);
        } else {
          state[key] = updateData[key];
        }
      }
    });

    state.UpdatedBy = userId;
    state.UpdatedAt = new Date();

    const updatedState = await state.save();
    
    const [countryData, createByUser, updatedByUser] = await Promise.all([
      Country.findOne({ Country_id: updatedState.Country_id }),
      updatedState.CreateBy ? User.findOne({ user_id: updatedState.CreateBy }) : null,
      updatedState.UpdatedBy ? User.findOne({ user_id: updatedState.UpdatedBy }) : null
    ]);

    const response = updatedState.toObject();
    response.Country_id = countryData ? { 
      Country_id: countryData.Country_id, 
      Country_name: countryData.Country_name, 
      code: countryData.code 
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
      message: 'State updated successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating state',
      error: error.message
    });
  }
};

// Delete State (hard delete)
const deleteState = async (req, res) => {
  try {
    const { id } = req.params;

    const state = await State.findOne({ 
      State_id: parseInt(id) 
    });
    
    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found'
      });
    }

    await State.findOneAndDelete({ 
      State_id: parseInt(id) 
    });

    res.status(200).json({
      success: true,
      message: 'State deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting state',
      error: error.message
    });
  }
};

// Soft Delete State (deactivate)
const softDeleteState = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const state = await State.findOne({ 
      State_id: parseInt(id) 
    });
    
    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found'
      });
    }

    state.Status = false;
    state.UpdatedBy = userId;
    state.UpdatedAt = new Date();
    await state.save();

    res.status(200).json({
      success: true,
      message: 'State deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating state',
      error: error.message
    });
  }
};

module.exports = {
  createState,
  getAllStates,
  getStatesByCountryId,
  getStateById,
  updateState,
  deleteState,
  softDeleteState
};
