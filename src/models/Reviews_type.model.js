const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const reviewsTypeSchema = new mongoose.Schema({
  Reviews_type_id: {
    type: Number,
    unique: true,
    auto: true
  },
  Reviews_type_name: {
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

// Auto-increment for Reviews_type_id
reviewsTypeSchema.plugin(AutoIncrement, { inc_field: 'Reviews_type_id' });

module.exports = mongoose.model('Reviews_type', reviewsTypeSchema);
