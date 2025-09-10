const user_Query = require('../models/user_Query.model');
const User = require('../models/User.model');

// Create user_Query (auth)
const createUserQuery = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      user_id,
      user_name,
      user_contact,
      user_email,
      Query_txt
    } = req.body;

    const item = new user_Query({
      user_id: user_id ?? null,
      user_name: user_name ?? null,
      user_contact: user_contact ?? null,
      user_email: user_email ?? null,
      Query_txt: Query_txt ?? null,
      CreateBy: userId
    });

    const saved = await item.save();

    const [createByUser, queryUser] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null,
      saved.user_id ? User.findOne({ user_id: saved.user_id }) : null
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.user_id = queryUser ? { user_id: queryUser.user_id, Name: queryUser.Name, email: queryUser.email } : null;

    res.status(201).json({ success: true, message: 'User query created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating user query', error: error.message });
  }
};

// Get all (public)
const getAllUserQueries = async (req, res) => {
  try {
    const items = await user_Query.find({ Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(items.map(async (item) => {
      const [createByUser, updatedByUser, queryUser] = await Promise.all([
        item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
        item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null,
        item.user_id ? User.findOne({ user_id: item.user_id }) : null
      ]);
      const obj = item.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.user_id = queryUser ? { user_id: queryUser.user_id, Name: queryUser.Name, email: queryUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user queries', error: error.message });
  }
};

// Get by id (auth)
const getUserQueryById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await user_Query.findOne({ user_query_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'User query not found' });
    }
    const [createByUser, updatedByUser, queryUser] = await Promise.all([
      item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
      item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null,
      item.user_id ? User.findOne({ user_id: item.user_id }) : null
    ]);
    const response = item.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.user_id = queryUser ? { user_id: queryUser.user_id, Name: queryUser.Name, email: queryUser.email } : null;
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user query', error: error.message });
  }
};

// Update (auth)
const updateUserQuery = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'user_query_id is required in request body' });
    }
    const item = await user_Query.findOne({ user_query_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'User query not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'user_query_id') {
        item[key] = updateData[key];
      }
    });

    item.UpdatedBy = userId;
    item.UpdatedAt = new Date();
    const updated = await item.save();

    const [createByUser, updatedByUser, queryUser] = await Promise.all([
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null,
      updated.user_id ? User.findOne({ user_id: updated.user_id }) : null
    ]);

    const response = updated.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.user_id = queryUser ? { user_id: queryUser.user_id, Name: queryUser.Name, email: queryUser.email } : null;

    res.status(200).json({ success: true, message: 'User query updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user query', error: error.message });
  }
};

module.exports = {
  createUserQuery,
  getAllUserQueries,
  getUserQueryById,
  updateUserQuery
};
