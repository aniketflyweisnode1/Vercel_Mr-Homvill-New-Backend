const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const areaSchema = new mongoose.Schema({
  Area_id: {
    type: Number,
    unique: true,
    auto: true
  },
  Area_name: {
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

areaSchema.plugin(AutoIncrement, { inc_field: 'Area_id' });

module.exports = mongoose.model('Area', areaSchema);


