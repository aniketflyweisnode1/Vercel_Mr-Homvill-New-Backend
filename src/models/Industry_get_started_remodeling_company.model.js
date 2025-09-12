const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const industryGetStartedRemodelingCompanySchema = new mongoose.Schema({
  Industry_remodeling_company_id: {
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
  build_manage: {
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

industryGetStartedRemodelingCompanySchema.plugin(autoIncrement, { inc_field: 'Industry_remodeling_company_id' });

module.exports = mongoose.model('Industry_get_started_remodeling_company', industryGetStartedRemodelingCompanySchema);
