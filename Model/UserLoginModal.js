const mongoose=require('mongoose');
const Schema = mongoose.Schema;


// Define the admin schema
const loginSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,

    },
    password: {
      type: String,
      required: true,
      minlength: 6 // Ensure password has a minimum length
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    cart: [
      {
        dishes_id: { type: Schema.Types.ObjectId, ref: 'DishesData', required: true },
        quantity: { type: Number, default: 1 },
        image: [{ type: String }], // Array of image paths or filenames
        newprice: { type: Number },
        dishes: { type: String },
        color: { type: String },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  
    // Wishlist array with references to dishes
    wishlist: [
      {
        dishes_id: { type: Schema.Types.ObjectId, ref: 'DishesData', required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    recentlyViewed: [
      {
        dishes_id: { type: Schema.Types.ObjectId, ref: 'DishesData', required: true }, // or `productId`
        viewedAt: { type: Date, default: Date.now },
      },
    ],
    
    // Recently viewed items array
    // recentlyViewed: [
    //   {
    //     productId: { type: Schema.Types.ObjectId, ref: 'DishesData', required: true },
    //     title: { type: String },
    //     description: { type: String },
    //     price: { type: Number },
    //     image: { type: String },
    //     viewedAt: { type: Date, default: Date.now },
    //   },
    // ],
    
  });

  const logins=mongoose.model('login',loginSchema)
  module.exports=logins