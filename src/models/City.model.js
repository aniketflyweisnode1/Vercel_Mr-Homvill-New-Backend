const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const citySchema = new mongoose.Schema({
  City_id: {
    type: Number,
    unique: true,
    auto: true
  },
  City_name: {
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
  State_id: {
    type: Number,
    ref: 'State',
    required: true
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

// Auto-increment for City_id
citySchema.plugin(AutoIncrement, { inc_field: 'City_id' });

// Compound index to ensure unique city names within a state
citySchema.index({ City_name: 1, State_id: 1 }, { unique: true });

module.exports = mongoose.model('City', citySchema);
