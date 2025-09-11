const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const boostAdvertisementPlanSchema = new mongoose.Schema({
  Advertisement_plan_id: {
    type: Number,
    unique: true,
    auto: true
  },
  Price: {
    type: Number,
    required: true
  },
  Active_duration: {
    type: Number,
    required: true
  },
  Type: {
    type: String,
    enum: ['Months', 'Year'],
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
}, {
  timestamps: false,
  versionKey: false
});

// Auto-increment for Advertisement_plan_id
boostAdvertisementPlanSchema.plugin(AutoIncrement, { inc_field: 'Advertisement_plan_id' });

module.exports = mongoose.model('Boost_Advertisement_plan', boostAdvertisementPlanSchema);
