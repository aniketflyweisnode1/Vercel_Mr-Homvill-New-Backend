const Properties = require('../models/Properties.model');
const Properties_Status = require('../models/Properties_Status.model');
const Properties_Category = require('../models/Properties_Category.model');
const Payment_mode = require('../models/Payment_mode.model');
const User = require('../models/User.model');

// Create Properties
const createProperties = async (req, res) => {
  try {
    const {
      Properties_Status_id,
      Properties_Category_id,
      Properties_for,
      Owner_Fist_name,
      Owner_Last_name,
      Owner_phone_no,
      Owner_email,
      Property_cost,
      Property_year_build,
      Property_Plot_size,
      Property_finished_Sq_ft,
      Property_Bed_rooms,
      Property_Full_Baths,
      Property_OneTwo_Baths,
      Property_Address,
      Property_city,
      Property_zip,
      Property_country,
      Property_state,
      Property_Why_sell,
      Property_Reason_Selling,
      Property_Listing_Price,
      Property_Listing_plot_size,
      Property_Listing_Description,
      Property_photos,
      Appliances,
      floors,
      others,
      payment_methods,
      parking,
      Rooms,
      i_am_able_negotiate_on_Commision,
      commission_percentage,
      i_will_work_with_agent,
      i_am_only_willing_to_Directly,
      sub_Role,
      Buyers_Credit_Refund,
      open_house_Start_date,
      open_house_End_date,
      open_house_Time,
      Video_tour_link
    } = req.body;

    // Check if Properties_Status exists
    const propertiesStatus = await Properties_Status.findOne({ 
      Properties_Status_id: parseInt(Properties_Status_id) 
    });
    if (!propertiesStatus) {
      return res.status(400).json({
        success: false,
        message: 'Properties Status not found'
      });
    }

    // Check if Properties_Category exists
    const propertiesCategory = await Properties_Category.findOne({ 
      Properties_Category_id: parseInt(Properties_Category_id) 
    });
    if (!propertiesCategory) {
      return res.status(400).json({
        success: false,
        message: 'Properties Category not found'
      });
    }

    const properties = new Properties({
      Properties_Status_id: parseInt(Properties_Status_id),
      Properties_Category_id: parseInt(Properties_Category_id),
      Properties_for,
      Owner_Fist_name,
      Owner_Last_name,
      Owner_phone_no,
      Owner_email,
      Property_cost,
      Property_year_build,
      Property_Plot_size,
      Property_finished_Sq_ft,
      Property_Bed_rooms,
      Property_Full_Baths,
      Property_OneTwo_Baths,
      Property_Address,
      Property_city,
      Property_zip,
      Property_country,
      Property_state,
      Property_Why_sell,
      Property_Reason_Selling: Property_Reason_Selling || [],
      Property_Listing_Price,
      Property_Listing_plot_size,
      Property_Listing_Description,
      Property_photos: Property_photos || [],
      Appliances: Appliances || [],
      floors: floors || [],
      others: others || [],
      payment_methods: payment_methods || [],
      parking: parking || [],
      Rooms: Rooms || [],
      i_am_able_negotiate_on_Commision: i_am_able_negotiate_on_Commision || false,
      commission_percentage: commission_percentage || 0,
      i_will_work_with_agent: i_will_work_with_agent || false,
      i_am_only_willing_to_Directly: i_am_only_willing_to_Directly || false,
      sub_Role: sub_Role || 'owner',
      Buyers_Credit_Refund: Buyers_Credit_Refund || 'Yes',
      open_house_Start_date: open_house_Start_date || null,
      open_house_End_date: open_house_End_date || null,
      open_house_Time: open_house_Time || null,
      Video_tour_link: Video_tour_link || [],
      CreateBy: req.user?.user_id || null
    });

    const savedProperties = await properties.save();
    
    // Fetch related data
    const [statusData, categoryData, createByUser] = await Promise.all([
      Properties_Status.findOne({ Properties_Status_id: savedProperties.Properties_Status_id }),
      Properties_Category.findOne({ Properties_Category_id: savedProperties.Properties_Category_id }),
      savedProperties.CreateBy ? User.findOne({ user_id: savedProperties.CreateBy }) : null
    ]);

    // Fetch payment methods data
    const paymentMethodsData = savedProperties.payment_methods && savedProperties.payment_methods.length > 0 
      ? await Payment_mode.find({ Payment_mode_id: { $in: savedProperties.payment_methods } })
      : [];

    const response = savedProperties.toObject();
    response.Properties_Status_id = statusData ? { 
      Properties_Status_id: statusData.Properties_Status_id, 
      Pro_Status: statusData.Pro_Status 
    } : null;
    response.Properties_Category_id = categoryData ? { 
      Properties_Category_id: categoryData.Properties_Category_id, 
      name: categoryData.name 
    } : null;
    response.payment_methods = paymentMethodsData.map(payment => ({
      Payment_mode_id: payment.Payment_mode_id,
      name: payment.name
    }));
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
    } : null;
    
    res.status(201).json({
      success: true,
      message: 'Properties created successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating properties',
      error: error.message
    });
  }
};

