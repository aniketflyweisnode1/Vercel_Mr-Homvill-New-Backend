const Industry_get_started_local_advertiser = require('../models/Industry_get_started_local_advertiser.model');
const User = require('../models/User.model');

// Create Industry_get_started_local_advertiser (auth)
const createIndustryGetStartedLocalAdvertiser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      company,
      name,
      email,
      Phone,
      website_url,
      brand_company_name,
      BoostOnLevel,
      BusinessType,
      Industry_segment,
      user_id
    } = req.body;

    const industryGetStartedLocalAdvertiser = new Industry_get_started_local_advertiser({
      company,
      name,
      email,
      Phone,
      website_url,
      brand_company_name,
      BoostOnLevel,
      BusinessType,
      Industry_segment,
      user_id: parseInt(user_id),
      CreateBy: userId
    });

    const saved = await industryGetStartedLocalAdvertiser.save();

    const [createByUser, mappedUser] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null,
      saved.user_id ? User.findOne({ user_id: saved.user_id }) : null
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;

    res.status(201).json({ success: true, message: 'Industry get started local advertiser created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating industry get started local advertiser', error: error.message });
  }
};

// Get all (public)
const getAllIndustryGetStartedLocalAdvertisers = async (req, res) => {
  try {
    const industryGetStartedLocalAdvertisers = await Industry_get_started_local_advertiser.find({ Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(industryGetStartedLocalAdvertisers.map(async (industryGetStartedLocalAdvertiser) => {
      const [createByUser, updatedByUser, mappedUser] = await Promise.all([
        industryGetStartedLocalAdvertiser.CreateBy ? User.findOne({ user_id: industryGetStartedLocalAdvertiser.CreateBy }) : null,
        industryGetStartedLocalAdvertiser.UpdatedBy ? User.findOne({ user_id: industryGetStartedLocalAdvertiser.UpdatedBy }) : null,
        industryGetStartedLocalAdvertiser.user_id ? User.findOne({ user_id: industryGetStartedLocalAdvertiser.user_id }) : null
      ]);
      const obj = industryGetStartedLocalAdvertiser.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching industry get started local advertisers', error: error.message });
  }
};

// Get by id (auth)
const getIndustryGetStartedLocalAdvertiserById = async (req, res) => {
  try {
    const { id } = req.params;
    const industryGetStartedLocalAdvertiser = await Industry_get_started_local_advertiser.findOne({ industry_remodeling_company_id: parseInt(id) });
    if (!industryGetStartedLocalAdvertiser) {
      return res.status(404).json({ success: false, message: 'Industry get started local advertiser not found' });
    }
    const [createByUser, updatedByUser, mappedUser] = await Promise.all([
      industryGetStartedLocalAdvertiser.CreateBy ? User.findOne({ user_id: industryGetStartedLocalAdvertiser.CreateBy }) : null,
      industryGetStartedLocalAdvertiser.UpdatedBy ? User.findOne({ user_id: industryGetStartedLocalAdvertiser.UpdatedBy }) : null,
      industryGetStartedLocalAdvertiser.user_id ? User.findOne({ user_id: industryGetStartedLocalAdvertiser.user_id }) : null
    ]);
    const response = industryGetStartedLocalAdvertiser.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching industry get started local advertiser', error: error.message });
  }
};

// Get by auth user (auth)
const getIndustryGetStartedLocalAdvertisersByAuth = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const industryGetStartedLocalAdvertisers = await Industry_get_started_local_advertiser.find({ user_id: userId, Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(industryGetStartedLocalAdvertisers.map(async (industryGetStartedLocalAdvertiser) => {
      const [createByUser, updatedByUser, mappedUser] = await Promise.all([
        industryGetStartedLocalAdvertiser.CreateBy ? User.findOne({ user_id: industryGetStartedLocalAdvertiser.CreateBy }) : null,
        industryGetStartedLocalAdvertiser.UpdatedBy ? User.findOne({ user_id: industryGetStartedLocalAdvertiser.UpdatedBy }) : null,
        industryGetStartedLocalAdvertiser.user_id ? User.findOne({ user_id: industryGetStartedLocalAdvertiser.user_id }) : null
      ]);
      const obj = industryGetStartedLocalAdvertiser.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching industry get started local advertisers by auth', error: error.message });
  }
};

// Update (auth)
const updateIndustryGetStartedLocalAdvertiser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Industry_remodeling_company_id is required in request body' });
    }
    const industryGetStartedLocalAdvertiser = await Industry_get_started_local_advertiser.findOne({ industry_remodeling_company_id: parseInt(id) });
    if (!industryGetStartedLocalAdvertiser) {
      return res.status(404).json({ success: false, message: 'Industry get started local advertiser not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'industry_remodeling_company_id') {
        industryGetStartedLocalAdvertiser[key] = updateData[key];
      }
    });

    industryGetStartedLocalAdvertiser.UpdatedBy = userId;
    industryGetStartedLocalAdvertiser.UpdatedAt = new Date();
    const updated = await industryGetStartedLocalAdvertiser.save();

    const [createByUser, updatedByUser, mappedUser] = await Promise.all([
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null,
      updated.user_id ? User.findOne({ user_id: updated.user_id }) : null
    ]);

    const response = updated.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;

    res.status(200).json({ success: true, message: 'Industry get started local advertiser updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating industry get started local advertiser', error: error.message });
  }
};

module.exports = {
  createIndustryGetStartedLocalAdvertiser,
  getAllIndustryGetStartedLocalAdvertisers,
  getIndustryGetStartedLocalAdvertiserById,
  getIndustryGetStartedLocalAdvertisersByAuth,
  updateIndustryGetStartedLocalAdvertiser
};
