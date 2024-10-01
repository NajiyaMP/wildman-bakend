const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'login', // Reference the login schema for users
        required: true 
    },  
    dishes_id: {
        type: Schema.Types.ObjectId,
        ref: 'DishesData',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    addedAt: {
        type: Date,
        default: Date.now
    },
    image: [{ type: String }], // Array of image paths or filenames
    newprice: { type: Number },
    dishes: { type: String },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
