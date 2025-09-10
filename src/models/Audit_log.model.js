const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const auditLogSchema = new mongoose.Schema({
  Audit_log_id: {
    type: Number,
    unique: true,
    auto: true
  },
  user_id: {
    type: Number,
    ref: 'User',
    required: true
  },
  Action: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    default: null,
    trim: true
  },
  Enverment: {
    type: String,
    default: null,
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

auditLogSchema.plugin(AutoIncrement, { inc_field: 'Audit_log_id' });

module.exports = mongoose.model('Audit_log', auditLogSchema);


