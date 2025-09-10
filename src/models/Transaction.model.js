const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const transactionSchema = new mongoose.Schema({
  Transaction_id: {
    type: Number,
    unique: true,
    auto: true
  },
  user_id: {
    type: Number,
    ref: 'User',
    required: true
  },
  Payment_mode_id: {
    type: Number,
    ref: 'Payment_mode',
    required: true
  },
  Amount: {
    type: Number,
    required: true,
    min: 0
  },
  Date: {
    type: Date,
    required: true
  },
  Payment_Status: {
    type: String,
    trim: true,
    default: 'Pending'
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

transactionSchema.plugin(AutoIncrement, { inc_field: 'Transaction_id' });

module.exports = mongoose.model('Transaction', transactionSchema);


