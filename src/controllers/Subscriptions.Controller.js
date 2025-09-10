const Subscriptions = require('../models/Subscriptions.model');
const User = require('../models/User.model');

// Create Subscription
const createSubscription = async (req, res) => {
  try {
    const {
      name,
      emozi,
      price,
      Lines,
      Subscription_for,
      Feactue_name,
      Status
    } = req.body;

    const subscription = new Subscriptions({
      name,
      emozi,
      price,
      Lines: Array.isArray(Lines) ? Lines : [],
      Subscription_for: Array.isArray(Subscription_for) ? Subscription_for : [],
      Feactue_name,
      Status: typeof Status === 'boolean' ? Status : true,
      CreateBy: req.user?.user_id || null
    });

    const saved = await subscription.save();

    const createByUser = saved.CreateBy ? await User.findOne({ user_id: saved.CreateBy }) : null;

    const response = saved.toObject();
    response.CreateBy = createByUser ? {
      user_id: createByUser.user_id,
      Name: createByUser.Name,
      email: createByUser.email
    } : null;

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating subscription',
      error: error.message
    });
  }
};

// Get All Subscriptions (public)
const getAllSubscriptions = async (req, res) => {
  try {
    const items = await Subscriptions.find({ Status: true }).sort({ CreateAt: -1 });

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
    res.status(500).json({ success: false, message: 'Error fetching subscriptions', error: error.message });
  }
};

// Get Subscription by ID
const getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Subscriptions.findOne({ Subscriptions_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
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
    res.status(500).json({ success: false, message: 'Error fetching subscription', error: error.message });
  }
};

// Update Subscription
const updateSubscription = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const userId = req.user.user_id;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Subscription ID is required in request body' });
    }

    const item = await Subscriptions.findOne({ Subscriptions_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Subscriptions_id') {
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

    res.status(200).json({ success: true, message: 'Subscription updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating subscription', error: error.message });
  }
};

module.exports = {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription
};


