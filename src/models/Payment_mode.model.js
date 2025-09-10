const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const paymentModeSchema = new mongoose.Schema({
  Payment_mode_id: {
    type: Number,
    unique: true,
    auto: true
  },
  name: {
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

paymentModeSchema.plugin(AutoIncrement, { inc_field: 'Payment_mode_id' });

module.exports = mongoose.model('Payment_mode', paymentModeSchema);


