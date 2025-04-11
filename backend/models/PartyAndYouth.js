const mongoose = require('mongoose');

const PartyAndYouthSchema = new mongoose.Schema({
  aadharNo: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  whatsappNo: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  mandal: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('PartyAndYouth', PartyAndYouthSchema);