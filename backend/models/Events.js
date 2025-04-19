const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    trim: true
  },
  eventType: {
    type: String,
    enum: ['political', 'social', 'commercial', 'welfare'],
    required: true,
    default: 'political'
  },
  venue: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'in_progress'],
    default: 'pending'
  },
  mandal: {
    type: String,
    required: true,
    default: 'Mandal 1'
  },
  requesterName: {
    type: String,
    required: true,
    trim: true
  },
  requesterContact: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v); // Basic 10-digit phone number validation
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  eventDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  startTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} is not a valid time format (HH:MM)`
    },
    default: '09:00'
  },
  endTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} is not a valid time format (HH:MM)`
    },
    default: '10:00'
  },
  description: {
    type: String,
    trim: true
  },
  address: {
    village: {
      type: String,
      trim: true
    },
    postOffice: {
      type: String,
      trim: true
    },
    policeStation: {
      type: String,
      trim: true
    },
    pincode: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return /^[0-9]{6}$/.test(v); // Indian pincode validation (6 digits)
        },
        message: props => `${props.value} is not a valid pincode!`
      }
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});



module.exports = mongoose.model('Event', EventSchema);