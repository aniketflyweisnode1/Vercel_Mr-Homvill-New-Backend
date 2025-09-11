const Boost_Properties = require('../models/Boost_Properties.model');
const Boost_Advertisement_plan = require('../models/Boost_Advertisement_plan.model');
const Boost_Advertisement_offer = require('../models/Boost_Advertisement_offer.model');
const Properties = require('../models/Properties.model');
const User = require('../models/User.model');

// Create Boost_Properties (auth)
const createBoostProperties = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      Advertisement_plan_id,
      Advertisement_offer_id,
      Properties_id
    } = req.body;

    // Get the advertisement plan to calculate Active_day_limit
    const advertisementPlan = await Boost_Advertisement_plan.findOne({ 
      Advertisement_plan_id: parseInt(Advertisement_plan_id) 
    });
    
    if (!advertisementPlan) {
      return res.status(400).json({ 
        success: false, 
        message: 'Advertisement plan not found' 
      });
    }

    // Calculate Active_day_limit based on Active_duration and Type
    let activeDayLimit = 0;
    if (advertisementPlan.Type === 'Months') {
      activeDayLimit = advertisementPlan.Active_duration * 30; // Approximate days in a month
    } else if (advertisementPlan.Type === 'Year') {
      activeDayLimit = advertisementPlan.Active_duration * 365; // Days in a year
    }

    const item = new Boost_Properties({
      Advertisement_plan_id: parseInt(Advertisement_plan_id),
      Advertisement_offer_id: parseInt(Advertisement_offer_id),
      Properties_id: parseInt(Properties_id),
      Active_day_limit: activeDayLimit,
      CreateBy: userId
    });

    const saved = await item.save();

    const [createByUser, advertisementPlanData, advertisementOfferData, propertiesData] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null,
      saved.Advertisement_plan_id ? Boost_Advertisement_plan.findOne({ Advertisement_plan_id: saved.Advertisement_plan_id }) : null,
      saved.Advertisement_offer_id ? Boost_Advertisement_offer.findOne({ Advertisement_offer_id: saved.Advertisement_offer_id }) : null,
      saved.Properties_id ? Properties.findOne({ Properties_id: saved.Properties_id }) : null
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.Advertisement_plan = advertisementPlanData ? { Advertisement_plan_id: advertisementPlanData.Advertisement_plan_id, Price: advertisementPlanData.Price, Active_duration: advertisementPlanData.Active_duration, Type: advertisementPlanData.Type } : null;
    response.Advertisement_offer = advertisementOfferData ? { Advertisement_offer_id: advertisementOfferData.Advertisement_offer_id, Advertisement_offer: advertisementOfferData.Advertisement_offer } : null;
    response.Properties = propertiesData ? { Properties_id: propertiesData.Properties_id, Owner_Fist_name: propertiesData.Owner_Fist_name, Property_cost: propertiesData.Property_cost } : null;

    res.status(201).json({ success: true, message: 'Boost Properties created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating boost properties', error: error.message });
  }
};

