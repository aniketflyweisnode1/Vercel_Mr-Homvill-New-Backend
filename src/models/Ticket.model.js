const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ticketSchema = new mongoose.Schema({
  ticket_id: {
    type: Number,
    unique: true,
    auto: true
  },
  user_id: {
    type: Number,
    ref: 'User',
    required: true
  },
  ticket_query: {
    type: String,
    required: true,
    trim: true
  },
  ticket_query_image: {
    type: String,
    default: null
  },
  ticket_status: {
    type: String,
    enum: ['Pending', 'Close', 'Process', 'Open'],
    default: 'Pending'
  },
  asignBy_id: {
    type: Number,
    ref: 'User',
    default: null
  },
  Rrply: {
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
  }
}, {
  timestamps: false,
  versionKey: false
});

// Auto-increment for ticket_id
ticketSchema.plugin(AutoIncrement, { inc_field: 'ticket_id' });

module.exports = mongoose.model('Ticket', ticketSchema);
