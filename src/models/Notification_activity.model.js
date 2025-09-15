const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const notificationActivitySchema = new mongoose.Schema({
  Notification_activity_id: {
    type: Number,
    unique: true,
    auto: true
  },
  user_id: {
    type: Number,
    ref: 'User',
    required: true
  },
  Search: {
    Email: {
      type: Boolean,
      default: true
    },
    Mobile: {
      type: Boolean,
      default: true
    }
  },
  Favorites_property_updates: {
    Email: {
      type: Boolean,
      default: true
    },
    Mobile: {
      type: Boolean,
      default: true
    }
  },
  Favorites_market_reports: {
    Email: {
      type: Boolean,
      default: true
    },
    Mobile: {
      type: Boolean,
      default: true
    }
  },
  Your_home: {
    Email: {
      type: Boolean,
      default: true
    },
    Mobile: {
      type: Boolean,
      default: true
    }
  },
  Home_loans_Refinancing: {
    Email: {
      type: Boolean,
      default: true
    },
    Mobile: {
      type: Boolean,
      default: true
    }
  },
  Property_Management_res: {
    Email: {
      type: Boolean,
      default: true
    },
    Mobile: {
      type: Boolean,
      default: true
    }
  },
  Homvill_Rental_manager: {
    Email: {
      type: Boolean,
      default: true
    },
    Mobile: {
      type: Boolean,
      default: true
    }
  },
  Building_reviews: {
    Email: {
      type: Boolean,
      default: true
    },
    Mobile: {
      type: Boolean,
      default: true
    }
  },
  Portfolio_performance: {
    Email: {
      type: Boolean,
      default: true
    },
    Mobile: {
      type: Boolean,
      default: true
    }
  },
  Homvill_news: {
    Email: {
      type: Boolean,
      default: true
    },
    Mobile: {
      type: Boolean,
      default: true
    }
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

// Auto-increment for Notification_activity_id
notificationActivitySchema.plugin(AutoIncrement, { inc_field: 'Notification_activity_id' });

module.exports = mongoose.model('Notification_activity', notificationActivitySchema);
