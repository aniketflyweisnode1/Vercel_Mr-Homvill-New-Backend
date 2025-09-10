const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const subscriptionLineSchema = new mongoose.Schema({
  Feactue_name: {
    type: String,
    required: true,
    trim: true
  },
  Quantity: {
    type: Number,
    required: true,
    default: 1
  }
}, { _id: false });

const subscriptionsSchema = new mongoose.Schema({
  Subscriptions_id: {
    type: Number,
    unique: true,
    auto: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  emozi: {
    type: String,
    default: null
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  Lines: [subscriptionLineSchema],
  Subscription_for: [{
    type: String,
    trim: true
  }],
  Feactue_name: {
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

subscriptionsSchema.plugin(AutoIncrement, { inc_field: 'Subscriptions_id' });

module.exports = mongoose.model('Subscriptions', subscriptionsSchema);


