const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const bannersSchema = new mongoose.Schema({
  Banners_id: {
    type: Number,
    unique: true,
    auto: true
  },
  FaceBook_link: {
    type: String,
    default: null,
    trim: true
  },
  instagram_link: {
    type: String,
    default: null,
    trim: true
  },
  website_link: {
    type: String,
    default: null,
    trim: true
  },
  twitter_link: {
    type: String,
    default: null,
    trim: true
  },
  banner_image: {
    type: String,
    default: null
  },
  headline: {
    type: String,
    default: null,
    trim: true
  },
  Catetory_id: {
    type: Number,
    default: null
  },
  Sub_role_id: {
    type: Number,
    default: null
  },
  publishingDate: {
    type: Date,
    default: null
  },
  Description: {
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

bannersSchema.plugin(AutoIncrement, { inc_field: 'Banners_id' });

module.exports = mongoose.model('Banners', bannersSchema);


