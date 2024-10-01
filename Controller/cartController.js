const asyncHandler = require('express-async-handler');
const User = require('../Model/UserLoginModal'); // Adjust the model name as necessary

// Add to cart logic for authenticated users
exports.postCart = asyncHandler(async (req, res) => {
  const userId = req.payload; // Extracted from JWT Middleware
  const { dishes_id, image, newprice, dishes, color } = req.body;

  // Find the user by userId
  const user = await User.findById(userId);

  if (user) {
    // Check if the item already exists in the cart for the specific color
    const existingItem = user.cart.find(item => 
      item.dishes_id.toString() === dishes_id && item.color === color
    );
    
    if (existingItem) {
      // If item exists, update the quantity
      existingItem.quantity += 1;
    } else {
      // If item does not exist, add a new item to the cart
      user.cart.push({ dishes_id, image, newprice, dishes, color, quantity: 1 });
    }

    await user.save();
    res.status(201).json({ message: 'Item added to cart successfully!', status: 201 });
  } else {
    res.status(404).json({ message: 'User not found', status: 404 });
  }
});

exports.getCart = asyncHandler(async (req, res) => {
  const userId = req.payload; // Extracted from JWT Middleware

  // Find the user and retrieve the cart
  const user = await User.findById(userId).populate('cart.dishes_id');

  if (user && user.cart.length > 0) {
    res.status(200).json({ cartItems: user.cart });
  } else {
    res.status(404).json({ message: 'Cart not found for this user', status: 404 });
  }
});

exports.updateCart = asyncHandler(async (req, res) => {
  const userId = req.payload; // Extracted from JWT Middleware
  const { itemId } = req.params; // Assuming you pass the item ID in the route params
  const { quantity } = req.body;

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Find the cart item within the user's cart
  const cartItem = user.cart.id(itemId); // Using the subdocument method

  if (!cartItem) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  cartItem.quantity = quantity; // Update the quantity
  await user.save(); // Save the user document

  return res.status(200).json({
    message: 'Cart item updated successfully',
    cartItem
  });
});

exports.deleteCart = asyncHandler(async (req, res) => {
  const userId = req.payload; // Extracted from JWT Middleware
  const { itemId } = req.params; // The ID passed from the route

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Find the cart item within the user's cart using the `itemId`
  const cartItem = user.cart.id(itemId); // Ensure this matches the subdocument's ID

  if (!cartItem) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  cartItem.remove(); // Remove the item from the cart
  await user.save(); // Save the user document

  return res.status(200).json({ message: 'Cart item deleted successfully' });
});

exports.countCartItems = asyncHandler(async (req, res) => {
  const userId = req.payload; // Extracted from JWT Middleware

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const count = user.cart.length; // Count items in the user's cart
  res.status(200).json({ count, cartItems: user.cart }); // Return cart items as well
});



//GUEST ontroller

// Add to guest cart logic
exports.postGuestCart = asyncHandler(async (req, res) => {
  const { dishes_id, image, newprice, dishes, color } = req.body;

  // Initialize cart in session if it doesn't exist
  if (!req.session.cartItems) {
    req.session.cartItems = [];
  }

  // Check if the item already exists in the guest cart
  const existingItem = req.session.cartItems.find(item => 
    item.dishes_id === dishes_id && item.color === color
  );

  if (existingItem) {
    // If item exists, update the quantity
    existingItem.quantity += 1;
  } else {
    // If item does not exist, add a new item to the cart
    req.session.cartItems.push({ dishes_id, image, newprice, dishes, color, quantity: 1 });
  }

  res.status(201).json({ message: 'Item added to guest cart successfully!', status: 201 });
});

exports.getGuestCart = asyncHandler(async (req, res) => {
  const cartItems = req.session.cartItems || [];
  res.status(200).json({ cartItems });
});

exports.updateGuestCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params; // Assuming itemId is the index in the cartItems array
  const { quantity } = req.body;

  // Ensure the guest cart exists
  if (!req.session.cartItems) {
    return res.status(404).json({ message: 'No items found in guest cart' });
  }

  // Check if the item exists in the guest cart
  const cartItem = req.session.cartItems[itemId];

  if (!cartItem) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  cartItem.quantity = quantity; // Update the quantity
  res.status(200).json({ message: 'Guest cart item updated successfully', cartItem });
});

exports.deleteGuestCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params; // The ID passed from the route

  // Ensure the guest cart exists
  if (!req.session.cartItems) {
    return res.status(404).json({ message: 'No items found in guest cart' });
  }

  // Check if the item exists in the guest cart
  const cartItem = req.session.cartItems[itemId];

  if (!cartItem) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  req.session.cartItems.splice(itemId, 1); // Remove the item from the cart
  res.status(200).json({ message: 'Guest cart item deleted successfully' });
});

