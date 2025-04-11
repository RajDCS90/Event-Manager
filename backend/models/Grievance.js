const mongoose = require('mongoose');

const GrievanceSchema = new mongoose.Schema({
  grievanceName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  applicant: {
    type: String,
    required: true
  },
  registeredOn: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  description: {
    type: String,
    required: true
  },
  assignedTo: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Grievance', GrievanceSchema);