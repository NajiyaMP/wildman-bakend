const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'login',  // Reference to the user who placed the order
    required: true,
  },
  orderItems: [
    {
      dishes_id: { type: Schema.Types.ObjectId, ref: 'DishesData', required: true },
      quantity: { type: Number, default: 1 },
      image: [{ type: String }],  // Array of image paths or filenames
      newprice: { type: Number, required: true },
      dishes: { type: String },
      color: { type: String },
    }
  ],
  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    phonenumber: { type: Number, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'PayPal', 'Cash on Delivery'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  placedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
