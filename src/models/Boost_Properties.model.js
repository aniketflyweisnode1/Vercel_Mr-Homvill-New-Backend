const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const boostPropertiesSchema = new mongoose.Schema({
  Boost_Properties_id: {
    type: Number,
    unique: true,
    auto: true
  },
  Advertisement_plan_id: {
    type: Number,
    ref: 'Boost_Advertisement_plan',
    required: true
  },
  Advertisement_offer_id: {
    type: Number,
    ref: 'Boost_Advertisement_offer',
    required: true
  },
  Properties_id: {
    type: Number,
    ref: 'Properties',
    required: true
  },
  Active_status: {
    type: Boolean,
    default: true
  },
  Active_day_limit: {
    type: Number,
    default: 0
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
}, {
  timestamps: false,
  versionKey: false
});

// Auto-increment for Boost_Properties_id
boostPropertiesSchema.plugin(AutoIncrement, { inc_field: 'Boost_Properties_id' });

module.exports = mongoose.model('Boost_Properties', boostPropertiesSchema);
