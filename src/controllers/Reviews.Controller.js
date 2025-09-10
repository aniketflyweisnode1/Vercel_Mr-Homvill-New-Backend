const Reviews = require('../models/Reviews.model');
const User = require('../models/User.model');

// Create Reviews (auth)
const createReviews = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      user_id,
      Title,
      Reviews_count,
      Review_text
    } = req.body;

    const item = new Reviews({
      user_id: user_id ?? null,
      Title: Title ?? null,
      Reviews_count: Reviews_count ?? 0,
      Review_text: Review_text ?? null,
      CreateBy: userId
    });

    const saved = await item.save();

    const [createByUser, reviewUser] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null,
      saved.user_id ? User.findOne({ user_id: saved.user_id }) : null
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.user_id = reviewUser ? { user_id: reviewUser.user_id, Name: reviewUser.Name, email: reviewUser.email } : null;

    res.status(201).json({ success: true, message: 'Review created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating review', error: error.message });
  }
};

// Get all (public)
const getAllReviews = async (req, res) => {
  try {
    const items = await Reviews.find({ Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(items.map(async (item) => {
      const [createByUser, updatedByUser, reviewUser] = await Promise.all([
        item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
        item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null,
        item.user_id ? User.findOne({ user_id: item.user_id }) : null
      ]);
      const obj = item.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.user_id = reviewUser ? { user_id: reviewUser.user_id, Name: reviewUser.Name, email: reviewUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching reviews', error: error.message });
  }
};

// Get by id (auth)
const getReviewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Reviews.findOne({ Reviews_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    const [createByUser, updatedByUser, reviewUser] = await Promise.all([
      item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
      item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null,
      item.user_id ? User.findOne({ user_id: item.user_id }) : null
    ]);
    const response = item.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.user_id = reviewUser ? { user_id: reviewUser.user_id, Name: reviewUser.Name, email: reviewUser.email } : null;
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching review', error: error.message });
  }
};

// Update (auth)
const updateReviews = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Reviews_id is required in request body' });
    }
    const item = await Reviews.findOne({ Reviews_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Reviews_id') {
        item[key] = updateData[key];
      }
    });

    item.UpdatedBy = userId;
    item.UpdatedAt = new Date();
    const updated = await item.save();

    const [createByUser, updatedByUser, reviewUser] = await Promise.all([
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null,
      updated.user_id ? User.findOne({ user_id: updated.user_id }) : null
    ]);

    const response = updated.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.user_id = reviewUser ? { user_id: reviewUser.user_id, Name: reviewUser.Name, email: reviewUser.email } : null;

    res.status(200).json({ success: true, message: 'Review updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating review', error: error.message });
  }
};

module.exports = {
  createReviews,
  getAllReviews,
  getReviewsById,
  updateReviews
};
