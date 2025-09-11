const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const propertiesRecentlyViewedSchema = new mongoose.Schema({
  Properties_Recently_viewed_id: {
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

// Auto-increment for Properties_Recently_viewed_id
propertiesRecentlyViewedSchema.plugin(AutoIncrement, { inc_field: 'Properties_Recently_viewed_id' });

module.exports = mongoose.model('Properties_Recently_viewed', propertiesRecentlyViewedSchema);
