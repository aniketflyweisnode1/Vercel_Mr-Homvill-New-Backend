const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const contractsEnquiriesSchema = new mongoose.Schema({
  Contracts_Enquiries_id: {
    type: Number,
    unique: true,
    auto: true
  },
  Enquiries_by_user_id: {
    type: Number,
    ref: 'User',
    required: true
  },
  Budget_Price: {
    type: Number,
    default: 0
  },
  Price_compare: {
    type: [
      {
        Company_id: { type: Number, ref: 'Contracts_Company', required: true }
      }
    ],
    default: []
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

contractsEnquiriesSchema.plugin(AutoIncrement, { inc_field: 'Contracts_Enquiries_id' });

module.exports = mongoose.model('Contracts_Enquiries', contractsEnquiriesSchema);


