const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const contractsCompanySchema = new mongoose.Schema({
  Contracts_Company_id: {
    type: Number,
    unique: true,
    auto: true
  },
  Contracts_Company_name: {
    type: String,
    required: true,
    trim: true
  },
  Rate_range: {
    type: String,
    trim: true,
    default: null
  },
  Contractor_name: {
    type: String,
    trim: true,
    default: null
  },
  Contact_No: {
    type: String,
    trim: true,
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

// Auto-increment for Contracts_Company_id
contractsCompanySchema.plugin(AutoIncrement, { inc_field: 'Contracts_Company_id' });

module.exports = mongoose.model('Contracts_Company', contractsCompanySchema);

