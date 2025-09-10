const Banners = require('../models/Banners.model');
const User = require('../models/User.model');

// Create Banner (auth)
const createBanner = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      FaceBook_link,
      instagram_link,
      website_link,
      twitter_link,
      banner_image,
      headline,
      Catetory_id,
      Sub_role_id,
      publishingDate,
      Description
    } = req.body;

    const item = new Banners({
      FaceBook_link: FaceBook_link ?? null,
      instagram_link: instagram_link ?? null,
      website_link: website_link ?? null,
      twitter_link: twitter_link ?? null,
      banner_image: banner_image ?? null,
      headline: headline ?? null,
      Catetory_id: Catetory_id ?? null,
      Sub_role_id: Sub_role_id ?? null,
      publishingDate: publishingDate ?? null,
      Description: Description ?? null,
      CreateBy: userId
    });

    const saved = await item.save();

    const [createByUser] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;

    res.status(201).json({ success: true, message: 'Banner created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating banner', error: error.message });
  }
};

// Get all (public)
const getAllBanners = async (req, res) => {
  try {
    const items = await Banners.find({ Status: true }).sort({ CreateAt: -1 });
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
    res.status(500).json({ success: false, message: 'Error fetching banners', error: error.message });
  }
};

// Get by id (auth)
const getBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Banners.findOne({ Banners_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
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
    res.status(500).json({ success: false, message: 'Error fetching banner', error: error.message });
  }
};

// Update (auth)
const updateBanner = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Banners id is required in request body' });
    }
    const item = await Banners.findOne({ Banners_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Banners_id') {
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

    res.status(200).json({ success: true, message: 'Banner updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating banner', error: error.message });
  }
};

module.exports = {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner
};


