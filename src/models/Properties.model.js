const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const propertiesSchema = new mongoose.Schema({
  Properties_id: {
    type: Number,
    unique: true,
    auto: true
  },
  Properties_Status_id: {
    type: Number,
    ref: 'Properties_Status',
    required: true
  },
  Properties_Category_id: {
    type: Number,
    ref: 'Properties_Category',
    required: true
  },
  Properties_for: {
    type: String,
    enum: ['Sell', 'Rent', 'Buy'],
    required: true
  },
  Owner_Fist_name: {
    type: String,
    required: true,
    trim: true
  },
  Owner_Last_name: {
    type: String,
    required: true,
    trim: true
  },
  Owner_phone_no: {
    type: String,
    required: true,
    trim: true
  },
  Owner_email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  Property_cost: {
    type: Number,
    required: true
  },
  Property_year_build: {
    type: Number,
    required: true
  },
  Property_Plot_size: {
    type: String,
    required: true,
    trim: true
  },
  Property_finished_Sq_ft: {
    type: String,
    required: true,
    trim: true
  },
  Property_Bed_rooms: {
    type: Number,
    required: true
  },
  Property_Full_Baths: {
    type: Number,
    required: true
  },
  Property_OneTwo_Baths: {
    type: Number,
    required: true
  },
  Property_Address: {
    type: String,
    required: true,
    trim: true
  },
  Property_city: {
    type: String,
    trim: true
  },
  Property_zip: {
    type: String,
    trim: true
  },
  Property_country: {
    type: String,
    trim: true
  },
  Property_state: {
    type: String,
    trim: true
  },
  Property_Why_sell: {
    type: String,
    required: true,
    trim: true
  },
  Property_Reason_Selling: [{
    type: String,
    trim: true
  }],
  Property_Listing_Price: {
    type: Number,
    required: true
  },
  Property_Listing_plot_size: {
    type: String,
    required: true,
    trim: true
  },
  Property_Listing_Description: {
    type: String,
    required: true,
    trim: true
  },
  Property_photos: [{
    Title: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  }],
  Appliances: [{
    type: String,
    trim: true
  }],
  floors: [{
    type: String,
    trim: true
  }],
  others: [{
    type: String,
    trim: true
  }],
  payment_methods: [{
    type: Number,
    ref: 'Payment_mode'
  }],
  parking: [{
    type: String,
    trim: true
  }],
  Rooms: [{
    type: String,
    trim: true
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

// Auto-increment for Properties_id
propertiesSchema.plugin(AutoIncrement, { inc_field: 'Properties_id' });

module.exports = mongoose.model('Properties', propertiesSchema);
