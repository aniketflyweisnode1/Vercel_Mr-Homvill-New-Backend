const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const documentPreferencesSchema = new mongoose.Schema({
  Document_preferences_id: {
    type: Number,
    unique: true,
    auto: true
  },
  Benefits_going_paperless: {
    type: String,
    required: true,
    trim: true
  },
  settings: [{
    "I agree to sending, and receiving documents electronically form HomVill, Inc.. with includes HomVill.com": {
      type: Boolean,
      default: true
    },
    "I agree to sending, and receiving documents electronically form HomVill Closing Services.": {
      type: Boolean,
      default: true
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
}, {
  timestamps: false,
  versionKey: false
});

// Auto-increment for Document_preferences_id
documentPreferencesSchema.plugin(AutoIncrement, { inc_field: 'Document_preferences_id' });

module.exports = mongoose.model('Document_preferences', documentPreferencesSchema);
