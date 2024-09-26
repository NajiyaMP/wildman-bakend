const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  image: [{
    type: String,
    default: '',
  }],
  
  contact: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  mapLink: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);