const Country = require('../models/Country.model');
const User = require('../models/User.model');

// Create Country
const createCountry = async (req, res) => {
  try {
    const { Country_name, code, phone_code, currency } = req.body;

    // Check if country already exists
    const existingCountry = await Country.findOne({ 
      $or: [
        { Country_name: Country_name },
        { code: code }
      ]
    });
    
    if (existingCountry) {
      return res.status(400).json({
        success: false,
        message: 'Country with this name or code already exists'
      });
    }

    const country = new Country({
      Country_name,
      code: code.toUpperCase(),
      phone_code,
      currency,
      CreateBy: req.user?.user_id || null
    });

    const savedCountry = await country.save();
    
    // Fetch creator information
    const createByUser = savedCountry.CreateBy ? 
      await User.findOne({ user_id: savedCountry.CreateBy }) : null;

    const response = savedCountry.toObject();
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
    } : null;
    
    res.status(201).json({
      success: true,
      message: 'Country created successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating country',
      error: error.message
    });
  }
};

// Get All Countries
const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find({ Status: true })
      .sort({ CreateAt: -1 });

    const countriesResponse = await Promise.all(countries.map(async (country) => {
      const createByUser = country.CreateBy ? 
        await User.findOne({ user_id: country.CreateBy }) : null;

      const countryObj = country.toObject();
      countryObj.CreateBy = createByUser ? { 
        user_id: createByUser.user_id, 
        Name: createByUser.Name, 
        email: createByUser.email 
      } : null;
      return countryObj;
    }));

    res.status(200).json({
      success: true,
      count: countriesResponse.length,
      data: countriesResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching countries',
      error: error.message
    });
  }
};

// Get Country by ID
const getCountryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const country = await Country.findOne({ 
      Country_id: parseInt(id) 
    });
    
    if (!country) {
      return res.status(404).json({
        success: false,
        message: 'Country not found'
      });
    }

    const createByUser = country.CreateBy ? 
      await User.findOne({ user_id: country.CreateBy }) : null;
    const updatedByUser = country.UpdatedBy ? 
      await User.findOne({ user_id: country.UpdatedBy }) : null;

    const response = country.toObject();
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
      message: 'Error fetching country',
      error: error.message
    });
  }
};

// Update Country
const updateCountry = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const userId = req.user.user_id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Country ID is required in request body'
      });
    }

    const country = await Country.findOne({ 
      Country_id: parseInt(id) 
    });
    
    if (!country) {
      return res.status(404).json({
        success: false,
        message: 'Country not found'
      });
    }

    // Check if name or code is being updated and if it already exists
    if (updateData.Country_name || updateData.code) {
      const existingCountry = await Country.findOne({ 
        $or: [
          { Country_name: updateData.Country_name },
          { code: updateData.code }
        ],
        Country_id: { $ne: parseInt(id) }
      });
      
      if (existingCountry) {
        return res.status(400).json({
          success: false,
          message: 'Country with this name or code already exists'
        });
      }
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key !== 'Country_id') {
        if (key === 'code') {
          country[key] = updateData[key].toUpperCase();
        } else {
          country[key] = updateData[key];
        }
      }
    });

    country.UpdatedBy = userId;
    country.UpdatedAt = new Date();

    const updatedCountry = await country.save();
    
    const createByUser = updatedCountry.CreateBy ? 
      await User.findOne({ user_id: updatedCountry.CreateBy }) : null;
    const updatedByUser = updatedCountry.UpdatedBy ? 
      await User.findOne({ user_id: updatedCountry.UpdatedBy }) : null;

    const response = updatedCountry.toObject();
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
      message: 'Country updated successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating country',
      error: error.message
    });
  }
};

// Delete Country (hard delete)
const deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;

    const country = await Country.findOne({ 
      Country_id: parseInt(id) 
    });
    
    if (!country) {
      return res.status(404).json({
        success: false,
        message: 'Country not found'
      });
    }

    await Country.findOneAndDelete({ 
      Country_id: parseInt(id) 
    });

    res.status(200).json({
      success: true,
      message: 'Country deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting country',
      error: error.message
    });
  }
};

// Soft Delete Country (deactivate)
const softDeleteCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const country = await Country.findOne({ 
      Country_id: parseInt(id) 
    });
    
    if (!country) {
      return res.status(404).json({
        success: false,
        message: 'Country not found'
      });
    }

    country.Status = false;
    country.UpdatedBy = userId;
    country.UpdatedAt = new Date();
    await country.save();

    res.status(200).json({
      success: true,
      message: 'Country deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating country',
      error: error.message
    });
  }
};

module.exports = {
  createCountry,
  getAllCountries,
  getCountryById,
  updateCountry,
  deleteCountry,
  softDeleteCountry
};
