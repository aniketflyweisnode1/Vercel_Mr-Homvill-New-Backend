const PromoMapUser = require('../models/Promo_code_map_user.model');
const PromoCode = require('../models/Promo_Code.model');
const User = require('../models/User.model');

// Create mapping
const createPromoMapUser = async (req, res) => {
  try {
    const { PromoCode_id, user_id, Status } = req.body;

    const [promo, user] = await Promise.all([
      PromoCode.findOne({ Promo_Code_id: parseInt(PromoCode_id) }),
      User.findOne({ user_id: parseInt(user_id) })
    ]);
    if (!promo) return res.status(400).json({ success: false, message: 'Promo code not found' });
    if (!user) return res.status(400).json({ success: false, message: 'User not found' });

    const item = new PromoMapUser({
      PromoCode_id: parseInt(PromoCode_id),
      user_id: parseInt(user_id),
      Status: typeof Status === 'boolean' ? Status : true,
      CreateBy: req.user?.user_id || null
    });

    const saved = await item.save();

    const [createByUser, promoDoc, userDoc] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null,
      PromoCode.findOne({ Promo_Code_id: saved.PromoCode_id }),
      User.findOne({ user_id: saved.user_id })
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.PromoCode_id = promoDoc ? { Promo_Code_id: promoDoc.Promo_Code_id, Coupon_code: promoDoc.Coupon_code } : null;
    response.user_id = userDoc ? { user_id: userDoc.user_id, Name: userDoc.Name, email: userDoc.email } : null;
    res.status(201).json({ success: true, message: 'Promo code mapped to user successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating promo map user', error: error.message });
  }
};

// Get all (public)
const getAllPromoMapUsers = async (req, res) => {
  try {
    const items = await PromoMapUser.find({ Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(items.map(async (item) => {
      const [createByUser, updatedByUser, promoDoc, userDoc] = await Promise.all([
        item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
        item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null,
        PromoCode.findOne({ Promo_Code_id: item.PromoCode_id }),
        User.findOne({ user_id: item.user_id })
      ]);
      const obj = item.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.PromoCode_id = promoDoc ? { Promo_Code_id: promoDoc.Promo_Code_id, Coupon_code: promoDoc.Coupon_code } : null;
      obj.user_id = userDoc ? { user_id: userDoc.user_id, Name: userDoc.Name, email: userDoc.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching promo map users', error: error.message });
  }
};

// Get by auth user
const getPromoMapUsersByAuth = async (req, res) => {
  try {
    const authUserId = req.user.user_id;
    const items = await PromoMapUser.find({ user_id: authUserId }).sort({ CreateAt: -1 });
    const response = await Promise.all(items.map(async (item) => {
      const [createByUser, updatedByUser, promoDoc] = await Promise.all([
        item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
        item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null,
        PromoCode.findOne({ Promo_Code_id: item.PromoCode_id })
      ]);
      const obj = item.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.user_id = { user_id: authUserId };
      obj.PromoCode_id = promoDoc ? { Promo_Code_id: promoDoc.Promo_Code_id, Coupon_code: promoDoc.Coupon_code } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user promo maps', error: error.message });
  }
};

// Get by id
const getPromoMapUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await PromoMapUser.findOne({ Promo_Map_user_id: parseInt(id) });
    if (!item) return res.status(404).json({ success: false, message: 'Promo map user not found' });
    const [createByUser, updatedByUser, promoDoc, userDoc] = await Promise.all([
      item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
      item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null,
      PromoCode.findOne({ Promo_Code_id: item.PromoCode_id }),
      User.findOne({ user_id: item.user_id })
    ]);
    const response = item.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.PromoCode_id = promoDoc ? { Promo_Code_id: promoDoc.Promo_Code_id, Coupon_code: promoDoc.Coupon_code } : null;
    response.user_id = userDoc ? { user_id: userDoc.user_id, Name: userDoc.Name, email: userDoc.email } : null;
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching promo map user', error: error.message });
  }
};

// Update
const updatePromoMapUser = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const userId = req.user.user_id;
    if (!id) return res.status(400).json({ success: false, message: 'Promo_Map_user id is required in body' });
    const item = await PromoMapUser.findOne({ Promo_Map_user_id: parseInt(id) });
    if (!item) return res.status(404).json({ success: false, message: 'Promo map user not found' });

    if (updateData.PromoCode_id) {
      const promo = await PromoCode.findOne({ Promo_Code_id: parseInt(updateData.PromoCode_id) });
      if (!promo) return res.status(400).json({ success: false, message: 'Promo code not found' });
      updateData.PromoCode_id = parseInt(updateData.PromoCode_id);
    }
    if (updateData.user_id) {
      const user = await User.findOne({ user_id: parseInt(updateData.user_id) });
      if (!user) return res.status(400).json({ success: false, message: 'User not found' });
      updateData.user_id = parseInt(updateData.user_id);
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Promo_Map_user_id') item[key] = updateData[key];
    });

    item.UpdatedBy = userId;
    item.UpdatedAt = new Date();
    const updated = await item.save();

    const [createByUser, updatedByUser, promoDoc, userDoc] = await Promise.all([
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null,
      PromoCode.findOne({ Promo_Code_id: updated.PromoCode_id }),
      User.findOne({ user_id: updated.user_id })
    ]);
    const response = updated.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.PromoCode_id = promoDoc ? { Promo_Code_id: promoDoc.Promo_Code_id, Coupon_code: promoDoc.Coupon_code } : null;
    response.user_id = userDoc ? { user_id: userDoc.user_id, Name: userDoc.Name, email: userDoc.email } : null;
    res.status(200).json({ success: true, message: 'Promo map user updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating promo map user', error: error.message });
  }
};

module.exports = {
  createPromoMapUser,
  getAllPromoMapUsers,
  getPromoMapUsersByAuth,
  getPromoMapUserById,
  updatePromoMapUser
};


