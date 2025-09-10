const City = require('../models/City.model');
const State = require('../models/State.model');
const Country = require('../models/Country.model');
const User = require('../models/User.model');

// Create City
const createCity = async (req, res) => {
  try {
    const { City_name, Code, State_id, Country_id } = req.body;

    // Check if state and country exist
    const [state, country] = await Promise.all([
      State.findOne({ State_id: parseInt(State_id) }),
      Country.findOne({ Country_id: parseInt(Country_id) })
    ]);

    if (!state) {
      return res.status(400).json({
        success: false,
        message: 'State not found'
      });
    }

    if (!country) {
      return res.status(400).json({
        success: false,
        message: 'Country not found'
      });
    }

    // Check if city already exists in the same state
    const existingCity = await City.findOne({ 
      City_name: City_name,
      State_id: parseInt(State_id)
    });
    
    if (existingCity) {
      return res.status(400).json({
        success: false,
        message: 'City with this name already exists in the selected state'
      });
    }

    const city = new City({
      City_name,
      Code: Code.toUpperCase(),
      State_id: parseInt(State_id),
      Country_id: parseInt(Country_id),
      CreateBy: req.user?.user_id || null
    });

    const savedCity = await city.save();
    
    // Fetch related data
    const [stateData, countryData, createByUser] = await Promise.all([
      State.findOne({ State_id: savedCity.State_id }),
      Country.findOne({ Country_id: savedCity.Country_id }),
      savedCity.CreateBy ? User.findOne({ user_id: savedCity.CreateBy }) : null
    ]);

    const response = savedCity.toObject();
    response.State_id = stateData ? { 
      State_id: stateData.State_id, 
      state_name: stateData.state_name, 
      Code: stateData.Code 
    } : null;
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
      message: 'City created successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating city',
      error: error.message
    });
  }
};

// Get All Cities
const getAllCities = async (req, res) => {
  try {
    const cities = await City.find({ Status: true })
      .sort({ CreateAt: -1 });

    const citiesResponse = await Promise.all(cities.map(async (city) => {
      const [stateData, countryData, createByUser] = await Promise.all([
        State.findOne({ State_id: city.State_id }),
        Country.findOne({ Country_id: city.Country_id }),
        city.CreateBy ? User.findOne({ user_id: city.CreateBy }) : null
      ]);

      const cityObj = city.toObject();
      cityObj.State_id = stateData ? { 
        State_id: stateData.State_id, 
        state_name: stateData.state_name, 
        Code: stateData.Code 
      } : null;
      cityObj.Country_id = countryData ? { 
        Country_id: countryData.Country_id, 
        Country_name: countryData.Country_name, 
        code: countryData.code 
      } : null;
      cityObj.CreateBy = createByUser ? { 
        user_id: createByUser.user_id, 
        Name: createByUser.Name, 
        email: createByUser.email 
      } : null;
      return cityObj;
    }));

    res.status(200).json({
      success: true,
      count: citiesResponse.length,
      data: citiesResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cities',
      error: error.message
    });
  }
};

// Get Cities by State ID
const getCitiesByStateId = async (req, res) => {
  try {
    const { stateId } = req.params;
    
    const cities = await City.find({ 
      State_id: parseInt(stateId),
      Status: true 
    }).sort({ City_name: 1 });

    const citiesResponse = await Promise.all(cities.map(async (city) => {
      const [stateData, countryData, createByUser] = await Promise.all([
        State.findOne({ State_id: city.State_id }),
        Country.findOne({ Country_id: city.Country_id }),
        city.CreateBy ? User.findOne({ user_id: city.CreateBy }) : null
      ]);

      const cityObj = city.toObject();
      cityObj.State_id = stateData ? { 
        State_id: stateData.State_id, 
        state_name: stateData.state_name, 
        Code: stateData.Code 
      } : null;
      cityObj.Country_id = countryData ? { 
        Country_id: countryData.Country_id, 
        Country_name: countryData.Country_name, 
        code: countryData.code 
      } : null;
      cityObj.CreateBy = createByUser ? { 
        user_id: createByUser.user_id, 
        Name: createByUser.Name, 
        email: createByUser.email 
      } : null;
      return cityObj;
    }));

    res.status(200).json({
      success: true,
      count: citiesResponse.length,
      data: citiesResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cities by state',
      error: error.message
    });
  }
};

