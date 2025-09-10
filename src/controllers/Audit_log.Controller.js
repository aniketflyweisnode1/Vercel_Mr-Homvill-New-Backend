const Audit_log = require('../models/Audit_log.model');
const User = require('../models/User.model');

// Create Audit Log (auth)
const createAuditLog = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { user_id, Action, type, Enverment } = req.body;

    if (!user_id || !Action) {
      return res.status(400).json({ success: false, message: 'user_id and Action are required' });
    }

    const item = new Audit_log({
      user_id,
      Action,
      type: type ?? null,
      Enverment: Enverment ?? null,
      Status: typeof Status === 'boolean' ? Status : true,
      CreateBy: userId
    });

    const saved = await item.save();

    const [forUser, createByUser] = await Promise.all([
      User.findOne({ user_id: saved.user_id }),
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null
    ]);

    const response = saved.toObject();
    response.user_id = forUser ? { user_id: forUser.user_id, Name: forUser.Name, email: forUser.email } : response.user_id;
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;

    res.status(201).json({ success: true, message: 'Audit log created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating audit log', error: error.message });
  }
};

// Update Audit Log (auth)
const updateAuditLog = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Audit_log id is required in request body' });
    }

    const item = await Audit_log.findOne({ Audit_log_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Audit log not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Audit_log_id') {
        item[key] = updateData[key];
      }
    });

    item.UpdatedBy = userId;
    item.UpdatedAt = new Date();
    const updated = await item.save();

    const [forUser, createByUser, updatedByUser] = await Promise.all([
      updated.user_id ? User.findOne({ user_id: updated.user_id }) : null,
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null
    ]);

    const response = updated.toObject();
    response.user_id = forUser ? { user_id: forUser.user_id, Name: forUser.Name, email: forUser.email } : response.user_id;
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;

    res.status(200).json({ success: true, message: 'Audit log updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating audit log', error: error.message });
  }
};

// Get by ID (auth)
const getAuditLogById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Audit_log.findOne({ Audit_log_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Audit log not found' });
    }

    const [forUser, createByUser, updatedByUser] = await Promise.all([
      item.user_id ? User.findOne({ user_id: item.user_id }) : null,
      item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
      item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null
    ]);

    const response = item.toObject();
    response.user_id = forUser ? { user_id: forUser.user_id, Name: forUser.Name, email: forUser.email } : response.user_id;
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching audit log', error: error.message });
  }
};

// Get all (public per pattern? Requirement says getbyall without auth is fine)
const getAllAuditLogs = async (req, res) => {
  try {
    const items = await Audit_log.find({ Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(items.map(async (item) => {
      const [forUser, createByUser, updatedByUser] = await Promise.all([
        item.user_id ? User.findOne({ user_id: item.user_id }) : null,
        item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
        item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null
      ]);
      const obj = item.toObject();
      obj.user_id = forUser ? { user_id: forUser.user_id, Name: forUser.Name, email: forUser.email } : obj.user_id;
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching audit logs', error: error.message });
  }
};

// Get by auth (auth)
const getAuditLogsByAuth = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const items = await Audit_log.find({ Status: true, CreateBy: userId }).sort({ CreateAt: -1 });
    const response = await Promise.all(items.map(async (item) => {
      const [forUser, createByUser, updatedByUser] = await Promise.all([
        item.user_id ? User.findOne({ user_id: item.user_id }) : null,
        item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
        item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null
      ]);
      const obj = item.toObject();
      obj.user_id = forUser ? { user_id: forUser.user_id, Name: forUser.Name, email: forUser.email } : obj.user_id;
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching audit logs for user', error: error.message });
  }
};

module.exports = {
  createAuditLog,
  updateAuditLog,
  getAuditLogById,
  getAllAuditLogs,
  getAuditLogsByAuth
};


