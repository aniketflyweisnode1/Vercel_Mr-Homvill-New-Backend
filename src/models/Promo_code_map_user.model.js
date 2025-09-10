const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const promoMapUserSchema = new mongoose.Schema({
  Promo_Map_user_id: {
    type: Number,
    unique: true,
    auto: true
  },
  PromoCode_id: {
    type: Number,
    ref: 'Promo_Code',
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
}, {
  timestamps: false,
  versionKey: false
});

promoMapUserSchema.plugin(AutoIncrement, { inc_field: 'Promo_Map_user_id' });

module.exports = mongoose.model('Promo_code_map_user', promoMapUserSchema);