exports.countGuestCartItems = asyncHandler(async (req, res) => {
  const cartItems = req.session.cartItems || [];
  const count = cartItems.length; // Count items in the guest cart
  res.status(200).json({ count });
});

// const asyncHandler = require('express-async-handler');
// const Cart = require('../Model/CartModel');
// // const DishesModel = require('../Model/DishesModel');
// const login=require('../Model/UserLoginModal')


// // Add to cart logic in cartController.js
// exports.postCart = async (req, res) => {
//   try {
//     const userId = req.payload; // Extracted from JWT Middleware
//     const { dishes_id, image, newprice, dishes, color } = req.body;

//     // Find the user by userId
//     const user = await login.findById(userId);

//     if (user) {
//       // Check if the item already exists in the cart for the specific color
//       const existingItem = user.cart.find(item => 
//         item.dishes_id.toString() === dishes_id && item.color === color
//       );
      
//       if (existingItem) {
//         // If item exists, update the quantity
//         existingItem.quantity += 1;
//       } else {
//         // If item does not exist, add a new item to the cart
//         user.cart.push({ dishes_id, image, newprice, dishes, color, quantity: 1 });
//       }

//       await user.save();
//       res.status(201).json({ message: 'Item added to cart successfully!', status: 201 });
//     } else {
//       res.status(404).json({ message: 'User not found', status: 404 });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding item to cart', status: 500 });
//   }
// };

// exports.getCart = async (req, res) => {
//   try {
//       const userId = req.payload; // Extracted from JWT Middleware

//       // Find the user and retrieve the cart
//       const user = await login.findById(userId).populate('cart.dishes_id');

//       if (user && user.cart.length > 0) {
//           // Return cart items from the user document
//           res.status(200).json({ cartItems: user.cart });
//       } else {
//           // If no cart or user exists, return 404
//           res.status(404).json({ message: 'Cart not found for this user', status: 404 });
//       }
//   } catch (error) {
//       res.status(500).json({ message: 'Error fetching cart items', status: 500 });
//   }
// };




// exports.updateCart = asyncHandler(async (req, res) => {
//   try {
//       const userId = req.payload; // Extracted from JWT Middleware
//       const { itemId } = req.params; // Assuming you pass the item ID in the route params
//       const { quantity } = req.body;

//       // Find the user by ID
//       const user = await login.findById(userId);

//       if (!user) {
//           return res.status(404).json({ message: 'User not found' });
//       }

//       // Find the cart item within the user's cart
//       const cartItem = user.cart.id(itemId); // Using the subdocument method

//       if (!cartItem) {
//           return res.status(404).json({ message: 'Cart item not found' });
//       }

//       cartItem.quantity = quantity; // Update the quantity
//       await user.save(); // Save the user document

//       return res.status(200).json({
//           message: 'Cart item updated successfully',
//           cartItem
//       });
//   } catch (error) {
//       console.error('Error updating cart item:', error);
//       return res.status(500).json({
//           message: 'Internal Server Error'
//       });
//   }
// });




// exports.deleteCart = asyncHandler(async (req, res) => {
//   try {
//     const userId = req.payload; // Extracted from JWT Middleware
//     const { itemId } = req.params; // The ID passed from the route

//     // Log for debugging
//     console.log(`Deleting item with id: ${itemId} for user: ${userId}`);

//     // Find the user by ID
//     const user = await login.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Find the cart item within the user's cart using the `itemId`
//     const cartItem = user.cart.id(itemId); // Ensure this matches the subdocument's ID

//     if (!cartItem) {
//       return res.status(404).json({ message: 'Cart item not found' });
//     }

//     cartItem.remove(); // Remove the item from the cart
//     await user.save(); // Save the user document

//     return res.status(200).json({ message: 'Cart item deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting cart item:', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// exports.countCartItems = asyncHandler(async (req, res) => {
//   try {
//     const userId = req.payload; // Extracted from JWT Middleware

//     const user = await login.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const count = user.cart.length; // Count items in the user's cart
//     res.status(200).json({ count, cartItems: user.cart }); // Return cart items as well
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('An error occurred while counting cart items');
//   }
// });

// // Controller for counting guest cart items
// exports.countGuestCartItems = asyncHandler(async (req, res) => {
//   try {
//     const cartItems = req.session.cartItems || []; // Assuming you're using session storage for guests
//     const count = cartItems.length; // Count items in the guest cart
//     res.status(200).json({ count });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('An error occurred while counting cart items');
//   }
// });



