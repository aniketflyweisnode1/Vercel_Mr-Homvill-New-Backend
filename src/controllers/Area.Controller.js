const Area = require('../models/Area.model');
const User = require('../models/User.model');

// Create Area
const createArea = async (req, res) => {
  try {
    const { Area_name, Status } = req.body;
    const item = new Area({
      Area_name,
      Status: typeof Status === 'boolean' ? Status : true,
      CreateBy: req.user?.user_id || null
    });

    const saved = await item.save();
    const createByUser = saved.CreateBy ? await User.findOne({ user_id: saved.CreateBy }) : null;
    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    res.status(201).json({ success: true, message: 'Area created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating area', error: error.message });
  }
};

// Get all Areas (public)
const getAllAreas = async (req, res) => {
  try {
    const items = await Area.find({ Status: true }).sort({ CreateAt: -1 });
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
    res.status(500).json({ success: false, message: 'Error fetching areas', error: error.message });
  }
};

// Get Areas by Authenticated User
const getAreasByAuth = async (req, res) => {
  try {
    const authUserId = req.user.user_id;
    const items = await Area.find({ CreateBy: authUserId }).sort({ CreateAt: -1 });
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
    res.status(500).json({ success: false, message: 'Error fetching user areas', error: error.message });
  }
};

// Get Area by ID
const getAreaById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Area.findOne({ Area_id: parseInt(id) });
    if (!item) return res.status(404).json({ success: false, message: 'Area not found' });
    const [createByUser, updatedByUser] = await Promise.all([
      item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
      item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null
    ]);
    const response = item.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching area', error: error.message });
  }
};

// Update Area
const updateArea = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const userId = req.user.user_id;
    if (!id) return res.status(400).json({ success: false, message: 'Area id is required in body' });
    const item = await Area.findOne({ Area_id: parseInt(id) });
    if (!item) return res.status(404).json({ success: false, message: 'Area not found' });

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Area_id') item[key] = updateData[key];
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
    res.status(200).json({ success: true, message: 'Area updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating area', error: error.message });
  }
};

module.exports = {
  createArea,
  getAllAreas,
  getAreasByAuth,
  getAreaById,
  updateArea
};


