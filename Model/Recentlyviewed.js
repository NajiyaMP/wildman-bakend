const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const RecentlyViewedSchema = new mongoose.Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'login', // Reference the login schema for users
    required: true 
},
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


