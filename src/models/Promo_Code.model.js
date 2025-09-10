const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const promoCodeSchema = new mongoose.Schema({
  Promo_Code_id: {
    type: Number,
    unique: true,
    auto: true
  },
  offer_name: {
    type: String,
    required: true,
    trim: true
  },
  Coupon_code: {
    type: String,
    required: true,
    trim: true
  },
  Coupon_type: {
    type: String,
    enum: ['Public Coupon', 'Private Coupon'],
    required: true
  },
  Coupon_count_used: {
    type: Number,
    default: 0
  },
  use_Per_user: {
    type: Number,
    default: 1
  },
  Select_area_id: {
    type: Number,
    ref: 'Area',
    required: true
  },
  visibility: {
    type: Boolean,
    default: true
  },
  Diescount_type: {
    type: String,
    enum: ['Flat Discount', 'Percentage Discount'],
    required: true
  },
  Discount_amount: {
    type: Number,
    required: true,
    min: 0
  },
  StartDate: {
    type: Date,
    required: true
  },
  StartTime: {
    type: String,
    required: true
  },
  EndDate: {
    type: Date,
    required: true
  },
  EndTime: {
    type: String,
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

promoCodeSchema.plugin(AutoIncrement, { inc_field: 'Promo_Code_id' });

module.exports = mongoose.model('Promo_Code', promoCodeSchema);


