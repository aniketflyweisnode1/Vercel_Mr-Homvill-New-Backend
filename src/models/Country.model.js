const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const countrySchema = new mongoose.Schema({
  Country_id: {
    type: Number,
    unique: true,
    auto: true
  },
  Country_name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    uppercase: true,
    length: 2
  },
  phone_code: {
    type: String,
    trim: true
  },
  currency: {
    type: String,
    trim: true
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

// Auto-increment for Country_id
countrySchema.plugin(AutoIncrement, { inc_field: 'Country_id' });

module.exports = mongoose.model('Country', countrySchema);
