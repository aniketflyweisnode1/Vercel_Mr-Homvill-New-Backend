const Industry_get_started_Seller = require('../models/Industry_get_started_Seller.model');
const User = require('../models/User.model');

// Create Industry_get_started_Seller (auth)
const createIndustryGetStartedSeller = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      YourType,
      Type_industry_Role,
      first_name,
      last_name,
      phone_number,
      email_address,
      size_of_organization,
      user_id
    } = req.body;

    const industryGetStartedSeller = new Industry_get_started_Seller({
      YourType,
      Type_industry_Role,
      first_name,
      last_name,
      phone_number,
      email_address,
      size_of_organization,
      user_id: parseInt(user_id),
      CreateBy: userId
    });

    const saved = await industryGetStartedSeller.save();

    const [createByUser, mappedUser] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null,
      saved.user_id ? User.findOne({ user_id: saved.user_id }) : null
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;

    res.status(201).json({ success: true, message: 'Industry get started seller created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating industry get started seller', error: error.message });
  }
};

// Get all (public)
const getAllIndustryGetStartedSellers = async (req, res) => {
  try {
    const industryGetStartedSellers = await Industry_get_started_Seller.find({ Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(industryGetStartedSellers.map(async (industryGetStartedSeller) => {
      const [createByUser, updatedByUser, mappedUser] = await Promise.all([
        industryGetStartedSeller.CreateBy ? User.findOne({ user_id: industryGetStartedSeller.CreateBy }) : null,
        industryGetStartedSeller.UpdatedBy ? User.findOne({ user_id: industryGetStartedSeller.UpdatedBy }) : null,
        industryGetStartedSeller.user_id ? User.findOne({ user_id: industryGetStartedSeller.user_id }) : null
      ]);
      const obj = industryGetStartedSeller.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching industry get started sellers', error: error.message });
  }
};

// Get by id (auth)
const getIndustryGetStartedSellerById = async (req, res) => {
  try {
    const { id } = req.params;
    const industryGetStartedSeller = await Industry_get_started_Seller.findOne({ Industry_get_started_Seller_id: parseInt(id) });
    if (!industryGetStartedSeller) {
      return res.status(404).json({ success: false, message: 'Industry get started seller not found' });
    }
    const [createByUser, updatedByUser, mappedUser] = await Promise.all([
      industryGetStartedSeller.CreateBy ? User.findOne({ user_id: industryGetStartedSeller.CreateBy }) : null,
      industryGetStartedSeller.UpdatedBy ? User.findOne({ user_id: industryGetStartedSeller.UpdatedBy }) : null,
      industryGetStartedSeller.user_id ? User.findOne({ user_id: industryGetStartedSeller.user_id }) : null
    ]);
    const response = industryGetStartedSeller.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching industry get started seller', error: error.message });
  }
};

// Get by auth user (auth)
const getIndustryGetStartedSellersByAuth = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const industryGetStartedSellers = await Industry_get_started_Seller.find({ user_id: userId, Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(industryGetStartedSellers.map(async (industryGetStartedSeller) => {
      const [createByUser, updatedByUser, mappedUser] = await Promise.all([
        industryGetStartedSeller.CreateBy ? User.findOne({ user_id: industryGetStartedSeller.CreateBy }) : null,
        industryGetStartedSeller.UpdatedBy ? User.findOne({ user_id: industryGetStartedSeller.UpdatedBy }) : null,
        industryGetStartedSeller.user_id ? User.findOne({ user_id: industryGetStartedSeller.user_id }) : null
      ]);
      const obj = industryGetStartedSeller.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching industry get started sellers by auth', error: error.message });
  }
};

// Update (auth)
const updateIndustryGetStartedSeller = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Industry_get_started_Seller_id is required in request body' });
    }
    const industryGetStartedSeller = await Industry_get_started_Seller.findOne({ Industry_get_started_Seller_id: parseInt(id) });
    if (!industryGetStartedSeller) {
      return res.status(404).json({ success: false, message: 'Industry get started seller not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Industry_get_started_Seller_id') {
        industryGetStartedSeller[key] = updateData[key];
      }
    });

    industryGetStartedSeller.UpdatedBy = userId;
    industryGetStartedSeller.UpdatedAt = new Date();
    const updated = await industryGetStartedSeller.save();

    const [createByUser, updatedByUser, mappedUser] = await Promise.all([
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null,
      updated.user_id ? User.findOne({ user_id: updated.user_id }) : null
    ]);

    const response = updated.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;

    res.status(200).json({ success: true, message: 'Industry get started seller updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating industry get started seller', error: error.message });
  }
};

module.exports = {
  createIndustryGetStartedSeller,
  getAllIndustryGetStartedSellers,
  getIndustryGetStartedSellerById,
  getIndustryGetStartedSellersByAuth,
  updateIndustryGetStartedSeller
};