// Get All Properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await Properties.find({ Status: true })
      .sort({ CreateAt: -1 });

    const propertiesResponse = await Promise.all(properties.map(async (property) => {
      const [statusData, categoryData, createByUser, updatedByUser] = await Promise.all([
        Properties_Status.findOne({ Properties_Status_id: property.Properties_Status_id }),
        Properties_Category.findOne({ Properties_Category_id: property.Properties_Category_id }),
        property.CreateBy ? User.findOne({ user_id: property.CreateBy }) : null,
        property.UpdatedBy ? User.findOne({ user_id: property.UpdatedBy }) : null
      ]);

      const propertyObj = property.toObject();
      propertyObj.Properties_Status_id = statusData ? { 
        Properties_Status_id: statusData.Properties_Status_id, 
        Pro_Status: statusData.Pro_Status 
      } : null;
      propertyObj.Properties_Category_id = categoryData ? { 
        Properties_Category_id: categoryData.Properties_Category_id, 
        name: categoryData.name 
      } : null;
      propertyObj.CreateBy = createByUser ? { 
        user_id: createByUser.user_id, 
        Name: createByUser.Name, 
        email: createByUser.email 
      } : null;
      propertyObj.UpdatedBy = updatedByUser ? { 
        user_id: updatedByUser.user_id, 
        Name: updatedByUser.Name, 
        email: updatedByUser.email 
      } : null;
      return propertyObj;
    }));

    res.status(200).json({
      success: true,
      count: propertiesResponse.length,
      data: propertiesResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message
    });
  }
};

// Get Properties by ID
const getPropertiesById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const property = await Properties.findOne({ 
      Properties_id: parseInt(id) 
    });
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Properties not found'
      });
    }

    const [statusData, categoryData, createByUser, updatedByUser] = await Promise.all([
      Properties_Status.findOne({ Properties_Status_id: property.Properties_Status_id }),
      Properties_Category.findOne({ Properties_Category_id: property.Properties_Category_id }),
      property.CreateBy ? User.findOne({ user_id: property.CreateBy }) : null,
      property.UpdatedBy ? User.findOne({ user_id: property.UpdatedBy }) : null
    ]);

    // Fetch payment methods data
    const paymentMethodsData = property.payment_methods && property.payment_methods.length > 0 
      ? await Payment_mode.find({ Payment_mode_id: { $in: property.payment_methods } })
      : [];

    const response = property.toObject();
    response.Properties_Status_id = statusData ? { 
      Properties_Status_id: statusData.Properties_Status_id, 
      Pro_Status: statusData.Pro_Status 
    } : null;
    response.Properties_Category_id = categoryData ? { 
      Properties_Category_id: categoryData.Properties_Category_id, 
      name: categoryData.name 
    } : null;
    response.payment_methods = paymentMethodsData.map(payment => ({
      Payment_mode_id: payment.Payment_mode_id,
      name: payment.name
    }));
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
    } : null;
    response.UpdatedBy = updatedByUser ? { 
      user_id: updatedByUser.user_id, 
      Name: updatedByUser.Name, 
      email: updatedByUser.email 
    } : null;

    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message
    });
  }
};

