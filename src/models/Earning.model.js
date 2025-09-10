const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const earningSchema = new mongoose.Schema({
  Earning_id: {
    type: Number,
    unique: true,
    auto: true
  },
  seller: {
    type: Number,
    ref: 'User',
    required: true
  },
  Buyer: {
    type: Number,
    ref: 'User',
    required: true
  },
  Property_id: {
    type: Number,
    ref: 'Properties',
    required: true
  },
  Transaction_id: {
    type: Number,
    ref: 'Transaction',
    required: true
  },
  Transaction_status: {
    type: String,
    enum: ['Panding', 'Completed', 'Process'],
    default: 'Panding'
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

earningSchema.plugin(AutoIncrement, { inc_field: 'Earning_id' });

module.exports = mongoose.model('Earning', earningSchema);


