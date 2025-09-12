const Gift_cards_Map_user = require('../models/Gift_cards_Map_user.model');
const Gift_cards_type = require('../models/Gift_cards_type.model');
const User = require('../models/User.model');

// Create Gift_cards_Map_user (auth)
const createGiftCardsMapUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      Gift_cards_type_id,
      user_id
    } = req.body;

    const giftCardsMapUser = new Gift_cards_Map_user({
      Gift_cards_type_id: parseInt(Gift_cards_type_id),
      user_id: parseInt(user_id),
      CreateBy: userId
    });

    const saved = await giftCardsMapUser.save();

    const [createByUser, giftCardsTypeData, mappedUser] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null,
      saved.Gift_cards_type_id ? Gift_cards_type.findOne({ Gift_cards_type_id: saved.Gift_cards_type_id }) : null,
      saved.user_id ? User.findOne({ user_id: saved.user_id }) : null
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.Gift_cards_type = giftCardsTypeData ? { Gift_cards_type_id: giftCardsTypeData.Gift_cards_type_id, Name: giftCardsTypeData.Name, price: giftCardsTypeData.price, expirydatetime: giftCardsTypeData.expirydatetime } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;

    res.status(201).json({ success: true, message: 'Gift cards map user created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating gift cards map user', error: error.message });
  }
};

// Get all (public)
const getAllGiftCardsMapUsers = async (req, res) => {
  try {
    const giftCardsMapUsers = await Gift_cards_Map_user.find({ Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(giftCardsMapUsers.map(async (giftCardsMapUser) => {
      const [createByUser, updatedByUser, giftCardsTypeData, mappedUser] = await Promise.all([
        giftCardsMapUser.CreateBy ? User.findOne({ user_id: giftCardsMapUser.CreateBy }) : null,
        giftCardsMapUser.UpdatedBy ? User.findOne({ user_id: giftCardsMapUser.UpdatedBy }) : null,
        giftCardsMapUser.Gift_cards_type_id ? Gift_cards_type.findOne({ Gift_cards_type_id: giftCardsMapUser.Gift_cards_type_id }) : null,
        giftCardsMapUser.user_id ? User.findOne({ user_id: giftCardsMapUser.user_id }) : null
      ]);
      const obj = giftCardsMapUser.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.Gift_cards_type = giftCardsTypeData ? { Gift_cards_type_id: giftCardsTypeData.Gift_cards_type_id, Name: giftCardsTypeData.Name, price: giftCardsTypeData.price, expirydatetime: giftCardsTypeData.expirydatetime } : null;
      obj.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching gift cards map users', error: error.message });
  }
};

// Get by id (auth)
const getGiftCardsMapUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const giftCardsMapUser = await Gift_cards_Map_user.findOne({ Gift_cards_Map_user_id: parseInt(id) });
    if (!giftCardsMapUser) {
      return res.status(404).json({ success: false, message: 'Gift cards map user not found' });
    }
    const [createByUser, updatedByUser, giftCardsTypeData, mappedUser] = await Promise.all([
      giftCardsMapUser.CreateBy ? User.findOne({ user_id: giftCardsMapUser.CreateBy }) : null,
      giftCardsMapUser.UpdatedBy ? User.findOne({ user_id: giftCardsMapUser.UpdatedBy }) : null,
      giftCardsMapUser.Gift_cards_type_id ? Gift_cards_type.findOne({ Gift_cards_type_id: giftCardsMapUser.Gift_cards_type_id }) : null,
      giftCardsMapUser.user_id ? User.findOne({ user_id: giftCardsMapUser.user_id }) : null
    ]);
    const response = giftCardsMapUser.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.Gift_cards_type = giftCardsTypeData ? { Gift_cards_type_id: giftCardsTypeData.Gift_cards_type_id, Name: giftCardsTypeData.Name, price: giftCardsTypeData.price, expirydatetime: giftCardsTypeData.expirydatetime } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching gift cards map user', error: error.message });
  }
};

// Update (auth)
const updateGiftCardsMapUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Gift_cards_Map_user_id is required in request body' });
    }
    const giftCardsMapUser = await Gift_cards_Map_user.findOne({ Gift_cards_Map_user_id: parseInt(id) });
    if (!giftCardsMapUser) {
      return res.status(404).json({ success: false, message: 'Gift cards map user not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Gift_cards_Map_user_id') {
        giftCardsMapUser[key] = updateData[key];
      }
    });

    giftCardsMapUser.UpdatedBy = userId;
    giftCardsMapUser.UpdatedAt = new Date();
    const updated = await giftCardsMapUser.save();

    const [createByUser, updatedByUser, giftCardsTypeData, mappedUser] = await Promise.all([
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null,
      updated.Gift_cards_type_id ? Gift_cards_type.findOne({ Gift_cards_type_id: updated.Gift_cards_type_id }) : null,
      updated.user_id ? User.findOne({ user_id: updated.user_id }) : null
    ]);

    const response = updated.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.Gift_cards_type = giftCardsTypeData ? { Gift_cards_type_id: giftCardsTypeData.Gift_cards_type_id, Name: giftCardsTypeData.Name, price: giftCardsTypeData.price, expirydatetime: giftCardsTypeData.expirydatetime } : null;
    response.user_id = mappedUser ? { user_id: mappedUser.user_id, Name: mappedUser.Name, email: mappedUser.email } : null;

    res.status(200).json({ success: true, message: 'Gift cards map user updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating gift cards map user', error: error.message });
  }
};

module.exports = {
  createGiftCardsMapUser,
  getAllGiftCardsMapUsers,
  getGiftCardsMapUserById,
  updateGiftCardsMapUser
};
