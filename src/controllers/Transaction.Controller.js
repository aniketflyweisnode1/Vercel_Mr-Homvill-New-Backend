const Transaction = require('../models/Transaction.model');
const PaymentMode = require('../models/Payment_mode.model');
const User = require('../models/User.model');

// Create Transaction
const createTransaction = async (req, res) => {
  try {
    const { user_id, Payment_mode_id, Amount, Date, Payment_Status } = req.body;

    // Validate references minimally
    const [user, paymentMode] = await Promise.all([
      User.findOne({ user_id: parseInt(user_id) }),
      PaymentMode.findOne({ Payment_mode_id: parseInt(Payment_mode_id) })
    ]);
    if (!user) return res.status(400).json({ success: false, message: 'User not found' });
    if (!paymentMode) return res.status(400).json({ success: false, message: 'Payment mode not found' });

    const item = new Transaction({
      user_id: parseInt(user_id),
      Payment_mode_id: parseInt(Payment_mode_id),
      Amount,
      Date,
      Payment_Status: Payment_Status || 'Pending',
      Status: typeof Status === 'boolean' ? Status : true,
      CreateBy: req.user?.user_id || null
    });

    const saved = await item.save();

    const [createByUser, txUser, txPaymentMode] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null,
      User.findOne({ user_id: saved.user_id }),
      PaymentMode.findOne({ Payment_mode_id: saved.Payment_mode_id })
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.user_id = txUser ? { user_id: txUser.user_id, Name: txUser.Name, email: txUser.email } : null;
    response.Payment_mode_id = txPaymentMode ? { Payment_mode_id: txPaymentMode.Payment_mode_id, name: txPaymentMode.name } : null;

    res.status(201).json({ success: true, message: 'Transaction created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating transaction', error: error.message });
  }
};

// Get all Transactions (public)
const getAllTransactions = async (req, res) => {
  try {
    const items = await Transaction.find({ Status: true }).sort({ CreateAt: -1 });

    const response = await Promise.all(items.map(async (item) => {
      const [createByUser, updatedByUser, txUser, txPaymentMode] = await Promise.all([
        item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
        item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null,
        User.findOne({ user_id: item.user_id }),
        PaymentMode.findOne({ Payment_mode_id: item.Payment_mode_id })
      ]);
      const obj = item.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.user_id = txUser ? { user_id: txUser.user_id, Name: txUser.Name, email: txUser.email } : null;
      obj.Payment_mode_id = txPaymentMode ? { Payment_mode_id: txPaymentMode.Payment_mode_id, name: txPaymentMode.name } : null;
      return obj;
    }));

    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching transactions', error: error.message });
  }
};

// Get Transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Transaction.findOne({ Transaction_id: parseInt(id) });
    if (!item) return res.status(404).json({ success: false, message: 'Transaction not found' });

    const [createByUser, updatedByUser, txUser, txPaymentMode] = await Promise.all([
      item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
      item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null,
      User.findOne({ user_id: item.user_id }),
      PaymentMode.findOne({ Payment_mode_id: item.Payment_mode_id })
    ]);
    const response = item.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.user_id = txUser ? { user_id: txUser.user_id, Name: txUser.Name, email: txUser.email } : null;
    response.Payment_mode_id = txPaymentMode ? { Payment_mode_id: txPaymentMode.Payment_mode_id, name: txPaymentMode.name } : null;

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching transaction', error: error.message });
  }
};

// Get Transactions by Authenticated User
const getTransactionsByAuth = async (req, res) => {
  try {
    const authUserId = req.user.user_id;
    const items = await Transaction.find({ user_id: authUserId }).sort({ CreateAt: -1 });

    const response = await Promise.all(items.map(async (item) => {
      const [createByUser, updatedByUser, txPaymentMode] = await Promise.all([
        item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
        item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null,
        PaymentMode.findOne({ Payment_mode_id: item.Payment_mode_id })
      ]);
      const obj = item.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.user_id = { user_id: authUserId };
      obj.Payment_mode_id = txPaymentMode ? { Payment_mode_id: txPaymentMode.Payment_mode_id, name: txPaymentMode.name } : null;
      return obj;
    }));

    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user transactions', error: error.message });
  }
};

// Update Transaction
const updateTransaction = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const userId = req.user.user_id;
    if (!id) return res.status(400).json({ success: false, message: 'Transaction id is required in body' });
    const item = await Transaction.findOne({ Transaction_id: parseInt(id) });
    if (!item) return res.status(404).json({ success: false, message: 'Transaction not found' });

    // If foreign keys are being updated, validate
    if (updateData.user_id) {
      const user = await User.findOne({ user_id: parseInt(updateData.user_id) });
      if (!user) return res.status(400).json({ success: false, message: 'User not found' });
      updateData.user_id = parseInt(updateData.user_id);
    }
    if (updateData.Payment_mode_id) {
      const pm = await PaymentMode.findOne({ Payment_mode_id: parseInt(updateData.Payment_mode_id) });
      if (!pm) return res.status(400).json({ success: false, message: 'Payment mode not found' });
      updateData.Payment_mode_id = parseInt(updateData.Payment_mode_id);
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Transaction_id') item[key] = updateData[key];
    });

    item.UpdatedBy = userId;
    item.UpdatedAt = new Date();
    const updated = await item.save();

    const [createByUser, updatedByUser, txUser, txPaymentMode] = await Promise.all([
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null,
      User.findOne({ user_id: updated.user_id }),
      PaymentMode.findOne({ Payment_mode_id: updated.Payment_mode_id })
    ]);
    const response = updated.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.user_id = txUser ? { user_id: txUser.user_id, Name: txUser.Name, email: txUser.email } : null;
    response.Payment_mode_id = txPaymentMode ? { Payment_mode_id: txPaymentMode.Payment_mode_id, name: txPaymentMode.name } : null;

    res.status(200).json({ success: true, message: 'Transaction updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating transaction', error: error.message });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  getTransactionsByAuth,
  updateTransaction
};


