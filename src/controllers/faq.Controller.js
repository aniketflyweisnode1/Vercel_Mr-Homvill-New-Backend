const faq = require('../models/faq.model');
const User = require('../models/User.model');

// Create faq (auth)
const createFaq = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      Title,
      Description
    } = req.body;

    const item = new faq({
      Title: Title ?? null,
      Description: Description ?? null,
      CreateBy: userId
    });

    const saved = await item.save();

    const [createByUser] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;

    res.status(201).json({ success: true, message: 'FAQ created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating FAQ', error: error.message });
  }
};

// Get all (public)
const getAllFaqs = async (req, res) => {
  try {
    const items = await faq.find({ Status: true }).sort({ CreateAt: -1 });
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
    res.status(500).json({ success: false, message: 'Error fetching FAQs', error: error.message });
  }
};

// Get by id (auth)
const getFaqById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await faq.findOne({ faq_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
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
    res.status(500).json({ success: false, message: 'Error fetching FAQ', error: error.message });
  }
};

// Update (auth)
const updateFaq = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'faq_id is required in request body' });
    }
    const item = await faq.findOne({ faq_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'faq_id') {
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

    res.status(200).json({ success: true, message: 'FAQ updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating FAQ', error: error.message });
  }
};

// Delete (auth)
const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    
    const item = await faq.findOne({ faq_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    // Soft delete by setting Status to false
    item.Status = false;
    item.UpdatedBy = userId;
    item.UpdatedAt = new Date();
    
    const deleted = await item.save();

    const [createByUser, updatedByUser] = await Promise.all([
      deleted.CreateBy ? User.findOne({ user_id: deleted.CreateBy }) : null,
      deleted.UpdatedBy ? User.findOne({ user_id: deleted.UpdatedBy }) : null
    ]);

    const response = deleted.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;

    res.status(200).json({ success: true, message: 'FAQ deleted successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting FAQ', error: error.message });
  }
};

module.exports = {
  createFaq,
  getAllFaqs,
  getFaqById,
  updateFaq,
  deleteFaq
};
