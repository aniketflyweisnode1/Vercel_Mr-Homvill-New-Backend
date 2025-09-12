const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const industryGetStartedManagerSchema = new mongoose.Schema({
  Industry_get_started_manager_id: {
    type: Number,
    unique: true
  },
  properties_unites: {
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
  property_company: {
    type: String,
    required: true
  },
  Company_state: {
    type: String,
    required: true
  },
  property_name: {
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

industryGetStartedManagerSchema.plugin(autoIncrement, { inc_field: 'Industry_get_started_manager_id' });

module.exports = mongoose.model('Industry_get_started_manager', industryGetStartedManagerSchema);
