const asyncHandler = require('express-async-handler');
const Order = require('../Model/OrderModel');  // Import Order model
const User = require('../Model/UserLoginModal');  // Import User model

// POST: Create an order
exports.postOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalAmount } = req.body;
  const userId = req.user._id;  // This will come from the decoded JWT

  try {
    // Create a new order object
    const order = new Order({
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      orderStatus: 'Processing',  // Default status
    });

    // Save the order to the database
    const createdOrder = await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: createdOrder,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
});

// GET: Get all orders (Admin only)
exports.getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

// GET: Get order by ID (Admin only)
exports.getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
});
