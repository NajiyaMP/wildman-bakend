const asyncHandler = require('express-async-handler');
const Cart = require('../Model/CartModel');
const DishesModel = require('../Model/DishesModel');

// POST - Add a dish to the cart
exports.postCart = asyncHandler(async (req, res) => {
    try {
        const { dishes_id, image, price, dishes } = req.body;

        const dish = await DishesModel.findById(dishes_id);
        if (!dish) {
            return res.status(404).json({
                status: 404,
                message: 'Product not found'
            });
        }

        const existingCartItem = await Cart.findOne({ dishes_id });

        if (existingCartItem) {
            return res.status(409).json({
                status: 409,
                message: 'Product is already in the cart'
            });
        }

        const newCartItem = new Cart({
            dishes_id,
            image,
            price,
            dishes
        });

        await newCartItem.save();

        return res.status(201).json({
            status: 201,
            message: 'Product added to the cart successfully',
            cartItem: newCartItem
        });
    } catch (error) {
        console.error('Error adding dish to cart:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error'
        });
    }
});


// GET - Fetch all cart items
exports.getCart = asyncHandler(async (req, res) => {
    try {
      const cartItems = await Cart.find()
        .populate('dishes_id', ['image', 'price', 'dishes']); // Populate fields from DishesModel
  
      res.status(200).json({
        status: 200,
        cartItems: cartItems
      });
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return res.status(500).json({
        status: 500,
        message: 'Internal Server Error'
      });
    }
  });
  


// PUT - Update quantity of a cart item
// PUT - Update quantity of a cart item
exports.updateCart = asyncHandler(async (req, res) => {
    try {
      const cartItemId = req.params.id;
      const { quantity } = req.body;
  
      const cartItem = await Cart.findById(cartItemId);
  
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
  
      cartItem.quantity = quantity;
      await cartItem.save();
  
      return res.status(200).json({
        message: 'Cart item updated successfully',
        cartItem
      });
    } catch (error) {
      console.error('Error updating cart item:', error);
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
  });
  

// DELETE - Remove a cart item
exports.deleteCart = asyncHandler(async (req, res) => {
    try {
      const cartItemId = req.params.id;
      const cartItem = await Cart.findByIdAndDelete(cartItemId);
  
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
  
      return res.status(200).json({ message: 'Cart item deleted successfully' });
    } catch (error) {
      console.error('Error deleting cart item:', error);
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
  });

  exports.countCartItems = asyncHandler(async (req, res) => {
    try {
        const count = await Cart.countDocuments();
        res.status(200).json({ count });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while counting cart items');
    }
});

