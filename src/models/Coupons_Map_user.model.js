const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const couponsMapUserSchema = new mongoose.Schema({
  Coupons_Map_user_id: {
    type: Number,
    unique: true
  },
  Coupons_id: {
    type: Number,
    ref: 'Coupons',
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

couponsMapUserSchema.plugin(autoIncrement, { inc_field: 'Coupons_Map_user_id' });

module.exports = mongoose.model('Coupons_Map_user', couponsMapUserSchema);
