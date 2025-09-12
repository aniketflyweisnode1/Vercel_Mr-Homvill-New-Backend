const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const giftCardsMapUserSchema = new mongoose.Schema({
  Gift_cards_Map_user_id: {
    type: Number,
    unique: true
  },
  Gift_cards_type_id: {
    type: Number,
    ref: 'Gift_cards_type',
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

giftCardsMapUserSchema.plugin(autoIncrement, { inc_field: 'Gift_cards_Map_user_id' });

module.exports = mongoose.model('Gift_cards_Map_user', giftCardsMapUserSchema);
