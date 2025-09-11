const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const yourFavoritePropertiesSchema = new mongoose.Schema({
  Your_Favorite_Properties_id: {
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

// Auto-increment for Your_Favorite_Properties_id
yourFavoritePropertiesSchema.plugin(AutoIncrement, { inc_field: 'Your_Favorite_Properties_id' });

module.exports = mongoose.model('Your_Favorite_Properties', yourFavoritePropertiesSchema);
