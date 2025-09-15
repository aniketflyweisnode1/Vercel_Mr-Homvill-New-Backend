const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const cartSchema = new mongoose.Schema({
  cart_id: {
    type: Number,
    unique: true,
    auto: true
  },
  seller: {
    type: Number,
    ref: 'User',
    required: true
  },
  seller_address_id: {
    type: Number,
    ref: 'User_Address',
    required: true
  },
  Buyer: {
    type: Number,
    ref: 'User',
    required: true
  },
  Buyer_address_id: {
    type: Number,
    ref: 'User_Address',
    required: true
  },
  Property_id: {
    type: Number,
    ref: 'Properties',
    required: true
  },
  Delivery_Date_range: {
    type: String,
    required: true,
    trim: true
  },
  Price: {
    type: Number,
    required: true
  },
  Quantity: {
    type: Number,
    required: true,
    default: 1
  },
  payment_method: {
    type: String,
    required: true,
    trim: true
  },
  Transaction_id: {
    type: Number,
    ref: 'Transaction',
    default: null
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

// Auto-increment for cart_id
cartSchema.plugin(AutoIncrement, { inc_field: 'cart_id' });

module.exports = mongoose.model('Cart', cartSchema);
