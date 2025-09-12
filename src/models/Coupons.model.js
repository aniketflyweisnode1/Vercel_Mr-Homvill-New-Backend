const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const couponsSchema = new mongoose.Schema({
  Coupons_id: {
    type: Number,
    unique: true
  },
  Name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  expirydatetime: {
    type: Date,
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

couponsSchema.plugin(autoIncrement, { inc_field: 'Coupons_id' });

module.exports = mongoose.model('Coupons', couponsSchema);
