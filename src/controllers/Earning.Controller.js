const Earning = require('../models/Earning.model');
const User = require('../models/User.model');
const Properties = require('../models/Properties.model');
const Transaction = require('../models/Transaction.model');

// Create Earning
const createEarning = async (req, res) => {
  try {
    const { seller, Buyer, Property_id, Transaction_id, Transaction_status, Status } = req.body;

    // Validate references
    const [sellerUser, buyerUser, property, transaction] = await Promise.all([
      User.findOne({ user_id: parseInt(seller) }),
      User.findOne({ user_id: parseInt(Buyer) }),
      Properties.findOne({ Properties_id: parseInt(Property_id) }),
      Transaction.findOne({ Transaction_id: parseInt(Transaction_id) })
    ]);
    if (!sellerUser) return res.status(400).json({ success: false, message: 'Seller user not found' });
    if (!buyerUser) return res.status(400).json({ success: false, message: 'Buyer user not found' });
    if (!property) return res.status(400).json({ success: false, message: 'Property not found' });
    if (!transaction) return res.status(400).json({ success: false, message: 'Transaction not found' });

    const item = new Earning({
      seller: parseInt(seller),
      Buyer: parseInt(Buyer),
      Property_id: parseInt(Property_id),
      Transaction_id: parseInt(Transaction_id),
      Transaction_status: Transaction_status || 'Panding',
      Status: typeof Status === 'boolean' ? Status : true,
      CreateBy: req.user?.user_id || null
    });

    const saved = await item.save();

    const [createByUser, sellerU, buyerU, prop, tx] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null,
      User.findOne({ user_id: saved.seller }),
      User.findOne({ user_id: saved.Buyer }),
      Properties.findOne({ Properties_id: saved.Property_id }),
      Transaction.findOne({ Transaction_id: saved.Transaction_id })
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.seller = sellerU ? { user_id: sellerU.user_id, Name: sellerU.Name, email: sellerU.email } : null;
    response.Buyer = buyerU ? { user_id: buyerU.user_id, Name: buyerU.Name, email: buyerU.email } : null;
    response.Property_id = prop ? { Properties_id: prop.Properties_id, Property_city: prop.Property_city } : null;
    response.Transaction_id = tx ? { Transaction_id: tx.Transaction_id, Amount: tx.Amount } : null;

    res.status(201).json({ success: true, message: 'Earning created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating earning', error: error.message });
  }
};

// Get all Earnings (public)
const getAllEarnings = async (req, res) => {
  try {
    const items = await Earning.find({ Status: true }).sort({ CreateAt: -1 });

    const response = await Promise.all(items.map(async (item) => {
      const [createByUser, updatedByUser, sellerU, buyerU, prop, tx] = await Promise.all([
        item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
        item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null,
        User.findOne({ user_id: item.seller }),
        User.findOne({ user_id: item.Buyer }),
        Properties.findOne({ Properties_id: item.Property_id }),
        Transaction.findOne({ Transaction_id: item.Transaction_id })
      ]);
      const obj = item.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.seller = sellerU ? { user_id: sellerU.user_id, Name: sellerU.Name, email: sellerU.email } : null;
      obj.Buyer = buyerU ? { user_id: buyerU.user_id, Name: buyerU.Name, email: buyerU.email } : null;
      obj.Property_id = prop ? { Properties_id: prop.Properties_id, Property_city: prop.Property_city } : null;
      obj.Transaction_id = tx ? { Transaction_id: tx.Transaction_id, Amount: tx.Amount } : null;
      return obj;
    }));

    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching earnings', error: error.message });
  }
};

// Get Earning by ID
const getEarningById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Earning.findOne({ Earning_id: parseInt(id) });
    if (!item) return res.status(404).json({ success: false, message: 'Earning not found' });

    const [createByUser, updatedByUser, sellerU, buyerU, prop, tx] = await Promise.all([
      item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
      item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null,
      User.findOne({ user_id: item.seller }),
      User.findOne({ user_id: item.Buyer }),
      Properties.findOne({ Properties_id: item.Property_id }),
      Transaction.findOne({ Transaction_id: item.Transaction_id })
    ]);
    const response = item.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.seller = sellerU ? { user_id: sellerU.user_id, Name: sellerU.Name, email: sellerU.email } : null;
    response.Buyer = buyerU ? { user_id: buyerU.user_id, Name: buyerU.Name, email: buyerU.email } : null;
    response.Property_id = prop ? { Properties_id: prop.Properties_id, Property_city: prop.Property_city } : null;
    response.Transaction_id = tx ? { Transaction_id: tx.Transaction_id, Amount: tx.Amount } : null;

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching earning', error: error.message });
  }
};

// Update Earning
const updateEarning = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const userId = req.user.user_id;
    if (!id) return res.status(400).json({ success: false, message: 'Earning id is required in body' });
    const item = await Earning.findOne({ Earning_id: parseInt(id) });
    if (!item) return res.status(404).json({ success: false, message: 'Earning not found' });

    // Validate refs if provided
    if (updateData.seller) {
      const u = await User.findOne({ user_id: parseInt(updateData.seller) });
      if (!u) return res.status(400).json({ success: false, message: 'Seller user not found' });
      updateData.seller = parseInt(updateData.seller);
    }
    if (updateData.Buyer) {
      const u = await User.findOne({ user_id: parseInt(updateData.Buyer) });
      if (!u) return res.status(400).json({ success: false, message: 'Buyer user not found' });
      updateData.Buyer = parseInt(updateData.Buyer);
    }
    if (updateData.Property_id) {
      const p = await Properties.findOne({ Properties_id: parseInt(updateData.Property_id) });
      if (!p) return res.status(400).json({ success: false, message: 'Property not found' });
      updateData.Property_id = parseInt(updateData.Property_id);
    }
    if (updateData.Transaction_id) {
      const t = await Transaction.findOne({ Transaction_id: parseInt(updateData.Transaction_id) });
      if (!t) return res.status(400).json({ success: false, message: 'Transaction not found' });
      updateData.Transaction_id = parseInt(updateData.Transaction_id);
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Earning_id') item[key] = updateData[key];
    });

    item.UpdatedBy = userId;
    item.UpdatedAt = new Date();
    const updated = await item.save();

    const [createByUser, updatedByUser, sellerU, buyerU, prop, tx] = await Promise.all([
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null,
      User.findOne({ user_id: updated.seller }),
      User.findOne({ user_id: updated.Buyer }),
      Properties.findOne({ Properties_id: updated.Property_id }),
      Transaction.findOne({ Transaction_id: updated.Transaction_id })
    ]);
    const response = updated.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.seller = sellerU ? { user_id: sellerU.user_id, Name: sellerU.Name, email: sellerU.email } : null;
    response.Buyer = buyerU ? { user_id: buyerU.user_id, Name: buyerU.Name, email: buyerU.email } : null;
    response.Property_id = prop ? { Properties_id: prop.Properties_id, Property_city: prop.Property_city } : null;
    response.Transaction_id = tx ? { Transaction_id: tx.Transaction_id, Amount: tx.Amount } : null;

    res.status(200).json({ success: true, message: 'Earning updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating earning', error: error.message });
  }
};

module.exports = {
  createEarning,
  getAllEarnings,
  getEarningById,
  updateEarning
};


