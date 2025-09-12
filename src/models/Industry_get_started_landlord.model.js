const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const industryGetStartedLandlordSchema = new mongoose.Schema({
  Industry_get_started_landlord_id: {
    type: Number,
    unique: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  Phone: {
    type: String,
    required: true
  },
  wantTosell: {
    type: String,
    required: true
  },
  ReasonSelling: [{
    type: String,
    default: ""
  }],
  HomeFacts_year_build: {
    type: String,
    required: true
  },
  HomeFacts_lotSize: {
    type: String,
    required: true
  },
  HomeFacts_Finished: {
    type: String,
    required: true
  },
  HomeFacts_BedRooms: {
    type: String,
    required: true
  },
  HomeFacts_fullBaths: {
    type: String,
    required: true
  },
  HomeFacts_onetwo_baths: {
    type: String,
    required: true
  },
  Home_features_Appliances: [{
    type: Object,
    default: {}
  }],
  Home_features_Floors: [{
    type: Object,
    default: {}
  }],
  Home_features_Others: [{
    type: Object,
    default: {}
  }],
  Home_features_Parking: [{
    type: Object,
    default: {}
  }],
  Home_features_Rooms: [{
    type: Object,
    default: {}
  }],
  Home_features_Tagging: [{
    type: Object,
    default: {}
  }],
  improvements: {
    type: String,
    required: true
  },
  listingPrice: {
    type: String,
    required: true
  },
  Description: {
    type: String,
    required: true
  },
  photos: [{
    imagename: {
      type: String,
      default: ""
    }
  }],
  video_link: [{
    type: Object,
    default: {}
  }],
  work_with_buyer_agent: {
    type: String,
    required: true
  },
  refund: {
    type: String,
    required: true
  },
  work_with_a_buyer_agent: {
    type: String,
    required: true
  },
  addPercentage: {
    type: String,
    required: true
  },
  buyer_credit_Refund: {
    type: String,
    required: true
  },
  openHouse_startDate: {
    type: String,
    required: true
  },
  openHouse_endDate: {
    type: String,
    required: true
  },
  openHouse_SetTime: {
    type: String,
    required: true
  },
  user_id: {
    type: Number,
    ref: 'User',
    required: true
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
});

industryGetStartedLandlordSchema.plugin(autoIncrement, { inc_field: 'Industry_get_started_landlord_id' });

module.exports = mongoose.model('Industry_get_started_landlord', industryGetStartedLandlordSchema);
