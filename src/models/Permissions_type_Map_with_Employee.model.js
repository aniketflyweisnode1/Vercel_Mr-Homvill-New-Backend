const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const permissionsTypeMapSchema = new mongoose.Schema({
  Permissions_type_Map_id: {
    type: Number,
    unique: true,
    auto: true
  },
  Permissions_type_id: {
    type: Number,
    required: true
  },
  user_id: {
    type: Number,
    ref: 'User',
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

// Auto-increment for Permissions_type_Map_id
permissionsTypeMapSchema.plugin(AutoIncrement, { inc_field: 'Permissions_type_Map_id' });

// Compound index to ensure unique permission mapping per user
permissionsTypeMapSchema.index({ user_id: 1, Permissions_type_id: 1 }, { unique: true });

module.exports = mongoose.model('Permissions_type_Map_with_Employee', permissionsTypeMapSchema);
