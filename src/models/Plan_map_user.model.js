const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const planMapUserSchema = new mongoose.Schema({
  Plan_map_user_id: {
    type: Number,
    unique: true
  },
  Plan_id: {
    type: Number,
    ref: 'Plan',
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
});

planMapUserSchema.plugin(autoIncrement, { inc_field: 'Plan_map_user_id' });

module.exports = mongoose.model('Plan_map_user', planMapUserSchema);
