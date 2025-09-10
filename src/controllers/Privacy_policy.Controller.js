const Privacy_policy = require('../models/Privacy_policy.model');
const User = require('../models/User.model');

// Create Privacy_policy (auth)
const createPrivacyPolicy = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      Privacy_policy_Title,
      Description
    } = req.body;

    const item = new Privacy_policy({
      Privacy_policy_Title: Privacy_policy_Title ?? null,
      Description: Description ?? null,
      CreateBy: userId
    });

    const saved = await item.save();

    const [createByUser] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;

    res.status(201).json({ success: true, message: 'Privacy Policy created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating privacy policy', error: error.message });
  }
};

// Get all (public)
const getAllPrivacyPolicies = async (req, res) => {
  try {
    const items = await Privacy_policy.find({ Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(items.map(async (item) => {
      const [createByUser, updatedByUser] = await Promise.all([
        item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
        item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null
      ]);
      const obj = item.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching privacy policies', error: error.message });
  }
};

// Get by id (auth)
const getPrivacyPolicyById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Privacy_policy.findOne({ Privacy_policy_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Privacy Policy not found' });
    }
    const [createByUser, updatedByUser] = await Promise.all([
      item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
      item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null
    ]);
    const response = item.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching privacy policy', error: error.message });
  }
};

// Update (auth)
const updatePrivacyPolicy = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Privacy_policy_id is required in request body' });
    }
    const item = await Privacy_policy.findOne({ Privacy_policy_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Privacy Policy not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Privacy_policy_id') {
        item[key] = updateData[key];
      }
    });

    item.UpdatedBy = userId;
    item.UpdatedAt = new Date();
    const updated = await item.save();

    const [createByUser, updatedByUser] = await Promise.all([
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null
    ]);

    const response = updated.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;

    res.status(200).json({ success: true, message: 'Privacy Policy updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating privacy policy', error: error.message });
  }
};

module.exports = {
  createPrivacyPolicy,
  getAllPrivacyPolicies,
  getPrivacyPolicyById,
  updatePrivacyPolicy
};
