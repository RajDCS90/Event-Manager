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
  address: {
    village: {
      type: String,
      required: true
    },
    policeStation: {
      type: String,
      required: true
    },
    postOffice: {
      type: String,
      required: true
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
    },
    mandal: {
      type: String,
      required: true
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('PartyAndYouth', PartyAndYouthSchema);
