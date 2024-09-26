const mongoose = require('mongoose');
const BannerModel = new mongoose.Schema({
  image: [{ type: String }],
  });
const BannerData = mongoose.model('BannerData', BannerModel);
module.exports = BannerData;