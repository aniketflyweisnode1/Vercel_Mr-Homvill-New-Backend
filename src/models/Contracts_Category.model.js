const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const contractsCategorySchema = new mongoose.Schema({
  Contracts_Category_id: {
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

// Auto-increment for Contracts_Category_id
contractsCategorySchema.plugin(AutoIncrement, { inc_field: 'Contracts_Category_id' });

module.exports = mongoose.model('Contracts_Category', contractsCategorySchema);

