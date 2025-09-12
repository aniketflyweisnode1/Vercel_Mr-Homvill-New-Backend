const Plan_map_user = require('../models/Plan_map_user.model');
const Plan = require('../models/Plan.model');
const User = require('../models/User.model');

// Create Plan_map_user (auth)
const createPlanMapUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      Plan_id,
      user_id
    } = req.body;

    const planMapUser = new Plan_map_user({
      Plan_id: parseInt(Plan_id),
      user_id: parseInt(user_id),
      CreateBy: userId
    });

    const saved = await planMapUser.save();

    const [createByUser, planData, mappedUser] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null,
      saved.Plan_id ? Plan.findOne({ Plan_id: saved.Plan_id }) : null,
      saved.user_id ? User.findOne({ user_id: saved.user_id }) : null
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.Plan = planData ? { Plan_id: planData.Plan_id, Plan_name: planData.Plan_name, Type: planData.Type, Price: planData.Price } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;

    res.status(201).json({ success: true, message: 'Plan map user created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating plan map user', error: error.message });
  }
};

// Get all (public)
const getAllPlanMapUsers = async (req, res) => {
  try {
    const planMapUsers = await Plan_map_user.find({ Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(planMapUsers.map(async (planMapUser) => {
      const [createByUser, updatedByUser, planData, mappedUser] = await Promise.all([
        planMapUser.CreateBy ? User.findOne({ user_id: planMapUser.CreateBy }) : null,
        planMapUser.UpdatedBy ? User.findOne({ user_id: planMapUser.UpdatedBy }) : null,
        planMapUser.Plan_id ? Plan.findOne({ Plan_id: planMapUser.Plan_id }) : null,
        planMapUser.user_id ? User.findOne({ user_id: planMapUser.user_id }) : null
      ]);
      const obj = planMapUser.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.Plan = planData ? { Plan_id: planData.Plan_id, Plan_name: planData.Plan_name, Type: planData.Type, Price: planData.Price } : null;
      obj.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching plan map users', error: error.message });
  }
};

// Get by id (auth)
const getPlanMapUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const planMapUser = await Plan_map_user.findOne({ Plan_map_user_id: parseInt(id) });
    if (!planMapUser) {
      return res.status(404).json({ success: false, message: 'Plan map user not found' });
    }
    const [createByUser, updatedByUser, planData, mappedUser] = await Promise.all([
      planMapUser.CreateBy ? User.findOne({ user_id: planMapUser.CreateBy }) : null,
      planMapUser.UpdatedBy ? User.findOne({ user_id: planMapUser.UpdatedBy }) : null,
      planMapUser.Plan_id ? Plan.findOne({ Plan_id: planMapUser.Plan_id }) : null,
      planMapUser.user_id ? User.findOne({ user_id: planMapUser.user_id }) : null
    ]);
    const response = planMapUser.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.Plan = planData ? { Plan_id: planData.Plan_id, Plan_name: planData.Plan_name, Type: planData.Type, Price: planData.Price } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching plan map user', error: error.message });
  }
};

// Get by auth user (auth)
const getPlanMapUsersByAuth = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const planMapUsers = await Plan_map_user.find({ user_id: userId, Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(planMapUsers.map(async (planMapUser) => {
      const [createByUser, updatedByUser, planData, mappedUser] = await Promise.all([
        planMapUser.CreateBy ? User.findOne({ user_id: planMapUser.CreateBy }) : null,
        planMapUser.UpdatedBy ? User.findOne({ user_id: planMapUser.UpdatedBy }) : null,
        planMapUser.Plan_id ? Plan.findOne({ Plan_id: planMapUser.Plan_id }) : null,
        planMapUser.user_id ? User.findOne({ user_id: planMapUser.user_id }) : null
      ]);
      const obj = planMapUser.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.Plan = planData ? { Plan_id: planData.Plan_id, Plan_name: planData.Plan_name, Type: planData.Type, Price: planData.Price } : null;
      obj.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching plan map users by auth', error: error.message });
  }
};

// Update (auth)
const updatePlanMapUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Plan_map_user_id is required in request body' });
    }
    const planMapUser = await Plan_map_user.findOne({ Plan_map_user_id: parseInt(id) });
    if (!planMapUser) {
      return res.status(404).json({ success: false, message: 'Plan map user not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Plan_map_user_id') {
        planMapUser[key] = updateData[key];
      }
    });

    planMapUser.UpdatedBy = userId;
    planMapUser.UpdatedAt = new Date();
    const updated = await planMapUser.save();

    const [createByUser, updatedByUser, planData, mappedUser] = await Promise.all([
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null,
      updated.Plan_id ? Plan.findOne({ Plan_id: updated.Plan_id }) : null,
      updated.user_id ? User.findOne({ user_id: updated.user_id }) : null
    ]);

    const response = updated.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.Plan = planData ? { Plan_id: planData.Plan_id, Plan_name: planData.Plan_name, Type: planData.Type, Price: planData.Price } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;

    res.status(200).json({ success: true, message: 'Plan map user updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating plan map user', error: error.message });
  }
};

module.exports = {
  createPlanMapUser,
  getAllPlanMapUsers,
  getPlanMapUserById,
  getPlanMapUsersByAuth,
  updatePlanMapUser
};
