const Push_Notification = require('../models/Push_Notification.model');
const User = require('../models/User.model');

// Create Push_Notification (auth)
const createPushNotification = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      title,
      media_file,
      content,
      whomtosend,
      repeat_notification
    } = req.body;

    const item = new Push_Notification({
      title: title ?? null,
      media_file: media_file ?? null,
      content: content ?? null,
      whomtosend: whomtosend ?? 'all',
      repeat_notification: repeat_notification ?? true,
      CreateBy: userId
    });

    const saved = await item.save();

    const [createByUser] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;

    res.status(201).json({ success: true, message: 'Push Notification created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating push notification', error: error.message });
  }
};

// Get all (public)
const getAllPushNotifications = async (req, res) => {
  try {
    const items = await Push_Notification.find({ Status: true }).sort({ CreateAt: -1 });
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
    res.status(500).json({ success: false, message: 'Error fetching push notifications', error: error.message });
  }
};

// Get by id (auth)
const getPushNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Push_Notification.findOne({ push_notification_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Push Notification not found' });
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
    res.status(500).json({ success: false, message: 'Error fetching push notification', error: error.message });
  }
};

// Update (auth)
const updatePushNotification = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'push_notification_id is required in request body' });
    }
    const item = await Push_Notification.findOne({ push_notification_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Push Notification not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'push_notification_id') {
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

    res.status(200).json({ success: true, message: 'Push Notification updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating push notification', error: error.message });
  }
};

module.exports = {
  createPushNotification,
  getAllPushNotifications,
  getPushNotificationById,
  updatePushNotification
};
