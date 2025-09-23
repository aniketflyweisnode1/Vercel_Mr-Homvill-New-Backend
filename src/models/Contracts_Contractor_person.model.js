const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const contractsContractorPersonSchema = new mongoose.Schema({
  Contracts_Contractor_person_id: {
    type: Number,
    unique: true,
    auto: true
  },
  owner: {
    type: String,
    default: null,
    trim: true
  },
  property_id: {
    type: Number,
    ref: 'Properties',
    default: null
  },
  category_id: {
    type: Number,
    ref: 'Contracts_Category',
    default: null
  },
  contact: {
    type: String,
    default: null,
    trim: true
  },
  contractor: {
    type: String,
    default: null,
    trim: true
  },
  company_id: {
    type: Number,
    ref: 'Contracts_Company',
    default: null
  },
  cost: {
    type: Number,
    default: null
  },
  address: {
    type: String,
    default: null,
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

// Auto-increment for Contracts_Contractor_person_id
contractsContractorPersonSchema.plugin(AutoIncrement, { inc_field: 'Contracts_Contractor_person_id' });

module.exports = mongoose.model('Contracts_Contractor_person', contractsContractorPersonSchema);

