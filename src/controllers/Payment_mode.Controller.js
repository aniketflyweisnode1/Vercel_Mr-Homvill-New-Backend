const PaymentMode = require('../models/Payment_mode.model');
const User = require('../models/User.model');

// Create Payment Mode
const createPaymentMode = async (req, res) => {
  try {
    const { name, Status } = req.body;
    const item = new PaymentMode({
      name,
      Status: typeof Status === 'boolean' ? Status : true,
      CreateBy: req.user?.user_id || null
    });

    const saved = await item.save();
    const createByUser = saved.CreateBy ? await User.findOne({ user_id: saved.CreateBy }) : null;

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;

    res.status(201).json({ success: true, message: 'Payment mode created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating payment mode', error: error.message });
  }
};

// Get all Payment Modes (public)
const getAllPaymentModes = async (req, res) => {
  try {
    const items = await PaymentMode.find({ Status: true }).sort({ CreateAt: -1 });
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
    res.status(500).json({ success: false, message: 'Error fetching payment modes', error: error.message });
  }
};

// Get Payment Mode by ID
const getPaymentModeById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await PaymentMode.findOne({ Payment_mode_id: parseInt(id) });
    if (!item) return res.status(404).json({ success: false, message: 'Payment mode not found' });

    const [createByUser, updatedByUser] = await Promise.all([
      item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
      item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null
    ]);
    const response = item.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching payment mode', error: error.message });
  }
};

// Update Payment Mode
const updatePaymentMode = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const userId = req.user.user_id;
    if (!id) return res.status(400).json({ success: false, message: 'Payment_mode id is required in body' });
    const item = await PaymentMode.findOne({ Payment_mode_id: parseInt(id) });
    if (!item) return res.status(404).json({ success: false, message: 'Payment mode not found' });

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Payment_mode_id') item[key] = updateData[key];
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
    res.status(200).json({ success: true, message: 'Payment mode updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating payment mode', error: error.message });
  }
};

module.exports = {
  createPaymentMode,
  getAllPaymentModes,
  getPaymentModeById,
  updatePaymentMode
};


