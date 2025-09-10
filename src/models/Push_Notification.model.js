const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const pushNotificationSchema = new mongoose.Schema({
  push_notification_id: {
    type: Number,
    unique: true,
    auto: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  media_file: {
    type: String,
    default: null
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  whomtosend: {
    type: String,
    enum: ['all', 'single'],
    default: 'all'
  },
  repeat_notification: {
    type: Boolean,
    default: true
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

// Auto-increment for push_notification_id
pushNotificationSchema.plugin(AutoIncrement, { inc_field: 'push_notification_id' });

module.exports = mongoose.model('Push_Notification', pushNotificationSchema);
