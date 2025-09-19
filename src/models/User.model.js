const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const userSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    unique: true,
    auto: true
  },
  Name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  Responsibility_id: {
    type: Number,
    ref: 'Responsibility',
    required: true
  },
  Role_id: {
    type: Number,
    ref: 'Role',
    required: true
  },
  User_Category_id: {
    type: Number,
    ref: 'User_Category',
    default: null
  },
  Language_id: {
    type: Number,
    ref: 'Language',
    required: true
  },
  Country_id: {
    type: Number,
    ref: 'Country',
    required: true
  },
  State_id: {
    type: Number,
    ref: 'State',
    required: true
  },
  City_id: {
    type: Number,
    ref: 'City',
    required: true
  },
  Employee_id: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Male'
  },
  user_image: {
    type: String,
    default: null
  },
  OnboardingDate: {
    type: Date,
    default: Date.now
  },
  yearsWithus: {
    type: Number,
    default: 0
  },
  isLoginPermission: {
    type: Boolean,
    default: true
  },
  referralCode: {
    type: String,
    default: ""
  },
  governmentId: {
    type: String,
    default: null
  },
  dateOfJoining: {
    type: Date,
    default: null
  },
  birthday: {
    type: Date,
    default: null
  },
  deviceToken: {
    type: String,
    default: null
  },
  rating: {
    type: Number,
    default: 0
  },
  wallet: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    default: null
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
  },
  resetPasswordOTP: {
    type: String,
    default: null
  },
  resetPasswordOTPExpiry: {
    type: Date,
    default: null
  },
  two_step_verification: {
    type: Boolean,
    default: false
  },
  privacy_cookies: {
    type: Boolean,
    default: false
  },
  account_active: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: false,
  versionKey: false
});

// Auto-increment for user_id
userSchema.plugin(AutoIncrement, { inc_field: 'user_id' });

// Set user_id as the primary key for population
userSchema.virtual('id').get(function() {
  return this.user_id;
});

userSchema.set('toJSON', {
  virtuals: true
});

// Simple password hashing (for development only - not recommended for production)
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    // Simple hash with timestamp as salt (NOT SECURE - for development only)
    const timestamp = Date.now().toString();
    const simpleHash = this.password + timestamp;
    this.password = timestamp + ':' + simpleHash;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = function(candidatePassword) {
  const parts = this.password.split(':');
  if (parts.length !== 2) return false;
  
  const timestamp = parts[0];
  const storedHash = parts[1];
  const candidateHash = candidatePassword + timestamp;
  
  return storedHash === candidateHash;
};

module.exports = mongoose.model('User', userSchema);
