const Contracts_Enquiries = require('../models/Contracts_Enquiries.model');
const User = require('../models/User.model');

// Create Contracts Enquiries
const createContractsEnquiries = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { Enquiries_by_user_id, Budget_Price, Price_compare } = req.body;

    if (!Enquiries_by_user_id) {
      return res.status(400).json({ success: false, message: 'Enquiries_by_user_id is required' });
    }

    const enquiries = new Contracts_Enquiries({
      Enquiries_by_user_id,
      Budget_Price: Budget_Price ?? 0,
      Price_compare: Array.isArray(Price_compare) ? Price_compare : [],
      CreateBy: userId
    });

    const saved = await enquiries.save();

    const [enquiryUser, createByUser] = await Promise.all([
      User.findOne({ user_id: saved.Enquiries_by_user_id }),
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null
    ]);

    const response = saved.toObject();
    response.Enquiries_by_user_id = enquiryUser ? {
      user_id: enquiryUser.user_id,
      Name: enquiryUser.Name,
      email: enquiryUser.email
    } : response.Enquiries_by_user_id;
    response.CreateBy = createByUser ? {
      user_id: createByUser.user_id,
      Name: createByUser.Name,
      email: createByUser.email
    } : null;

    res.status(201).json({ success: true, message: 'Contracts enquiry created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating contracts enquiry', error: error.message });
  }
};

// Get all Contracts Enquiries (no auth per requirements; filters Status: true)
const getAllContractsEnquiries = async (req, res) => {
  try {
    const items = await Contracts_Enquiries.find({ Status: true }).sort({ CreateAt: -1 });

    const response = await Promise.all(items.map(async (item) => {
      const [enquiryUser, createByUser, updatedByUser] = await Promise.all([
        item.Enquiries_by_user_id ? User.findOne({ user_id: item.Enquiries_by_user_id }) : null,
        item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
        item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null
      ]);

      const obj = item.toObject();
      obj.Enquiries_by_user_id = enquiryUser ? { user_id: enquiryUser.user_id, Name: enquiryUser.Name, email: enquiryUser.email } : obj.Enquiries_by_user_id;
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      return obj;
    }));

    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching contracts enquiries', error: error.message });
  }
};

// Get Contracts Enquiries by ID (auth)
const getContractsEnquiriesById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Contracts_Enquiries.findOne({ Contracts_Enquiries_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Contracts enquiry not found' });
    }

    const [enquiryUser, createByUser, updatedByUser] = await Promise.all([
      item.Enquiries_by_user_id ? User.findOne({ user_id: item.Enquiries_by_user_id }) : null,
      item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
      item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null
    ]);

    const response = item.toObject();
    response.Enquiries_by_user_id = enquiryUser ? { user_id: enquiryUser.user_id, Name: enquiryUser.Name, email: enquiryUser.email } : response.Enquiries_by_user_id;
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching contracts enquiry', error: error.message });
  }
};

// Update Contracts Enquiries (auth)
const updateContractsEnquiries = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Contracts_Enquiries id is required in request body' });
    }

    const item = await Contracts_Enquiries.findOne({ Contracts_Enquiries_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Contracts enquiry not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Contracts_Enquiries_id') {
        item[key] = updateData[key];
      }
    });

    item.UpdatedBy = userId;
    item.UpdatedAt = new Date();
    const updated = await item.save();

    const [createByUser, updatedByUser, enquiryUser] = await Promise.all([
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null,
      updated.Enquiries_by_user_id ? User.findOne({ user_id: updated.Enquiries_by_user_id }) : null
    ]);

    const response = updated.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.Enquiries_by_user_id = enquiryUser ? { user_id: enquiryUser.user_id, Name: enquiryUser.Name, email: enquiryUser.email } : response.Enquiries_by_user_id;

    res.status(200).json({ success: true, message: 'Contracts enquiry updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating contracts enquiry', error: error.message });
  }
};

module.exports = {
  createContractsEnquiries,
  getAllContractsEnquiries,
  getContractsEnquiriesById,
  updateContractsEnquiries
};


