const Plan = require('../models/Plan.model');
const User = require('../models/User.model');

// Create Plan (auth)
const createPlan = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      Type,
      Plan_name,
      Price,
      Simply_line
    } = req.body;

    const plan = new Plan({
      Type,
      Plan_name,
      Price: parseInt(Price),
      Simply_line,
      CreateBy: userId
    });

    const saved = await plan.save();

    const createByUser = await User.findOne({ user_id: saved.CreateBy });

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;

    res.status(201).json({ success: true, message: 'Plan created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating plan', error: error.message });
  }
};

// Get all (public)
const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(plans.map(async (plan) => {
      const [createByUser, updatedByUser] = await Promise.all([
        plan.CreateBy ? User.findOne({ user_id: plan.CreateBy }) : null,
        plan.UpdatedBy ? User.findOne({ user_id: plan.UpdatedBy }) : null
      ]);
      const obj = plan.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching plans', error: error.message });
  }
};

// Get by id (auth)
const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findOne({ Plan_id: parseInt(id) });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    const [createByUser, updatedByUser] = await Promise.all([
      plan.CreateBy ? User.findOne({ user_id: plan.CreateBy }) : null,
      plan.UpdatedBy ? User.findOne({ user_id: plan.UpdatedBy }) : null
    ]);
    const response = plan.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching plan', error: error.message });
  }
};

// Get by auth user (auth)
const getPlansByAuth = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const plans = await Plan.find({ CreateBy: userId, Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(plans.map(async (plan) => {
      const [createByUser, updatedByUser] = await Promise.all([
        plan.CreateBy ? User.findOne({ user_id: plan.CreateBy }) : null,
        plan.UpdatedBy ? User.findOne({ user_id: plan.UpdatedBy }) : null
      ]);
      const obj = plan.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching plans by auth', error: error.message });
  }
};

// Update (auth)
const updatePlan = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Plan_id is required in request body' });
    }
    const plan = await Plan.findOne({ Plan_id: parseInt(id) });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Plan_id') {
        plan[key] = updateData[key];
      }
    });

    plan.UpdatedBy = userId;
    plan.UpdatedAt = new Date();
    const updated = await plan.save();

    const [createByUser, updatedByUser] = await Promise.all([
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null
    ]);

    const response = updated.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;

    res.status(200).json({ success: true, message: 'Plan updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating plan', error: error.message });
  }
};

module.exports = {
  createPlan,
  getAllPlans,
  getPlanById,
  getPlansByAuth,
  updatePlan
};
