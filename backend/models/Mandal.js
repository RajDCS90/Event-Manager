const mongoose = require('mongoose');

const BoothSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  }
}, { _id: false });

const VillageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  booths: [BoothSchema]
}, { _id: false });

const PanchayatOrWardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Panchayat', 'Ward'],
    required: true
  },
  villages: [VillageSchema]
}, { _id: false });

const MandalSchema = new mongoose.Schema({
  mandalName: {
    type: String,
    required: true,
    unique: true
  },
  areas: [PanchayatOrWardSchema]
}, { timestamps: true });

module.exports = mongoose.model('Mandal', MandalSchema);