const mongoose = require('mongoose');

const RecentlyViewedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Associate with a user
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Reference to the Product model
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to automatically update `updatedAt` on save
RecentlyViewedSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const RecentlyViewed = mongoose.model('RecentlyViewed', RecentlyViewedSchema);

module.exports = RecentlyViewed;
