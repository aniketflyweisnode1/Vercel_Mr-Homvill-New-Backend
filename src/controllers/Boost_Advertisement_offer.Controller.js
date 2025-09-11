const Boost_Advertisement_offer = require('../models/Boost_Advertisement_offer.model');
const User = require('../models/User.model');

// Create Boost_Advertisement_offer (auth)
const createBoostAdvertisementOffer = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      Advertisement_offer
    } = req.body;

    const item = new Boost_Advertisement_offer({
      Advertisement_offer: Advertisement_offer ?? null,
      CreateBy: userId
    });

    const saved = await item.save();

    const [createByUser] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;

    res.status(201).json({ success: true, message: 'Boost Advertisement Offer created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating boost advertisement offer', error: error.message });
  }
};

// Get all (public)
const getAllBoostAdvertisementOffers = async (req, res) => {
  try {
    const items = await Boost_Advertisement_offer.find({ Status: true }).sort({ CreateAt: -1 });
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
    res.status(500).json({ success: false, message: 'Error fetching boost advertisement offers', error: error.message });
  }
};

// Get by id (auth)
const getBoostAdvertisementOfferById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Boost_Advertisement_offer.findOne({ Advertisement_offer_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Boost Advertisement Offer not found' });
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
    res.status(500).json({ success: false, message: 'Error fetching boost advertisement offer', error: error.message });
  }
};

// Update (auth)
const updateBoostAdvertisementOffer = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Advertisement_offer_id is required in request body' });
    }
    const item = await Boost_Advertisement_offer.findOne({ Advertisement_offer_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Boost Advertisement Offer not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Advertisement_offer_id') {
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

    res.status(200).json({ success: true, message: 'Boost Advertisement Offer updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating boost advertisement offer', error: error.message });
  }
};

module.exports = {
  createBoostAdvertisementOffer,
  getAllBoostAdvertisementOffers,
  getBoostAdvertisementOfferById,
  updateBoostAdvertisementOffer
};
