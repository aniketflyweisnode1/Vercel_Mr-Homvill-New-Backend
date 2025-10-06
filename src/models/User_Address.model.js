const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userAddressSchema = new mongoose.Schema({
  User_Address_id: {
    type: Number,
    unique: true,
    auto: true
  },
  user_id: {
    type: Number,
    ref: 'User',
    required: true
  },
  address_type: {
    type: String,
    enum: ['Home', 'Work', 'Other'],
    default: 'Home',
    trim: true
  },
  address_line1: {
    type: String,
    required: true,
    trim: true
  },
  address_line2: {
    type: String,
    default: null,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  postal_code: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  is_default: {
    type: Boolean,
    default: false
  },
  Status: {
    type: Boolean,
    default: true
  },
  CreateBy: {
    type: Number,
    ref: 'User',
    default: null
  },
  CreateAt: {
    type: Date,
    default: Date.now
  },
  UpdatedBy: {
    type: Number,
    ref: 'User',
    default: null
  },
  UpdatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false,
  versionKey: false
});

// Auto-increment for User_Address_id
userAddressSchema.plugin(AutoIncrement, { inc_field: 'User_Address_id' });

module.exports = mongoose.model('User_Address', userAddressSchema);