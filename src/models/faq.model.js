const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const faqSchema = new mongoose.Schema({
  faq_id: {
    type: Number,
    unique: true,
    auto: true
  },
  Title: {
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

// Auto-increment for faq_id
faqSchema.plugin(AutoIncrement, { inc_field: 'faq_id' });

module.exports = mongoose.model('faq', faqSchema);
