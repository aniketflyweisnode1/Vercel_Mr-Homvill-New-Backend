const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userQuerySchema = new mongoose.Schema({
  user_query_id: {
    type: Number,
    unique: true,
    auto: true
  },
  user_id: {
    type: Number,
    ref: 'User',
    required: true
  },
  user_name: {
    type: String,
    required: true,
    trim: true
  },
  user_contact: {
    type: String,
    required: true,
    trim: true
  },
  user_email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  Query_txt: {
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

// Auto-increment for user_query_id
userQuerySchema.plugin(AutoIncrement, { inc_field: 'user_query_id' });

module.exports = mongoose.model('user_Query', userQuerySchema);