// Get all (public)
const getAllBoostProperties = async (req, res) => {
  try {
    const items = await Boost_Properties.find({ Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(items.map(async (item) => {
      const [createByUser, updatedByUser, advertisementPlanData, advertisementOfferData, propertiesData] = await Promise.all([
        item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
        item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null,
        item.Advertisement_plan_id ? Boost_Advertisement_plan.findOne({ Advertisement_plan_id: item.Advertisement_plan_id }) : null,
        item.Advertisement_offer_id ? Boost_Advertisement_offer.findOne({ Advertisement_offer_id: item.Advertisement_offer_id }) : null,
        item.Properties_id ? Properties.findOne({ Properties_id: item.Properties_id }) : null
      ]);
      const obj = item.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.Advertisement_plan = advertisementPlanData ? { Advertisement_plan_id: advertisementPlanData.Advertisement_plan_id, Price: advertisementPlanData.Price, Active_duration: advertisementPlanData.Active_duration, Type: advertisementPlanData.Type } : null;
      obj.Advertisement_offer = advertisementOfferData ? { Advertisement_offer_id: advertisementOfferData.Advertisement_offer_id, Advertisement_offer: advertisementOfferData.Advertisement_offer } : null;
      obj.Properties = propertiesData ? { Properties_id: propertiesData.Properties_id, Owner_Fist_name: propertiesData.Owner_Fist_name, Property_cost: propertiesData.Property_cost } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching boost properties', error: error.message });
  }
};

// Get by id (auth)
const getBoostPropertiesById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Boost_Properties.findOne({ Boost_Properties_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Boost Properties not found' });
    }
    const [createByUser, updatedByUser, advertisementPlanData, advertisementOfferData, propertiesData] = await Promise.all([
      item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
      item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null,
      item.Advertisement_plan_id ? Boost_Advertisement_plan.findOne({ Advertisement_plan_id: item.Advertisement_plan_id }) : null,
      item.Advertisement_offer_id ? Boost_Advertisement_offer.findOne({ Advertisement_offer_id: item.Advertisement_offer_id }) : null,
      item.Properties_id ? Properties.findOne({ Properties_id: item.Properties_id }) : null
    ]);
    const response = item.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.Advertisement_plan = advertisementPlanData ? { Advertisement_plan_id: advertisementPlanData.Advertisement_plan_id, Price: advertisementPlanData.Price, Active_duration: advertisementPlanData.Active_duration, Type: advertisementPlanData.Type } : null;
    response.Advertisement_offer = advertisementOfferData ? { Advertisement_offer_id: advertisementOfferData.Advertisement_offer_id, Advertisement_offer: advertisementOfferData.Advertisement_offer } : null;
    response.Properties = propertiesData ? { Properties_id: propertiesData.Properties_id, Owner_Fist_name: propertiesData.Owner_Fist_name, Property_cost: propertiesData.Property_cost } : null;
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching boost properties', error: error.message });
  }
};

// Update (auth)
const updateBoostProperties = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Boost_Properties_id is required in request body' });
    }
    const item = await Boost_Properties.findOne({ Boost_Properties_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Boost Properties not found' });
    }

    // If Advertisement_plan_id is being updated, recalculate Active_day_limit
    if (updateData.Advertisement_plan_id) {
      const advertisementPlan = await Boost_Advertisement_plan.findOne({ 
        Advertisement_plan_id: parseInt(updateData.Advertisement_plan_id) 
      });
      
      if (advertisementPlan) {
        let activeDayLimit = 0;
        if (advertisementPlan.Type === 'Months') {
          activeDayLimit = advertisementPlan.Active_duration * 30;
        } else if (advertisementPlan.Type === 'Year') {
          activeDayLimit = advertisementPlan.Active_duration * 365;
        }
        updateData.Active_day_limit = activeDayLimit;
      }
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'Boost_Properties_id') {
        item[key] = updateData[key];
      }
    });

    item.UpdatedBy = userId;
    item.UpdatedAt = new Date();
    const updated = await item.save();

    const [createByUser, updatedByUser, advertisementPlanData, advertisementOfferData, propertiesData] = await Promise.all([
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null,
      updated.Advertisement_plan_id ? Boost_Advertisement_plan.findOne({ Advertisement_plan_id: updated.Advertisement_plan_id }) : null,
      updated.Advertisement_offer_id ? Boost_Advertisement_offer.findOne({ Advertisement_offer_id: updated.Advertisement_offer_id }) : null,
      updated.Properties_id ? Properties.findOne({ Properties_id: updated.Properties_id }) : null
    ]);

    const response = updated.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.Advertisement_plan = advertisementPlanData ? { Advertisement_plan_id: advertisementPlanData.Advertisement_plan_id, Price: advertisementPlanData.Price, Active_duration: advertisementPlanData.Active_duration, Type: advertisementPlanData.Type } : null;
    response.Advertisement_offer = advertisementOfferData ? { Advertisement_offer_id: advertisementOfferData.Advertisement_offer_id, Advertisement_offer: advertisementOfferData.Advertisement_offer } : null;
    response.Properties = propertiesData ? { Properties_id: propertiesData.Properties_id, Owner_Fist_name: propertiesData.Owner_Fist_name, Property_cost: propertiesData.Property_cost } : null;

    res.status(200).json({ success: true, message: 'Boost Properties updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating boost properties', error: error.message });
  }
};

module.exports = {
  createBoostProperties,
  getAllBoostProperties,
  getBoostPropertiesById,
  updateBoostProperties
};
