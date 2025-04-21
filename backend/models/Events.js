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
  eventDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  startTime: {
    type: String,
    required: true,
    validate: {
      validator: v => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v),
      message: props => `${props.value} is not a valid time format (HH:MM)`
    },
    default: '09:00'
  },
  endTime: {
    type: String,
    required: true,
    validate: {
      validator: v => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v),
      message: props => `${props.value} is not a valid time format (HH:MM)`
    },
    default: '10:00'
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
      validator: v => /^[0-9]{10}$/.test(v),
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  imageUrl: {
    type: String, // Store image URL or file path
    required: false
  },
  address: {
    village: {
      type: String,
      trim: true,
      // required: true
    },
    postOffice: {
      type: String,
      trim: true,
      // required: true
    },
    policeStation: {
      type: String,
      trim: true,
      // required: true
    },
    pincode: {
      type: String,
      trim: true,
      validate: {
        validator: v => /^[0-9]{6}$/.test(v),
        message: props => `${props.value} is not a valid pincode!`
      },
      required: true
    },
    mandal: {
      type: String,
      // required: true
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
