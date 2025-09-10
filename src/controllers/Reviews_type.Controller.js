const Reviews_type = require('../models/Reviews_type.model');
const User = require('../models/User.model');

// Create Reviews_type (auth)
const createReviewsType = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      Reviews_type_name
    } = req.body;

    const item = new Reviews_type({
      Reviews_type_name: Reviews_type_name ?? null,
      CreateBy: userId
    });

    const saved = await item.save();

    const [createByUser] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;

    res.status(201).json({ success: true, message: 'Reviews type created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating reviews type', error: error.message });
  }
};

// Get all (public)
const getAllReviewsTypes = async (req, res) => {
  try {
    const items = await Reviews_type.find({ Status: true }).sort({ CreateAt: -1 });
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
    res.status(500).json({ success: false, message: 'Error fetching reviews types', error: error.message });
  }
};

// Get by id (auth)
const getReviewsTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Reviews_type.findOne({ Reviews_type_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Reviews type not found' });
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
    res.status(500).json({ success: false, message: 'Error fetching reviews type', error: error.message });
  }
};

// Get by auth user (auth)
const getReviewsTypesByAuth = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const items = await Reviews_type.find({ CreateBy: userId, Status: true }).sort({ CreateAt: -1 });
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
    res.status(500).json({ success: false, message: 'Error fetching reviews types by auth', error: error.message });
  }
};

// Update (auth)
const updateReviewsType = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Reviews_type_id is required in request body' });
    }
    const item = await Reviews_type.findOne({ Reviews_type_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Reviews type not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Reviews_type_id') {
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

    res.status(200).json({ success: true, message: 'Reviews type updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating reviews type', error: error.message });
  }
};

module.exports = {
  createReviewsType,
  getAllReviewsTypes,
  getReviewsTypeById,
  getReviewsTypesByAuth,
  updateReviewsType
};
