const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const industryGetStartedLocalAdvertiserSchema = new mongoose.Schema({
  industry_remodeling_company_id: {
    type: Number,
    unique: true
  },
  company: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  Phone: {
    type: String,
    required: true
  },
  website_url: {
    type: String,
    required: true
  },
  brand_company_name: {
    type: String,
    required: true
  },
  BoostOnLevel: {
    type: String,
    required: true
  },
  BusinessType: {
    type: String,
    required: true
  },
  Industry_segment: {
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

industryGetStartedLocalAdvertiserSchema.plugin(autoIncrement, { inc_field: 'industry_remodeling_company_id' });

module.exports = mongoose.model('Industry_get_started_local_advertiser', industryGetStartedLocalAdvertiserSchema);
