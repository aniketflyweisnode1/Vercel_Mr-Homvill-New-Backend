const Coupons = require('../models/Coupons.model');
const User = require('../models/User.model');

// Create Coupons (auth)
const createCoupons = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      Name,
      price,
      expirydatetime
    } = req.body;

    const coupons = new Coupons({
      Name,
      price: parseInt(price),
      expirydatetime: new Date(expirydatetime),
      CreateBy: userId
    });

    const saved = await coupons.save();

    const createByUser = await User.findOne({ user_id: saved.CreateBy });

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;

    res.status(201).json({ success: true, message: 'Coupons created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating coupons', error: error.message });
  }
};

// Get all (public)
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupons.find({ Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(coupons.map(async (coupon) => {
      const [createByUser, updatedByUser] = await Promise.all([
        coupon.CreateBy ? User.findOne({ user_id: coupon.CreateBy }) : null,
        coupon.UpdatedBy ? User.findOne({ user_id: coupon.UpdatedBy }) : null
      ]);
      const obj = coupon.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching coupons', error: error.message });
  }
};

// Get by id (auth)
const getCouponsById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupons = await Coupons.findOne({ Coupons_id: parseInt(id) });
    if (!coupons) {
      return res.status(404).json({ success: false, message: 'Coupons not found' });
    }
    const [createByUser, updatedByUser] = await Promise.all([
      coupons.CreateBy ? User.findOne({ user_id: coupons.CreateBy }) : null,
      coupons.UpdatedBy ? User.findOne({ user_id: coupons.UpdatedBy }) : null
    ]);
    const response = coupons.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching coupons', error: error.message });
  }
};

// Update (auth)
const updateCoupons = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Coupons_id is required in request body' });
    }
    const coupons = await Coupons.findOne({ Coupons_id: parseInt(id) });
    if (!coupons) {
      return res.status(404).json({ success: false, message: 'Coupons not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Coupons_id') {
        coupons[key] = updateData[key];
      }
    });

    coupons.UpdatedBy = userId;
    coupons.UpdatedAt = new Date();
    const updated = await coupons.save();

    const [createByUser, updatedByUser] = await Promise.all([
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null
    ]);

    const response = updated.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;

    res.status(200).json({ success: true, message: 'Coupons updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating coupons', error: error.message });
  }
};

module.exports = {
  createCoupons,
  getAllCoupons,
  getCouponsById,
  updateCoupons
};
