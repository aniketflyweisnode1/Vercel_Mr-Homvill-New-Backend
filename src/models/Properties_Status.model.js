const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const propertiesStatusSchema = new mongoose.Schema({
  Properties_Status_id: {
    type: Number,
    unique: true,
    auto: true
  },
  Pro_Status: {
    type: String,
    enum: ['SALE', 'RENT'],
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
}, {
  timestamps: false,
  versionKey: false
});

// Auto-increment for Properties_Status_id
propertiesStatusSchema.plugin(AutoIncrement, { inc_field: 'Properties_Status_id' });

module.exports = mongoose.model('Properties_Status', propertiesStatusSchema);
