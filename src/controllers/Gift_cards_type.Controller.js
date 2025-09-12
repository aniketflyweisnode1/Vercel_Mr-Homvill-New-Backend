const Gift_cards_type = require('../models/Gift_cards_type.model');
const User = require('../models/User.model');

// Create Gift_cards_type (auth)
const createGiftCardsType = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      Name,
      price,
      expirydatetime
    } = req.body;

    const giftCardsType = new Gift_cards_type({
      Name,
      price: parseInt(price),
      expirydatetime: new Date(expirydatetime),
      CreateBy: userId
    });

    const saved = await giftCardsType.save();

    const createByUser = await User.findOne({ user_id: saved.CreateBy });

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;

    res.status(201).json({ success: true, message: 'Gift cards type created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating gift cards type', error: error.message });
  }
};

// Get all (public)
const getAllGiftCardsTypes = async (req, res) => {
  try {
    const giftCardsTypes = await Gift_cards_type.find({ Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(giftCardsTypes.map(async (giftCardsType) => {
      const [createByUser, updatedByUser] = await Promise.all([
        giftCardsType.CreateBy ? User.findOne({ user_id: giftCardsType.CreateBy }) : null,
        giftCardsType.UpdatedBy ? User.findOne({ user_id: giftCardsType.UpdatedBy }) : null
      ]);
      const obj = giftCardsType.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching gift cards types', error: error.message });
  }
};

// Get by id (auth)
const getGiftCardsTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const giftCardsType = await Gift_cards_type.findOne({ Gift_cards_type_id: parseInt(id) });
    if (!giftCardsType) {
      return res.status(404).json({ success: false, message: 'Gift cards type not found' });
    }
    const [createByUser, updatedByUser] = await Promise.all([
      giftCardsType.CreateBy ? User.findOne({ user_id: giftCardsType.CreateBy }) : null,
      giftCardsType.UpdatedBy ? User.findOne({ user_id: giftCardsType.UpdatedBy }) : null
    ]);
    const response = giftCardsType.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching gift cards type', error: error.message });
  }
};

// Get by auth user (auth)
const getGiftCardsTypesByAuth = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const giftCardsTypes = await Gift_cards_type.find({ CreateBy: userId, Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(giftCardsTypes.map(async (giftCardsType) => {
      const [createByUser, updatedByUser] = await Promise.all([
        giftCardsType.CreateBy ? User.findOne({ user_id: giftCardsType.CreateBy }) : null,
        giftCardsType.UpdatedBy ? User.findOne({ user_id: giftCardsType.UpdatedBy }) : null
      ]);
      const obj = giftCardsType.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching gift cards types by auth', error: error.message });
  }
};

// Update (auth)
const updateGiftCardsType = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Gift_cards_type_id is required in request body' });
    }
    const giftCardsType = await Gift_cards_type.findOne({ Gift_cards_type_id: parseInt(id) });
    if (!giftCardsType) {
      return res.status(404).json({ success: false, message: 'Gift cards type not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Gift_cards_type_id') {
        giftCardsType[key] = updateData[key];
      }
    });

    giftCardsType.UpdatedBy = userId;
    giftCardsType.UpdatedAt = new Date();
    const updated = await giftCardsType.save();

    const [createByUser, updatedByUser] = await Promise.all([
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null
    ]);

    const response = updated.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;

    res.status(200).json({ success: true, message: 'Gift cards type updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating gift cards type', error: error.message });
  }
};

module.exports = {
  createGiftCardsType,
  getAllGiftCardsTypes,
  getGiftCardsTypeById,
  getGiftCardsTypesByAuth,
  updateGiftCardsType
};
