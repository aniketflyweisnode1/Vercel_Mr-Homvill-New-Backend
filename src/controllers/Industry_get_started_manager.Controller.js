const Industry_get_started_manager = require('../models/Industry_get_started_manager.model');
const User = require('../models/User.model');

// Create Industry_get_started_manager (auth)
const createIndustryGetStartedManager = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      properties_unites,
      first_name,
      last_name,
      property_company,
      Company_state,
      property_name,
      email,
      Phone,
      user_id
    } = req.body;

    const industryGetStartedManager = new Industry_get_started_manager({
      properties_unites,
      first_name,
      last_name,
      property_company,
      Company_state,
      property_name,
      email,
      Phone,
      user_id: parseInt(user_id),
      CreateBy: userId
    });

    const saved = await industryGetStartedManager.save();

    const [createByUser, mappedUser] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null,
      saved.user_id ? User.findOne({ user_id: saved.user_id }) : null
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;

    res.status(201).json({ success: true, message: 'Industry get started manager created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating industry get started manager', error: error.message });
  }
};

// Get all (public)
const getAllIndustryGetStartedManagers = async (req, res) => {
  try {
    const industryGetStartedManagers = await Industry_get_started_manager.find({ Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(industryGetStartedManagers.map(async (industryGetStartedManager) => {
      const [createByUser, updatedByUser, mappedUser] = await Promise.all([
        industryGetStartedManager.CreateBy ? User.findOne({ user_id: industryGetStartedManager.CreateBy }) : null,
        industryGetStartedManager.UpdatedBy ? User.findOne({ user_id: industryGetStartedManager.UpdatedBy }) : null,
        industryGetStartedManager.user_id ? User.findOne({ user_id: industryGetStartedManager.user_id }) : null
      ]);
      const obj = industryGetStartedManager.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching industry get started managers', error: error.message });
  }
};

// Get by id (auth)
const getIndustryGetStartedManagerById = async (req, res) => {
  try {
    const { id } = req.params;
    const industryGetStartedManager = await Industry_get_started_manager.findOne({ Industry_get_started_manager_id: parseInt(id) });
    if (!industryGetStartedManager) {
      return res.status(404).json({ success: false, message: 'Industry get started manager not found' });
    }
    const [createByUser, updatedByUser, mappedUser] = await Promise.all([
      industryGetStartedManager.CreateBy ? User.findOne({ user_id: industryGetStartedManager.CreateBy }) : null,
      industryGetStartedManager.UpdatedBy ? User.findOne({ user_id: industryGetStartedManager.UpdatedBy }) : null,
      industryGetStartedManager.user_id ? User.findOne({ user_id: industryGetStartedManager.user_id }) : null
    ]);
    const response = industryGetStartedManager.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching industry get started manager', error: error.message });
  }
};

// Get by auth user (auth)
const getIndustryGetStartedManagersByAuth = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const industryGetStartedManagers = await Industry_get_started_manager.find({ user_id: userId, Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(industryGetStartedManagers.map(async (industryGetStartedManager) => {
      const [createByUser, updatedByUser, mappedUser] = await Promise.all([
        industryGetStartedManager.CreateBy ? User.findOne({ user_id: industryGetStartedManager.CreateBy }) : null,
        industryGetStartedManager.UpdatedBy ? User.findOne({ user_id: industryGetStartedManager.UpdatedBy }) : null,
        industryGetStartedManager.user_id ? User.findOne({ user_id: industryGetStartedManager.user_id }) : null
      ]);
      const obj = industryGetStartedManager.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching industry get started managers by auth', error: error.message });
  }
};

// Update (auth)
const updateIndustryGetStartedManager = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Industry_get_started_manager_id is required in request body' });
    }
    const industryGetStartedManager = await Industry_get_started_manager.findOne({ Industry_get_started_manager_id: parseInt(id) });
    if (!industryGetStartedManager) {
      return res.status(404).json({ success: false, message: 'Industry get started manager not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Industry_get_started_manager_id') {
        industryGetStartedManager[key] = updateData[key];
      }
    });

    industryGetStartedManager.UpdatedBy = userId;
    industryGetStartedManager.UpdatedAt = new Date();
    const updated = await industryGetStartedManager.save();

    const [createByUser, updatedByUser, mappedUser] = await Promise.all([
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null,
      updated.user_id ? User.findOne({ user_id: updated.user_id }) : null
    ]);

    const response = updated.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;

    res.status(200).json({ success: true, message: 'Industry get started manager updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating industry get started manager', error: error.message });
  }
};

module.exports = {
  createIndustryGetStartedManager,
  getAllIndustryGetStartedManagers,
  getIndustryGetStartedManagerById,
  getIndustryGetStartedManagersByAuth,
  updateIndustryGetStartedManager
};
