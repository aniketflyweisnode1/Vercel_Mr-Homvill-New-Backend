const Coupons_Map_user = require('../models/Coupons_Map_user.model');
const Coupons = require('../models/Coupons.model');
const User = require('../models/User.model');

// Create Coupons_Map_user (auth)
const createCouponsMapUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      Coupons_id,
      user_id
    } = req.body;

    const couponsMapUser = new Coupons_Map_user({
      Coupons_id: parseInt(Coupons_id),
      user_id: parseInt(user_id),
      CreateBy: userId
    });

    const saved = await couponsMapUser.save();

    const [createByUser, couponsData, mappedUser] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null,
      saved.Coupons_id ? Coupons.findOne({ Coupons_id: saved.Coupons_id }) : null,
      saved.user_id ? User.findOne({ user_id: saved.user_id }) : null
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.Coupons = couponsData ? { Coupons_id: couponsData.Coupons_id, Name: couponsData.Name, price: couponsData.price, expirydatetime: couponsData.expirydatetime } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;

    res.status(201).json({ success: true, message: 'Coupons map user created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating coupons map user', error: error.message });
  }
};

// Get all (public)
const getAllCouponsMapUsers = async (req, res) => {
  try {
    const couponsMapUsers = await Coupons_Map_user.find({ Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(couponsMapUsers.map(async (couponsMapUser) => {
      const [createByUser, updatedByUser, couponsData, mappedUser] = await Promise.all([
        couponsMapUser.CreateBy ? User.findOne({ user_id: couponsMapUser.CreateBy }) : null,
        couponsMapUser.UpdatedBy ? User.findOne({ user_id: couponsMapUser.UpdatedBy }) : null,
        couponsMapUser.Coupons_id ? Coupons.findOne({ Coupons_id: couponsMapUser.Coupons_id }) : null,
        couponsMapUser.user_id ? User.findOne({ user_id: couponsMapUser.user_id }) : null
      ]);
      const obj = couponsMapUser.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.Coupons = couponsData ? { Coupons_id: couponsData.Coupons_id, Name: couponsData.Name, price: couponsData.price, expirydatetime: couponsData.expirydatetime } : null;
      obj.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching coupons map users', error: error.message });
  }
};

// Get by id (auth)
const getCouponsMapUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const couponsMapUser = await Coupons_Map_user.findOne({ Coupons_Map_user_id: parseInt(id) });
    if (!couponsMapUser) {
      return res.status(404).json({ success: false, message: 'Coupons map user not found' });
    }
    const [createByUser, updatedByUser, couponsData, mappedUser] = await Promise.all([
      couponsMapUser.CreateBy ? User.findOne({ user_id: couponsMapUser.CreateBy }) : null,
      couponsMapUser.UpdatedBy ? User.findOne({ user_id: couponsMapUser.UpdatedBy }) : null,
      couponsMapUser.Coupons_id ? Coupons.findOne({ Coupons_id: couponsMapUser.Coupons_id }) : null,
      couponsMapUser.user_id ? User.findOne({ user_id: couponsMapUser.user_id }) : null
    ]);
    const response = couponsMapUser.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.Coupons = couponsData ? { Coupons_id: couponsData.Coupons_id, Name: couponsData.Name, price: couponsData.price, expirydatetime: couponsData.expirydatetime } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching coupons map user', error: error.message });
  }
};

// Update (auth)
const updateCouponsMapUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Coupons_Map_user_id is required in request body' });
    }
    const couponsMapUser = await Coupons_Map_user.findOne({ Coupons_Map_user_id: parseInt(id) });
    if (!couponsMapUser) {
      return res.status(404).json({ success: false, message: 'Coupons map user not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Coupons_Map_user_id') {
        couponsMapUser[key] = updateData[key];
      }
    });

    couponsMapUser.UpdatedBy = userId;
    couponsMapUser.UpdatedAt = new Date();
    const updated = await couponsMapUser.save();

    const [createByUser, updatedByUser, couponsData, mappedUser] = await Promise.all([
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null,
      updated.Coupons_id ? Coupons.findOne({ Coupons_id: updated.Coupons_id }) : null,
      updated.user_id ? User.findOne({ user_id: updated.user_id }) : null
    ]);

    const response = updated.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.Coupons = couponsData ? { Coupons_id: couponsData.Coupons_id, Name: couponsData.Name, price: couponsData.price, expirydatetime: couponsData.expirydatetime } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;

    res.status(200).json({ success: true, message: 'Coupons map user updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating coupons map user', error: error.message });
  }
};

module.exports = {
  createCouponsMapUser,
  getAllCouponsMapUsers,
  getCouponsMapUserById,
  updateCouponsMapUser
};
