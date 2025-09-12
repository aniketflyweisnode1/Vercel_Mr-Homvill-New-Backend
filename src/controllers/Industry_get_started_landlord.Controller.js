const Industry_get_started_landlord = require('../models/Industry_get_started_landlord.model');
const User = require('../models/User.model');

// Create Industry_get_started_landlord (auth)
const createIndustryGetStartedLandlord = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      first_name,
      last_name,
      email,
      Phone,
      wantTosell,
      ReasonSelling,
      HomeFacts_year_build,
      HomeFacts_lotSize,
      HomeFacts_Finished,
      HomeFacts_BedRooms,
      HomeFacts_fullBaths,
      HomeFacts_onetwo_baths,
      Home_features_Appliances,
      Home_features_Floors,
      Home_features_Others,
      Home_features_Parking,
      Home_features_Rooms,
      Home_features_Tagging,
      improvements,
      listingPrice,
      Description,
      photos,
      video_link,
      work_with_buyer_agent,
      refund,
      work_with_a_buyer_agent,
      addPercentage,
      buyer_credit_Refund,
      openHouse_startDate,
      openHouse_endDate,
      openHouse_SetTime,
      user_id
    } = req.body;

    const industryGetStartedLandlord = new Industry_get_started_landlord({
      first_name,
      last_name,
      email,
      Phone,
      wantTosell,
      ReasonSelling,
      HomeFacts_year_build,
      HomeFacts_lotSize,
      HomeFacts_Finished,
      HomeFacts_BedRooms,
      HomeFacts_fullBaths,
      HomeFacts_onetwo_baths,
      Home_features_Appliances,
      Home_features_Floors,
      Home_features_Others,
      Home_features_Parking,
      Home_features_Rooms,
      Home_features_Tagging,
      improvements,
      listingPrice,
      Description,
      photos,
      video_link,
      work_with_buyer_agent,
      refund,
      work_with_a_buyer_agent,
      addPercentage,
      buyer_credit_Refund,
      openHouse_startDate,
      openHouse_endDate,
      openHouse_SetTime,
      user_id: parseInt(user_id),
      CreateBy: userId
    });

    const saved = await industryGetStartedLandlord.save();

    const [createByUser, mappedUser] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null,
      saved.user_id ? User.findOne({ user_id: saved.user_id }) : null
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;

    res.status(201).json({ success: true, message: 'Industry get started landlord created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating industry get started landlord', error: error.message });
  }
};

// Get all (public)
const getAllIndustryGetStartedLandlords = async (req, res) => {
  try {
    const industryGetStartedLandlords = await Industry_get_started_landlord.find({ Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(industryGetStartedLandlords.map(async (industryGetStartedLandlord) => {
      const [createByUser, updatedByUser, mappedUser] = await Promise.all([
        industryGetStartedLandlord.CreateBy ? User.findOne({ user_id: industryGetStartedLandlord.CreateBy }) : null,
        industryGetStartedLandlord.UpdatedBy ? User.findOne({ user_id: industryGetStartedLandlord.UpdatedBy }) : null,
        industryGetStartedLandlord.user_id ? User.findOne({ user_id: industryGetStartedLandlord.user_id }) : null
      ]);
      const obj = industryGetStartedLandlord.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching industry get started landlords', error: error.message });
  }
};

// Get by id (auth)
const getIndustryGetStartedLandlordById = async (req, res) => {
  try {
    const { id } = req.params;
    const industryGetStartedLandlord = await Industry_get_started_landlord.findOne({ Industry_get_started_landlord_id: parseInt(id) });
    if (!industryGetStartedLandlord) {
      return res.status(404).json({ success: false, message: 'Industry get started landlord not found' });
    }
    const [createByUser, updatedByUser, mappedUser] = await Promise.all([
      industryGetStartedLandlord.CreateBy ? User.findOne({ user_id: industryGetStartedLandlord.CreateBy }) : null,
      industryGetStartedLandlord.UpdatedBy ? User.findOne({ user_id: industryGetStartedLandlord.UpdatedBy }) : null,
      industryGetStartedLandlord.user_id ? User.findOne({ user_id: industryGetStartedLandlord.user_id }) : null
    ]);
    const response = industryGetStartedLandlord.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching industry get started landlord', error: error.message });
  }
};

// Get by auth user (auth)
const getIndustryGetStartedLandlordsByAuth = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const industryGetStartedLandlords = await Industry_get_started_landlord.find({ user_id: userId, Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(industryGetStartedLandlords.map(async (industryGetStartedLandlord) => {
      const [createByUser, updatedByUser, mappedUser] = await Promise.all([
        industryGetStartedLandlord.CreateBy ? User.findOne({ user_id: industryGetStartedLandlord.CreateBy }) : null,
        industryGetStartedLandlord.UpdatedBy ? User.findOne({ user_id: industryGetStartedLandlord.UpdatedBy }) : null,
        industryGetStartedLandlord.user_id ? User.findOne({ user_id: industryGetStartedLandlord.user_id }) : null
      ]);
      const obj = industryGetStartedLandlord.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching industry get started landlords by auth', error: error.message });
  }
};

// Update (auth)
const updateIndustryGetStartedLandlord = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Industry_get_started_landlord_id is required in request body' });
    }
    const industryGetStartedLandlord = await Industry_get_started_landlord.findOne({ Industry_get_started_landlord_id: parseInt(id) });
    if (!industryGetStartedLandlord) {
      return res.status(404).json({ success: false, message: 'Industry get started landlord not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Industry_get_started_landlord_id') {
        industryGetStartedLandlord[key] = updateData[key];
      }
    });

    industryGetStartedLandlord.UpdatedBy = userId;
    industryGetStartedLandlord.UpdatedAt = new Date();
    const updated = await industryGetStartedLandlord.save();

    const [createByUser, updatedByUser, mappedUser] = await Promise.all([
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null,
      updated.user_id ? User.findOne({ user_id: updated.user_id }) : null
    ]);

    const response = updated.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;

    res.status(200).json({ success: true, message: 'Industry get started landlord updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating industry get started landlord', error: error.message });
  }
};

module.exports = {
  createIndustryGetStartedLandlord,
  getAllIndustryGetStartedLandlords,
  getIndustryGetStartedLandlordById,
  getIndustryGetStartedLandlordsByAuth,
  updateIndustryGetStartedLandlord
};