// Update Properties
const updateProperties = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const userId = req.user.user_id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Properties ID is required in request body'
      });
    }

    const property = await Properties.findOne({ 
      Properties_id: parseInt(id) 
    });
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Properties not found'
      });
    }

    // Check if Properties_Status is being updated and if it exists
    if (updateData.Properties_Status_id) {
      const propertiesStatus = await Properties_Status.findOne({ 
        Properties_Status_id: parseInt(updateData.Properties_Status_id) 
      });
      if (!propertiesStatus) {
        return res.status(400).json({
          success: false,
          message: 'Properties Status not found'
        });
      }
    }

    // Check if Properties_Category is being updated and if it exists
    if (updateData.Properties_Category_id) {
      const propertiesCategory = await Properties_Category.findOne({ 
        Properties_Category_id: parseInt(updateData.Properties_Category_id) 
      });
      if (!propertiesCategory) {
        return res.status(400).json({
          success: false,
          message: 'Properties Category not found'
        });
      }
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key !== 'Properties_id') {
        if (key === 'Properties_Status_id' || key === 'Properties_Category_id') {
          property[key] = parseInt(updateData[key]);
        } else {
          property[key] = updateData[key];
        }
      }
    });

    property.UpdatedBy = userId;
    property.UpdatedAt = new Date();

    const updatedProperty = await property.save();
    
    const [statusData, categoryData, createByUser, updatedByUser] = await Promise.all([
      Properties_Status.findOne({ Properties_Status_id: updatedProperty.Properties_Status_id }),
      Properties_Category.findOne({ Properties_Category_id: updatedProperty.Properties_Category_id }),
      updatedProperty.CreateBy ? User.findOne({ user_id: updatedProperty.CreateBy }) : null,
      updatedProperty.UpdatedBy ? User.findOne({ user_id: updatedProperty.UpdatedBy }) : null
    ]);

    // Fetch payment methods data
    const paymentMethodsData = updatedProperty.payment_methods && updatedProperty.payment_methods.length > 0 
      ? await Payment_mode.find({ Payment_mode_id: { $in: updatedProperty.payment_methods } })
      : [];

    const response = updatedProperty.toObject();
    response.Properties_Status_id = statusData ? { 
      Properties_Status_id: statusData.Properties_Status_id, 
      Pro_Status: statusData.Pro_Status 
    } : null;
    response.Properties_Category_id = categoryData ? { 
      Properties_Category_id: categoryData.Properties_Category_id, 
      name: categoryData.name 
    } : null;
    response.payment_methods = paymentMethodsData.map(payment => ({
      Payment_mode_id: payment.Payment_mode_id,
      name: payment.name
    }));
    response.CreateBy = createByUser ? { 
      user_id: createByUser.user_id, 
      Name: createByUser.Name, 
      email: createByUser.email 
    } : null;
    response.UpdatedBy = updatedByUser ? { 
      user_id: updatedByUser.user_id, 
      Name: updatedByUser.Name, 
      email: updatedByUser.email 
    } : null;
    
    res.status(200).json({
      success: true,
      message: 'Properties updated successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating properties',
      error: error.message
    });
  }
};

// Delete Properties (hard delete)
const deleteProperties = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Properties.findOne({ 
      Properties_id: parseInt(id) 
    });
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Properties not found'
      });
    }

    await Properties.findOneAndDelete({ 
      Properties_id: parseInt(id) 
    });

    res.status(200).json({
      success: true,
      message: 'Properties deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting properties',
      error: error.message
    });
  }
};

// Soft Delete Properties (deactivate)
const softDeleteProperties = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const property = await Properties.findOne({ 
      Properties_id: parseInt(id) 
    });
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Properties not found'
      });
    }

    property.Status = false;
    property.UpdatedBy = userId;
    property.UpdatedAt = new Date();
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Properties deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating properties',
      error: error.message
    });
  }
};

module.exports = {
  createProperties,
  getAllProperties,
  getPropertiesById,
  updateProperties,
  deleteProperties,
  softDeleteProperties
};
