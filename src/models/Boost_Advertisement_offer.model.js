const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const boostAdvertisementOfferSchema = new mongoose.Schema({
  Advertisement_offer_id: {
    type: Number,
    unique: true,
    auto: true
  },
  Advertisement_offer: {
    type: String,
    required: true,
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

// Auto-increment for Advertisement_offer_id
boostAdvertisementOfferSchema.plugin(AutoIncrement, { inc_field: 'Advertisement_offer_id' });

module.exports = mongoose.model('Boost_Advertisement_offer', boostAdvertisementOfferSchema);
