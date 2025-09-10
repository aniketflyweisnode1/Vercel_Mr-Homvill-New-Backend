const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const termsConditionSchema = new mongoose.Schema({
  terms_Condition_id: {
    type: Number,
    unique: true,
    auto: true
  },
  terms_Condition_Title: {
    type: String,
    required: true,
    trim: true
  },
  Description: {
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

// Auto-increment for terms_Condition_id
termsConditionSchema.plugin(AutoIncrement, { inc_field: 'terms_Condition_id' });

module.exports = mongoose.model('terms_Condition', termsConditionSchema);
