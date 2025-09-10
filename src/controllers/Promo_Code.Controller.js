const PromoCode = require('../models/Promo_Code.model');
const Area = require('../models/Area.model');
const User = require('../models/User.model');

// Create Promo Code
const createPromoCode = async (req, res) => {
  try {
    const {
      offer_name,
      Coupon_code,
      Coupon_type,
      Coupon_count_used,
      use_Per_user,
      Select_area_id,
      visibility,
      Diescount_type,
      Discount_amount,
      StartDate,
      StartTime,
      EndDate,
      EndTime,
      Status
    } = req.body;

    // Validate area
    const area = await Area.findOne({ Area_id: parseInt(Select_area_id) });
    if (!area) return res.status(400).json({ success: false, message: 'Area not found' });

    const item = new PromoCode({
      offer_name,
      Coupon_code,
      Coupon_type,
      Coupon_count_used: Coupon_count_used || 0,
      use_Per_user: use_Per_user || 1,
      Select_area_id: parseInt(Select_area_id),
      visibility: typeof visibility === 'boolean' ? visibility : true,
      Diescount_type,
      Discount_amount,
      StartDate,
      StartTime,
      EndDate,
      EndTime,
      Status: typeof Status === 'boolean' ? Status : true,
      CreateBy: req.user?.user_id || null
    });

    const saved = await item.save();

    const [createByUser, areaDoc] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null,
      Area.findOne({ Area_id: saved.Select_area_id })
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.Select_area_id = areaDoc ? { Area_id: areaDoc.Area_id, Area_name: areaDoc.Area_name } : null;

    res.status(201).json({ success: true, message: 'Promo code created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating promo code', error: error.message });
  }
};

// Get all Promo Codes (public)
const getAllPromoCodes = async (req, res) => {
  try {
    const items = await PromoCode.find({ Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(items.map(async (item) => {
      const [createByUser, updatedByUser, areaDoc] = await Promise.all([
        item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
        item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null,
        Area.findOne({ Area_id: item.Select_area_id })
      ]);
      const obj = item.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.Select_area_id = areaDoc ? { Area_id: areaDoc.Area_id, Area_name: areaDoc.Area_name } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching promo codes', error: error.message });
  }
};

// Get Promo Code by ID
const getPromoCodeById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await PromoCode.findOne({ Promo_Code_id: parseInt(id) });
    if (!item) return res.status(404).json({ success: false, message: 'Promo code not found' });
    const [createByUser, updatedByUser, areaDoc] = await Promise.all([
      item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
      item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null,
      Area.findOne({ Area_id: item.Select_area_id })
    ]);
    const response = item.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.Select_area_id = areaDoc ? { Area_id: areaDoc.Area_id, Area_name: areaDoc.Area_name } : null;
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching promo code', error: error.message });
  }
};

// Update Promo Code
const updatePromoCode = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const userId = req.user.user_id;
    if (!id) return res.status(400).json({ success: false, message: 'Promo_Code id is required in body' });
    const item = await PromoCode.findOne({ Promo_Code_id: parseInt(id) });
    if (!item) return res.status(404).json({ success: false, message: 'Promo code not found' });

    if (updateData.Select_area_id) {
      const area = await Area.findOne({ Area_id: parseInt(updateData.Select_area_id) });
      if (!area) return res.status(400).json({ success: false, message: 'Area not found' });
      updateData.Select_area_id = parseInt(updateData.Select_area_id);
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Promo_Code_id') item[key] = updateData[key];
    });

    item.UpdatedBy = userId;
    item.UpdatedAt = new Date();
    const updated = await item.save();

    const [createByUser, updatedByUser, areaDoc] = await Promise.all([
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null,
      Area.findOne({ Area_id: updated.Select_area_id })
    ]);
    const response = updated.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.Select_area_id = areaDoc ? { Area_id: areaDoc.Area_id, Area_name: areaDoc.Area_name } : null;
    res.status(200).json({ success: true, message: 'Promo code updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating promo code', error: error.message });
  }
};

module.exports = {
  createPromoCode,
  getAllPromoCodes,
  getPromoCodeById,
  updatePromoCode
};


