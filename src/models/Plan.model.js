const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const planSchema = new mongoose.Schema({
  Plan_id: {
    type: Number,
    unique: true
  },
  Type: {
    type: String,
    enum: ['Monthly', 'Yearly'],
    required: true
  },
  Plan_name: {
    type: String,
    required: true
  },
  Price: {
    type: Number,
    required: true
  },
  Simply_line: [{
    Line: {
      type: String,
      default: ""
    }
  }],
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

planSchema.plugin(autoIncrement, { inc_field: 'Plan_id' });

module.exports = mongoose.model('Plan', planSchema);
