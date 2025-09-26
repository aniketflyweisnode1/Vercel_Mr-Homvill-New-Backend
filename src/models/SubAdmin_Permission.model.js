const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const subAdminPermissionSchema = new mongoose.Schema({
  SubAdmin_Permission_id: {
    type: Number,
    unique: true,
    auto: true
  },
  user_id: {
    type: Number,
    ref: 'User',
    required: true
  },
  User: [
    {
      Edit: {
      type: Boolean,
      default: false
    },
      View: {
      type: Boolean,
      default: false
    }
  }],
  Properties: [
    {
      Edit: {
      type: Boolean,
      default: false
    },
      View: {
      type: Boolean,
      default: false
    }
  }],
  Contracts: [
    {
      Edit: {
      type: Boolean,
      default: false
    },
      View: {
      type: Boolean,
      default: false
    }
  }],
  Subscription: [
    {
      Edit: {
      type: Boolean,
      default: false
    },
      View: {
      type: Boolean,
      default: false
    }
  }],
  ApprovedStatus: {
    type: Boolean,
    default: false
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
    ref: 'User',
    default: null
  },
  CreateAt: {
    type: Date,
    default: Date.now
  },
  UpdatedBy: {
    type: Number,
    ref: 'User',
    default: null
  },
  UpdatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false,
  versionKey: false
});

subAdminPermissionSchema.plugin(AutoIncrement, { inc_field: 'SubAdmin_Permission_id' });

module.exports = mongoose.model('SubAdmin_Permission', subAdminPermissionSchema);
