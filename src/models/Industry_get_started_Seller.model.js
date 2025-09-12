const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const industryGetStartedSellerSchema = new mongoose.Schema({
  Industry_get_started_Seller_id: {
    type: Number,
    unique: true
  },
  YourType: {
    type: String,
    required: true
  },
  Type_industry_Role: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    required: true
  },
  email_address: {
    type: String,
    required: true
  },
  size_of_organization: {
    type: String,
    required: true
  },
  user_id: {
    type: Number,
    ref: 'User',
    required: true
  },
  Status: {
    type: Boolean,
    default: true
  },
  CreateBy: {
    type: Number,
    ref: 'User'
  },
  CreateAt: {
    type: Date,
    default: Date.now
  },
  UpdatedBy: {
    type: Number,
    ref: 'User'
  },
  UpdatedAt: {
    type: Date,
    default: Date.now
  }
});

industryGetStartedSellerSchema.plugin(autoIncrement, { inc_field: 'Industry_get_started_Seller_id' });

module.exports = mongoose.model('Industry_get_started_Seller', industryGetStartedSellerSchema);
