const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userCategorySchema = new mongoose.Schema({
  User_Category_id: {
    type: Number,
    unique: true,
    auto: true
  },
  role_id: {
    type: Number,
    ref: 'Role',
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

// Auto-increment for User_Category_id
userCategorySchema.plugin(AutoIncrement, { inc_field: 'User_Category_id' });

module.exports = mongoose.model('User_Category', userCategorySchema);
