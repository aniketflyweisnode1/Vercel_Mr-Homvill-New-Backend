const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const reviewsSchema = new mongoose.Schema({
  Reviews_id: {
    type: Number,
    unique: true,
    auto: true
  },
  user_id: {
    type: Number,
    ref: 'User',
    required: true
  },
  Title: {
    type: String,
    required: true,
    trim: true
  },
  Reviews_count: {
    type: Number,
    default: 0
  },
  Review_text: {
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

// Auto-increment for Reviews_id
reviewsSchema.plugin(AutoIncrement, { inc_field: 'Reviews_id' });

module.exports = mongoose.model('Reviews', reviewsSchema);
