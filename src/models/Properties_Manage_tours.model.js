const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const propertiesManageToursSchema = new mongoose.Schema({
  Properties_Manage_tours_id: {
    type: Number,
    unique: true,
    auto: true
  },
  Properties_id: {
    type: Number,
    ref: 'Properties',
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

// Auto-increment for Properties_Manage_tours_id
propertiesManageToursSchema.plugin(AutoIncrement, { inc_field: 'Properties_Manage_tours_id' });

module.exports = mongoose.model('Properties_Manage_tours', propertiesManageToursSchema);