// exports.postCart = async (req, res) => {
//     try {
//         const userId = req.payload; // Extracted from JWT Middleware
//         const { dishes_id, image, newprice, dishes, color } = req.body;

//         // Find the user's cart by userId
//         let cart = await Cart.findOne({ userId });

//         if (!cart) {
//             // Create a new cart if no cart exists for the user
//             cart = new Cart({
//                 userId,
//                 items: [{ dishes_id, image, newprice, dishes, color }]
//             });
//             await cart.save();
//         } else {
//             // If cart exists, add the new item to the cart
//             cart.items.push({ dishes_id, image, newprice, dishes, color });
//             await cart.save();
//         }

//         res.status(201).json({ message: 'Item added to cart successfully!', status: 201 });
//     } catch (error) {
//         res.status(500).json({ message: 'Error adding item to cart', status: 500 });
//     }
// };

// Fetch cart logic in cartController.js
// exports.getCart = async (req, res) => {
//     try {
//         const userId = req.payload; // Extracted from JWT Middleware

//         const cart = await Cart.findOne({ userId }).populate('items.dishes_id');

//         if (cart) {
//             res.status(200).json({ cartItems: cart.items });
//         } else {
//             res.status(404).json({ message: 'Cart not found for this user', status: 404 });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching cart items', status: 500 });
//     }
// };

// POST - Add a dish to the cart
// exports.postCart = asyncHandler(async (req, res) => {
//     try {
//         const { dishes_id, image, newprice, dishes } = req.body;

//         const dish = await DishesModel.findById(dishes_id);
//         if (!dish) {
//             return res.status(404).json({
//                 status: 404,
//                 message: 'Product not found'
//             });
//         }
//         console.log('Request Body:', req.body);

//         const existingCartItem = await Cart.findOne({ dishes_id });

//         if (existingCartItem) {
//             return res.status(409).json({
//                 status: 409,
//                 message: 'Product is already in the cart'
//             });
//         }

//         const newCartItem = new Cart({
//             dishes_id,
//             image,
//             newprice,
//             dishes
//         });

//         await newCartItem.save();

//         return res.status(201).json({
//             status: 201,
//             message: 'Product added to the cart successfully',
//             cartItem: newCartItem
//         });
//     } catch (error) {
//         console.error('Error adding dish to cart:', error);
//         return res.status(500).json({
//             status: 500,
//             message: 'Internal Server Error'
//         });
//     }
// });



// exports.getCart = asyncHandler(async (req, res) => {
//   try {
//       // Fetch all cart items without trying to populate the `newprice` from `DishesModel`
//       const cartItems = await Cart.find();  // No need for populate here

//       res.status(200).json({
//           status: 200,
//           cartItems: cartItems
//       });
//   } catch (error) {
//       console.error('Error fetching cart items:', error);
//       return res.status(500).json({
//           status: 500,
//           message: 'Internal Server Error'
//       });
//   }
// });



// PUT - Update quantity of a cart item
// PUT - Update quantity of a cart item



// exports.updateCart = asyncHandler(async (req, res) => {
//     try {
//       const cartItemId = req.params.id;
//       const { quantity } = req.body;
  
//       const cartItem = await Cart.findById(cartItemId);
  
//       if (!cartItem) {
//         return res.status(404).json({ message: 'Cart item not found' });
//       }
  
//       cartItem.quantity = quantity;
//       await cartItem.save();
  
//       return res.status(200).json({
//         message: 'Cart item updated successfully',
//         cartItem
//       });
//     } catch (error) {
//       console.error('Error updating cart item:', error);
//       return res.status(500).json({
//         message: 'Internal Server Error'
//       });
//     }
//   });
  

// // DELETE - Remove a cart item
// exports.deleteCart = asyncHandler(async (req, res) => {
//     try {
//       const cartItemId = req.params.id;
//       const cartItem = await Cart.findByIdAndDelete(cartItemId);
  
//       if (!cartItem) {
//         return res.status(404).json({ message: 'Cart item not found' });
//       }
  
//       return res.status(200).json({ message: 'Cart item deleted successfully' });
//     } catch (error) {
//       console.error('Error deleting cart item:', error);
//       return res.status(500).json({
//         message: 'Internal Server Error'
//       });
//     }
//   });

//   exports.countCartItems = asyncHandler(async (req, res) => {
//     try {
//         const count = await Cart.countDocuments();
//         res.status(200).json({ count });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('An error occurred while counting cart items');
//     }
// });

