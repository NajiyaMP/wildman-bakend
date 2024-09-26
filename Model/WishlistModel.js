const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    product_name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true }
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', WishlistSchema);
module.exports = Wishlist;
