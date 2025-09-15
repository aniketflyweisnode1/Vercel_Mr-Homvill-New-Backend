const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userAddressSchema = new mongoose.Schema({
  Address_id: {
    type: Number,
    unique: true,
    auto: true
  },
  user_id: {
    type: Number,
    ref: 'User',
    required: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city_id: {
    type: Number,
    ref: 'City',
    required: true
  },
  state_id: {
    type: Number,
    ref: 'State',
    required: true
  },
  country_id: {
    type: Number,
    ref: 'Country',
    required: true
  },
  location: {
    type: String,
    default: null,
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

// Auto-increment for Address_id
userAddressSchema.plugin(AutoIncrement, { inc_field: 'Address_id' });

module.exports = mongoose.model('User_Address', userAddressSchema);
