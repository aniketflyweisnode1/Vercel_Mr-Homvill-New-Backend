const User_Address = require('../models/User_Address.model');
const User = require('../models/User.model');
const City = require('../models/City.model');
const State = require('../models/State.model');
const Country = require('../models/Country.model');

// Create User Address
const createUserAddress = async (req, res) => {
  try {
    const {
      user_id,
      address,
      city_id,
      state_id,
      country_id,
      location,
      Status
    } = req.body;

    // Validate that user exists
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Validate that city exists
    const city = await City.findOne({ City_id: city_id });
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    // Validate that state exists
    const state = await State.findOne({ State_id: state_id });
    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found'
      });
    }

    // Validate that country exists
    const country = await Country.findOne({ Country_id: country_id });
    if (!country) {
      return res.status(404).json({
        success: false,
        message: 'Country not found'
      });
    }

    const userAddress = new User_Address({
      user_id,
      address,
      city_id,
      state_id,
      country_id,
      location,
      Status: Status !== undefined ? Status : true,
      CreateBy: req.user.user_id,
      UpdatedBy: req.user.user_id
    });

    await userAddress.save();

    res.status(201).json({
      success: true,
      message: 'User address created successfully',
      data: userAddress
    });
  } catch (error) {
    console.error('Error creating user address:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get All User Addresses
const getAllUserAddresses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { address: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const userAddresses = await User_Address.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ CreateAt: -1 });

    // Manually populate all reference data
    for (let address of userAddresses) {
      if (address.user_id) {
        const user = await User.findOne({ user_id: address.user_id });
        address.user_id = user ? { user_id: user.user_id, Name: user.Name, last_name: user.last_name, email: user.email, phone: user.phone } : null;
      }
      if (address.city_id) {
        const city = await City.findOne({ City_id: address.city_id });
        address.city_id = city ? { City_id: city.City_id, City_name: city.City_name, Code: city.Code } : null;
      }
      if (address.state_id) {
        const state = await State.findOne({ State_id: address.state_id });
        address.state_id = state ? { State_id: state.State_id, state_name: state.state_name, Code: state.Code } : null;
      }
      if (address.country_id) {
        const country = await Country.findOne({ Country_id: address.country_id });
        address.country_id = country ? { Country_id: country.Country_id, Country_name: country.Country_name, code: country.code } : null;
      }
      if (address.CreateBy) {
        const createUser = await User.findOne({ user_id: address.CreateBy });
        address.CreateBy = createUser ? { user_id: createUser.user_id, Name: createUser.Name, last_name: createUser.last_name } : null;
      }
      if (address.UpdatedBy) {
        const updateUser = await User.findOne({ user_id: address.UpdatedBy });
        address.UpdatedBy = updateUser ? { user_id: updateUser.user_id, Name: updateUser.Name, last_name: updateUser.last_name } : null;
      }
    }

    const total = await User_Address.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'User addresses retrieved successfully',
      data: userAddresses,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error getting user addresses:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get User Address by ID
const getUserAddressById = async (req, res) => {
  try {
    const { id } = req.params;

    const userAddress = await User_Address.findOne({ Address_id: id });

    // Manually populate all reference data
    if (userAddress) {
      if (userAddress.user_id) {
        const user = await User.findOne({ user_id: userAddress.user_id });
        userAddress.user_id = user ? { user_id: user.user_id, Name: user.Name, last_name: user.last_name, email: user.email, phone: user.phone } : null;
      }
      if (userAddress.city_id) {
        const city = await City.findOne({ City_id: userAddress.city_id });
        userAddress.city_id = city ? { City_id: city.City_id, City_name: city.City_name, Code: city.Code } : null;
      }
      if (userAddress.state_id) {
        const state = await State.findOne({ State_id: userAddress.state_id });
        userAddress.state_id = state ? { State_id: state.State_id, state_name: state.state_name, Code: state.Code } : null;
      }
      if (userAddress.country_id) {
        const country = await Country.findOne({ Country_id: userAddress.country_id });
        userAddress.country_id = country ? { Country_id: country.Country_id, Country_name: country.Country_name, code: country.code } : null;
      }
      if (userAddress.CreateBy) {
        const createUser = await User.findOne({ user_id: userAddress.CreateBy });
        userAddress.CreateBy = createUser ? { user_id: createUser.user_id, Name: createUser.Name, last_name: createUser.last_name } : null;
      }
      if (userAddress.UpdatedBy) {
        const updateUser = await User.findOne({ user_id: userAddress.UpdatedBy });
        userAddress.UpdatedBy = updateUser ? { user_id: updateUser.user_id, Name: updateUser.Name, last_name: updateUser.last_name } : null;
      }
    }

    if (!userAddress) {
      return res.status(404).json({
        success: false,
        message: 'User address not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User address retrieved successfully',
      data: userAddress
    });
  } catch (error) {
    console.error('Error getting user address:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get User Addresses by Auth (Current User)
const getUserAddressesByAuth = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const userAddresses = await User_Address.find({ user_id: userId })
      .sort({ CreateAt: -1 });

    // Manually populate all reference data
    for (let address of userAddresses) {
      if (address.city_id) {
        const city = await City.findOne({ City_id: address.city_id });
        address.city_id = city ? { City_id: city.City_id, City_name: city.City_name, Code: city.Code } : null;
      }
      if (address.state_id) {
        const state = await State.findOne({ State_id: address.state_id });
        address.state_id = state ? { State_id: state.State_id, state_name: state.state_name, Code: state.Code } : null;
      }
      if (address.country_id) {
        const country = await Country.findOne({ Country_id: address.country_id });
        address.country_id = country ? { Country_id: country.Country_id, Country_name: country.Country_name, code: country.code } : null;
      }
    }

    res.status(200).json({
      success: true,
      message: 'User addresses retrieved successfully',
      data: userAddresses
    });
  } catch (error) {
    console.error('Error getting user addresses by auth:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update User Address
const updateUserAddress = async (req, res) => {
  try {
    const { Address_id, user_id, address, city_id, state_id, country_id, location, Status } = req.body;

    const userAddress = await User_Address.findOne({ Address_id });
    if (!userAddress) {
      return res.status(404).json({
        success: false,
        message: 'User address not found'
      });
    }

    // Validate that user exists if user_id is being updated
    if (user_id) {
      const user = await User.findOne({ user_id });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
    }

    // Validate that city exists if city_id is being updated
    if (city_id) {
      const city = await City.findOne({ City_id: city_id });
      if (!city) {
        return res.status(404).json({
          success: false,
          message: 'City not found'
        });
      }
    }

    // Validate that state exists if state_id is being updated
    if (state_id) {
      const state = await State.findOne({ State_id: state_id });
      if (!state) {
        return res.status(404).json({
          success: false,
          message: 'State not found'
        });
      }
    }

    // Validate that country exists if country_id is being updated
    if (country_id) {
      const country = await Country.findOne({ Country_id: country_id });
      if (!country) {
        return res.status(404).json({
          success: false,
          message: 'Country not found'
        });
      }
    }

    const updateData = {
      UpdatedBy: req.user.user_id,
      UpdatedAt: new Date()
    };

    if (user_id !== undefined) updateData.user_id = user_id;
    if (address !== undefined) updateData.address = address;
    if (city_id !== undefined) updateData.city_id = city_id;
    if (state_id !== undefined) updateData.state_id = state_id;
    if (country_id !== undefined) updateData.country_id = country_id;
    if (location !== undefined) updateData.location = location;
    if (Status !== undefined) updateData.Status = Status;

    const updatedUserAddress = await User_Address.findOneAndUpdate(
      { Address_id },
      updateData,
      { new: true }
    );

    // Manually populate all reference data
    if (updatedUserAddress) {
      if (updatedUserAddress.user_id) {
        const user = await User.findOne({ user_id: updatedUserAddress.user_id });
        updatedUserAddress.user_id = user ? { user_id: user.user_id, Name: user.Name, last_name: user.last_name, email: user.email, phone: user.phone } : null;
      }
      if (updatedUserAddress.city_id) {
        const city = await City.findOne({ City_id: updatedUserAddress.city_id });
        updatedUserAddress.city_id = city ? { City_id: city.City_id, City_name: city.City_name, Code: city.Code } : null;
      }
      if (updatedUserAddress.state_id) {
        const state = await State.findOne({ State_id: updatedUserAddress.state_id });
        updatedUserAddress.state_id = state ? { State_id: state.State_id, state_name: state.state_name, Code: state.Code } : null;
      }
      if (updatedUserAddress.country_id) {
        const country = await Country.findOne({ Country_id: updatedUserAddress.country_id });
        updatedUserAddress.country_id = country ? { Country_id: country.Country_id, Country_name: country.Country_name, code: country.code } : null;
      }
      if (updatedUserAddress.CreateBy) {
        const createUser = await User.findOne({ user_id: updatedUserAddress.CreateBy });
        updatedUserAddress.CreateBy = createUser ? { user_id: createUser.user_id, Name: createUser.Name, last_name: createUser.last_name } : null;
      }
      if (updatedUserAddress.UpdatedBy) {
        const updateUser = await User.findOne({ user_id: updatedUserAddress.UpdatedBy });
        updatedUserAddress.UpdatedBy = updateUser ? { user_id: updateUser.user_id, Name: updateUser.Name, last_name: updateUser.last_name } : null;
      }
    }

    res.status(200).json({
      success: true,
      message: 'User address updated successfully',
      data: updatedUserAddress
    });
  } catch (error) {
    console.error('Error updating user address:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete User Address (Hard Delete)
const deleteUserAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const userAddress = await User_Address.findOneAndDelete({ Address_id: id });
    if (!userAddress) {
      return res.status(404).json({
        success: false,
        message: 'User address not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User address deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user address:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Soft Delete User Address (Deactivate)
const softDeleteUserAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const userAddress = await User_Address.findOneAndUpdate(
      { Address_id: id },
      { 
        Status: false,
        UpdatedBy: req.user.user_id,
        UpdatedAt: new Date()
      },
      { new: true }
    );

    if (!userAddress) {
      return res.status(404).json({
        success: false,
        message: 'User address not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User address deactivated successfully',
      data: userAddress
    });
  } catch (error) {
    console.error('Error deactivating user address:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createUserAddress,
  getAllUserAddresses,
  getUserAddressById,
  getUserAddressesByAuth,
  updateUserAddress,
  deleteUserAddress,
  softDeleteUserAddress
};
