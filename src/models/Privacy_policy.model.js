const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const privacyPolicySchema = new mongoose.Schema({
  Privacy_policy_id: {
    type: Number,
    unique: true,
    auto: true
  },
  Privacy_policy_Title: {
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

// Auto-increment for Privacy_policy_id
privacyPolicySchema.plugin(AutoIncrement, { inc_field: 'Privacy_policy_id' });

module.exports = mongoose.model('Privacy_policy', privacyPolicySchema);
