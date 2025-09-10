const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const stateSchema = new mongoose.Schema({
  State_id: {
    type: Number,
    unique: true,
    auto: true
  },
  state_name: {
    type: String,
    required: true,
    trim: true
  },
  Code: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  Country_id: {
    type: Number,
    ref: 'Country',
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

// Auto-increment for State_id
stateSchema.plugin(AutoIncrement, { inc_field: 'State_id' });

// Compound index to ensure unique state names within a country
stateSchema.index({ state_name: 1, Country_id: 1 }, { unique: true });

module.exports = mongoose.model('State', stateSchema);