// Get Cities by Country ID
const getCitiesByCountryId = async (req, res) => {
  try {
    const { countryId } = req.params;
    
    const cities = await City.find({ 
      Country_id: parseInt(countryId),
      Status: true 
    }).sort({ City_name: 1 });

    const citiesResponse = await Promise.all(cities.map(async (city) => {
      const [stateData, countryData, createByUser] = await Promise.all([
        State.findOne({ State_id: city.State_id }),
        Country.findOne({ Country_id: city.Country_id }),
        city.CreateBy ? User.findOne({ user_id: city.CreateBy }) : null
      ]);

      const cityObj = city.toObject();
      cityObj.State_id = stateData ? { 
        State_id: stateData.State_id, 
        state_name: stateData.state_name, 
        Code: stateData.Code 
      } : null;
      cityObj.Country_id = countryData ? { 
        Country_id: countryData.Country_id, 
        Country_name: countryData.Country_name, 
        code: countryData.code 
      } : null;
      cityObj.CreateBy = createByUser ? { 
        user_id: createByUser.user_id, 
        Name: createByUser.Name, 
        email: createByUser.email 
      } : null;
      return cityObj;
    }));

    res.status(200).json({
      success: true,
      count: citiesResponse.length,
      data: citiesResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cities by country',
      error: error.message
    });
  }
};

// Get City by ID
const getCityById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const city = await City.findOne({ 
      City_id: parseInt(id) 
    });
    
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    const [stateData, countryData, createByUser, updatedByUser] = await Promise.all([
      State.findOne({ State_id: city.State_id }),
      Country.findOne({ Country_id: city.Country_id }),
      city.CreateBy ? User.findOne({ user_id: city.CreateBy }) : null,
      city.UpdatedBy ? User.findOne({ user_id: city.UpdatedBy }) : null
    ]);

    const response = city.toObject();
    response.State_id = stateData ? { 
      State_id: stateData.State_id, 
      state_name: stateData.state_name, 
      Code: stateData.Code 
    } : null;
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
      message: 'Error fetching city',
      error: error.message
    });
  }
};

// Update City
const updateCity = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const userId = req.user.user_id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'City ID is required in request body'
      });
    }

    const city = await City.findOne({ 
      City_id: parseInt(id) 
    });
    
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    // Check if state and country are being updated and if they exist
    if (updateData.State_id) {
      const state = await State.findOne({ State_id: parseInt(updateData.State_id) });
      if (!state) {
        return res.status(400).json({
          success: false,
          message: 'State not found'
        });
      }
    }

    if (updateData.Country_id) {
      const country = await Country.findOne({ Country_id: parseInt(updateData.Country_id) });
      if (!country) {
        return res.status(400).json({
          success: false,
          message: 'Country not found'
        });
      }
    }

    // Check if name is being updated and if it already exists in the same state
    if (updateData.City_name) {
      const existingCity = await City.findOne({ 
        City_name: updateData.City_name,
        State_id: updateData.State_id || city.State_id,
        City_id: { $ne: parseInt(id) }
      });
      
      if (existingCity) {
        return res.status(400).json({
          success: false,
          message: 'City with this name already exists in the selected state'
        });
      }
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key !== 'City_id') {
        if (key === 'Code') {
          city[key] = updateData[key].toUpperCase();
        } else if (key === 'State_id' || key === 'Country_id') {
          city[key] = parseInt(updateData[key]);
        } else {
          city[key] = updateData[key];
        }
      }
    });

    city.UpdatedBy = userId;
    city.UpdatedAt = new Date();

    const updatedCity = await city.save();
    
    const [stateData, countryData, createByUser, updatedByUser] = await Promise.all([
      State.findOne({ State_id: updatedCity.State_id }),
      Country.findOne({ Country_id: updatedCity.Country_id }),
      updatedCity.CreateBy ? User.findOne({ user_id: updatedCity.CreateBy }) : null,
      updatedCity.UpdatedBy ? User.findOne({ user_id: updatedCity.UpdatedBy }) : null
    ]);

    const response = updatedCity.toObject();
    response.State_id = stateData ? { 
      State_id: stateData.State_id, 
      state_name: stateData.state_name, 
      Code: stateData.Code 
    } : null;
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
      message: 'City updated successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating city',
      error: error.message
    });
  }
};

// Delete City (hard delete)
const deleteCity = async (req, res) => {
  try {
    const { id } = req.params;

    const city = await City.findOne({ 
      City_id: parseInt(id) 
    });
    
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    await City.findOneAndDelete({ 
      City_id: parseInt(id) 
    });

    res.status(200).json({
      success: true,
      message: 'City deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting city',
      error: error.message
    });
  }
};

// Soft Delete City (deactivate)
const softDeleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const city = await City.findOne({ 
      City_id: parseInt(id) 
    });
    
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    city.Status = false;
    city.UpdatedBy = userId;
    city.UpdatedAt = new Date();
    await city.save();

    res.status(200).json({
      success: true,
      message: 'City deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating city',
      error: error.message
    });
  }
};

module.exports = {
  createCity,
  getAllCities,
  getCitiesByStateId,
  getCitiesByCountryId,
  getCityById,
  updateCity,
  deleteCity,
  softDeleteCity
};
