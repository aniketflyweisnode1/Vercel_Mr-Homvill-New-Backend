const Properties_saved_homes = require('../models/Properties_saved_homes.model');
const Properties = require('../models/Properties.model');
const User = require('../models/User.model');

// Create Properties_saved_homes (auth)
const createPropertiesSavedHomes = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      Properties_id,
      user_id
    } = req.body;

    const item = new Properties_saved_homes({
      Properties_id: parseInt(Properties_id),
      user_id: parseInt(user_id),
      CreateBy: userId
    });

    const saved = await item.save();

    const [createByUser, propertiesData, savedUser] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null,
      saved.Properties_id ? Properties.findOne({ Properties_id: saved.Properties_id }) : null,
      saved.user_id ? User.findOne({ user_id: saved.user_id }) : null
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.Properties = propertiesData ? propertiesData : null;
    response.user_id = savedUser ? { user_id: savedUser.user_id, Name: savedUser.Name, email: savedUser.email } : null;

    res.status(201).json({ success: true, message: 'Properties saved homes created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating properties saved homes', error: error.message });
  }
};

// Get all (public)
const getAllPropertiesSavedHomes = async (req, res) => {
  try {
    console.log('getAllPropertiesSavedHomes');
    const items = await Properties_saved_homes.find({ Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(items.map(async (item) => {
      const [createByUser, updatedByUser, propertiesData, savedUser] = await Promise.all([
        item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
        item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null,
        item.Properties_id ? Properties.findOne({ Properties_id: item.Properties_id }) : null,
        item.user_id ? User.findOne({ user_id: item.user_id }) : null
      ]);
      console.log(propertiesData);
  
      const obj = item.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.Properties = propertiesData ? propertiesData : null;
      obj.user_id = savedUser ? { user_id: savedUser.user_id, Name: savedUser.Name, email: savedUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching properties saved homes', error: error.message });
  }
};

// Get by id (auth)
const getPropertiesSavedHomesById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Properties_saved_homes.findOne({ Properties_saved_homes_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Properties saved homes not found' });
    }
    const [createByUser, updatedByUser, propertiesData, savedUser] = await Promise.all([
      item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
      item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null,
      item.Properties_id ? Properties.findOne({ Properties_id: item.Properties_id }) : null,
      item.user_id ? User.findOne({ user_id: item.user_id }) : null
    ]);
    const response = item.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.Properties = propertiesData ? propertiesData : null;
    response.user_id = savedUser ? { user_id: savedUser.user_id, Name: savedUser.Name, email: savedUser.email } : null;
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching properties saved homes', error: error.message });
  }
};

// Get by auth user (auth)
const getPropertiesSavedHomesByAuth = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const items = await Properties_saved_homes.find({ user_id: userId, Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(items.map(async (item) => {
      const [createByUser, updatedByUser, propertiesData, savedUser] = await Promise.all([
        item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
        item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null,
        item.Properties_id ? Properties.findOne({ Properties_id: item.Properties_id }) : null,
        item.user_id ? User.findOne({ user_id: item.user_id }) : null
      ]);
      const obj = item.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.Properties = propertiesData ? propertiesData : null;
      obj.user_id = savedUser ? { user_id: savedUser.user_id, Name: savedUser.Name, email: savedUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching properties saved homes by auth', error: error.message });
  }
};

// Update (auth)
const updatePropertiesSavedHomes = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Properties_saved_homes_id is required in request body' });
    }
    const item = await Properties_saved_homes.findOne({ Properties_saved_homes_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Properties saved homes not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Properties_saved_homes_id') {
        item[key] = updateData[key];
      }
    });

    item.UpdatedBy = userId;
    item.UpdatedAt = new Date();
    const updated = await item.save();

    const [createByUser, updatedByUser, propertiesData, savedUser] = await Promise.all([
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null,
      updated.Properties_id ? Properties.findOne({ Properties_id: updated.Properties_id }) : null,
      updated.user_id ? User.findOne({ user_id: updated.user_id }) : null
    ]);

    const response = updated.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.Properties = propertiesData ? propertiesData : null;
    response.user_id = savedUser ? { user_id: savedUser.user_id, Name: savedUser.Name, email: savedUser.email } : null;

    res.status(200).json({ success: true, message: 'Properties saved homes updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating properties saved homes', error: error.message });
  }
};

// Delete (auth)
const deletePropertiesSavedHomes = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;
    const item = await Properties_saved_homes.findOne({ Properties_saved_homes_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Properties saved homes not found' });
    }

    item.Status = false;
    item.UpdatedBy = userId;
    item.UpdatedAt = new Date();
    await item.save();

    res.status(200).json({ success: true, message: 'Properties saved homes deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting properties saved homes', error: error.message });
  }
};

module.exports = {
  createPropertiesSavedHomes,
  getAllPropertiesSavedHomes,
  getPropertiesSavedHomesById,
  getPropertiesSavedHomesByAuth,
  updatePropertiesSavedHomes,
  deletePropertiesSavedHomes
};
