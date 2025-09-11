const Properties = require('../models/Properties.model');
const Properties_Status = require('../models/Properties_Status.model');
const Properties_Category = require('../models/Properties_Category.model');
const User = require('../models/User.model');

// Search Properties
const searchProperties = async (req, res) => {
  try {
    const {
      Properties_Category_id,
      Properties_for,
      Owner_Fist_name,
      Property_cost,
      Property_city,
      Property_state
    } = req.query;

    // Build search filter
    const filter = { Status: true };

    if (Properties_Category_id) {
      filter.Properties_Category_id = parseInt(Properties_Category_id);
    }

    if (Properties_for) {
      filter.Properties_for = Properties_for;
    }

    if (Owner_Fist_name) {
      filter.Owner_Fist_name = { $regex: Owner_Fist_name, $options: 'i' };
    }

    if (Property_cost) {
      filter.Property_cost = { $lte: parseInt(Property_cost) };
    }

    if (Property_city) {
      filter.Property_city = { $regex: Property_city, $options: 'i' };
    }

    if (Property_state) {
      filter.Property_state = { $regex: Property_state, $options: 'i' };
    }

    const properties = await Properties.find(filter).sort({ CreateAt: -1 });

    const response = await Promise.all(properties.map(async (property) => {
      const [createByUser, updatedByUser, propertiesStatus, propertiesCategory] = await Promise.all([
        property.CreateBy ? User.findOne({ user_id: property.CreateBy }) : null,
        property.UpdatedBy ? User.findOne({ user_id: property.UpdatedBy }) : null,
        property.Properties_Status_id ? Properties_Status.findOne({ Properties_Status_id: property.Properties_Status_id }) : null,
        property.Properties_Category_id ? Properties_Category.findOne({ Properties_Category_id: property.Properties_Category_id }) : null
      ]);

      const obj = property.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.Properties_Status = propertiesStatus ? { Properties_Status_id: propertiesStatus.Properties_Status_id, Properties_Status_name: propertiesStatus.Properties_Status_name } : null;
      obj.Properties_Category = propertiesCategory ? { Properties_Category_id: propertiesCategory.Properties_Category_id, Properties_Category_name: propertiesCategory.Properties_Category_name } : null;
      
      return obj;
    }));

    res.status(200).json({ 
      success: true, 
      count: response.length, 
      data: response,
      searchCriteria: {
        Properties_Category_id: Properties_Category_id || null,
        Properties_for: Properties_for || null,
        Owner_Fist_name: Owner_Fist_name || null,
        Property_cost: Property_cost || null,
        Property_city: Property_city || null,
        Property_state: Property_state || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error searching properties', error: error.message });
  }
};

module.exports = {
  searchProperties
};
