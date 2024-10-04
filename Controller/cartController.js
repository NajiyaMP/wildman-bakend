const asyncHandler = require('express-async-handler');
const User = require('../Model/UserLoginModal'); // Adjust the model name as necessary


exports.postCart = asyncHandler(async (req, res) => {
  const { dishes_id, quantity, image, newprice, dishes, color } = req.body;
  const {id} = req.params
  console.log("Received userId:", id); // Log userId for debugging

  try {
    if (id) {
      // Authenticated user
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const existingItemIndex = user.cart.findIndex(item => item.dishes_id.toString() === dishes_id && item.color === color);

      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        user.cart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        user.cart.push({ dishes_id, quantity, image, newprice, dishes, color });
      }

      await user.save();
      return res.status(200).json({ message: 'Item added to cart successfully.', cart: user.cart });
    } else {
      // Handle guest user
      return res.status(200).json({ message: "Guest user, cart stored in session." });
    }
  } catch (error) {
    console.error("Error adding to cart:", error); // Log the error
    return res.status(500).json({ error: 'Error adding to cart.' });
  }
});



exports.postguestcart = asyncHandler(async (req, res) => {
  const { cartItems } = req.body;
  const userId = req.user._id; // From the token

  try {
    for (let item of cartItems) {
      const existingItem = await User.findOne({
        _id: userId,
        'cart.dishes_id': item.dishes_id,
        'cart.color': item.color,
      });

      if (existingItem) {
        // If item exists, update quantity
        await User.updateOne(
          { _id: userId, 'cart.dishes_id': item.dishes_id, 'cart.color': item.color },
          { $inc: { 'cart.$.quantity': item.quantity } }
        );
      } else {
        // If item doesn't exist, add it
        await User.findByIdAndUpdate(userId, {
          $push: { cart: item }
        });
      }
    }

    res.status(200).json({ message: 'Guest cart synced successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error syncing guest cart' });
  }
});

// Get cart items for the authenticated user
exports.getCart = asyncHandler(async (req, res) => {
  const { id } = req.params; // User ID from params
  console.log("Fetching cart for userId:", id); // Log userId for debugging

  try {
    if (id) {
      // Authenticated user
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      return res.status(200).json({ cart: user.cart });
    } else {
      // Handle guest user cart retrieval here
      return res.status(200).json({ message: "Guest user, cart stored in session." });
    }
  } catch (error) {
    console.error("Error fetching cart:", error); // Log the error
    return res.status(500).json({ error: 'Error fetching cart.' });
  }
});

// Update cart item quantity for authenticated users
exports.updateCart = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {userId , quantity } = req.body;

  try {
    const user = await User.findById(userId);
    if (user) {
      const item = user.cart.find(item => item.dishes_id.toString() === id);
      if (item) {
        item.quantity = quantity;
        await user.save();
        return res.status(200).json(user.cart);
      }
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    return res.status(500).json({ error: 'Error updating cart.' });
  }
});

// Delete cart item for authenticated users
exports.deleteCart = asyncHandler(async (req, res) => {
  const { id } = req.params;
const{userId,color}=req.body;
console.log(req.params,'this is params')
console.log(req.body,'this is  body')

try {
  // Find the user by userId
  const user = await User.findById(userId);
  console.log(user,'this is user')
  if (!user) {
      return res.status(404).json({ message: 'User not found' });
  }

  // Check if the cart item exists in the user's cart
  const cartItemIndex = user.cart.findIndex(item => 
      item._id.toString() === id 
  );

  if (cartItemIndex === -1) {
      return res.status(404).json({ message: 'Cart item not found' });
  }

  // Remove the cart item from the cart array
  user.cart.splice(cartItemIndex, 1);

  // Save the updated user document
  await user.save();

  res.status(200).json({ message: 'Cart item deleted successfully', cart: user.cart });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Server error' });
}
});

exports.countCartItems = asyncHandler(async (req, res) => {
  const id = req.payload; // Extracted from JWT middleware

  // Find the user in the database
  const user = await User.findById(id);

  if (!user) {
      return res.status(404).json({ message: 'User not found', status: 404 });
  }

  // Count the number of items in the user's cart
  const cartCount = user.cart.reduce((total, item) => total + item.quantity, 0);

  return res.status(200).json({ cartCount });
});



// const asyncHandler = require('express-async-handler');
// const Cart = require('../Model/CartModel'); // Adjust the path as needed

// // POST - Add an item to the cart
// exports.postCart = asyncHandler(async (req, res) => {
//     const { userId, dishes_id, image, newprice, dishes, quantity } = req.body;

//     try {
//         // Check if the item already exists in the user's cart
//         const existingCartItem = await Cart.findOne({ userId, dishes_id, image });
        
//         if (existingCartItem) {
//             // If the item exists, update the quantity
//             existingCartItem.quantity += quantity;
//             await existingCartItem.save();
//             return res.status(200).json({ message: 'Cart updated successfully', status: 200 });
//         } else {
//             // If it doesn't exist, create a new cart item
//             const newCartItem = await Cart.create({
//                 userId,
//                 dishes_id,
//                 image,
//                 newprice,
//                 dishes,
//                 quantity,
//             });
//             return res.status(201).json({ message: 'Item added to cart successfully', cartItem: newCartItem, status: 201 });
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Internal server error', error: err.message });
//     }
// });

// // PUT - Update item quantity in the cart
// exports.updateCart = asyncHandler(async (req, res) => {
//     const { userId, dishes_id, quantity } = req.body;

//     try {
//         const cartItem = await Cart.findOne({ userId, dishes_id });
//         if (!cartItem) {
//             return res.status(404).json({ message: 'Item not found in cart', status: 404 });
//         }

//         cartItem.quantity = quantity; // Update the quantity
//         await cartItem.save();
//         return res.status(200).json({ message: 'Cart item updated successfully', status: 200 });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Internal server error', error: err.message });
//     }
// });

// // DELETE - Remove an item from the cart
// exports.deleteCart = asyncHandler(async (req, res) => {
//     const { userId, dishes_id } = req.body;

//     try {
//         const result = await Cart.findOneAndDelete({ userId, dishes_id });
//         if (!result) {
//             return res.status(404).json({ message: 'Item not found in cart', status: 404 });
//         }

//         return res.status(200).json({ message: 'Item removed from cart successfully', status: 200 });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Internal server error', error: err.message });
//     }
// });

// exports.countCartItems = asyncHandler(async (req, res) => {
//   const userId = req.payload.userId; // Extracted from JWT Middleware

//   try {
//       // Count items in the user's cart
//       const cartItems = await Cart.find({ userId }).populate('dishes_id'); // Populate if needed
//       const count = cartItems.length; // Get the count of items

//       res.status(200).json({ count, cartItems }); // Return the count and cart items
//   } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Internal server error', error: err.message });
//   }
// });


// // GET - Get cart items for a specific user
// exports.getCart = asyncHandler(async (req, res) => {
//     const { userId } = req.params;

//     try {
//         const cartItems = await Cart.find({ userId }).populate('dishes_id'); // Populate with dish data if needed
//         return res.status(200).json({ cartItems });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Internal server error', error: err.message });
//     }
// });


// Add to cart logic for authenticated and guest users


// Add to cart logic for authenticated and guest users

// POST /admin/guestaddtocart

//   const { dishes_id, image, newprice, dishes, color } = req.body;

//   // Validate incoming data
//   if (!dishes_id || !image || !newprice || !dishes || !color) {
//     return res.status(400).json({ message: 'All fields are required', status: 400 });
//   }

//   let user; // Declare the user variable here
//   const authenticatedUserId = req.payload.userId; // This should now work correctly

//   try {
//     // Check if the user is authenticated
//     if (req.token) {
//       user = await User.findById(authenticatedUserId);
//       if (!user) return res.status(404).json({ message: 'Authenticated user not found', status: 404 });

//       // Check if item already exists in the user's cart
//       const existingItem = user.cart.find(item => 
//           item.dishes_id.equals(Types.ObjectId(dishes_id)) && item.color === color
//       );

//       if (existingItem) {
//         existingItem.quantity += 1; // Increment quantity if item exists
//         await user.save();
//         return res.status(409).json({ message: 'Item already in cart, quantity increased', status: 409 });
//       }

//       // Create new cart item
//       user.cart.push({ dishes_id: Types.ObjectId(dishes_id), image, newprice, dishes, color, quantity: 1 });
//       await user.save();
      
//       return res.status(201).json({ message: 'Item added to cart successfully', status: 201 });

//     } else {
//       // For guest users, use session storage
//       if (!req.session.cart) {
//         req.session.cart = []; // Initialize cart if it doesn't exist
//       }

//       // Check if item already exists in the session cart
//       const existingItem = req.session.cart.find(item => 
//           item.dishes_id === dishes_id && item.color === color
//       );

//       if (existingItem) {
//         existingItem.quantity += 1; // Increment quantity if item exists
//         return res.status(409).json({ message: 'Item already in cart, quantity increased', status: 409 });
//       }

//       // Create new cart item for session
//       req.session.cart.push({ dishes_id, image, newprice, dishes, color, quantity: 1 });
//       return res.status(201).json({ message: 'Item added to cart successfully', status: 201 });
//     }
//   } catch (error) {
//     console.error('Error adding item to cart:', error); // Log error for debugging
//     return res.status(500).json({ message: 'Internal Server Error', status: 500 });
//   }
// });


// Add to cart logic for authenticated users
// exports.postCart = asyncHandler(async (req, res) => {
//   const { dishes_id, image, newprice, dishes, color } = req.body;

//   // Log the incoming request data for debugging
//   console.log("Request body:", req.body);

//   let user;

//   // Check if the request is authenticated (token present)
//   if (req.token) {
//     // Authenticated user: Extract userId from the token payload
//     const authenticatedUserId = req.payload; // This comes from JWT middleware
//     console.log("Authenticated userId from token:", authenticatedUserId); // Log for debugging

//     user = await User.findById(authenticatedUserId);
//     if (!user) {
//       return res.status(404).json({ message: 'Authenticated user not found', status: 404 });
//     }
//   } else {
//     // Guest user: Expect userId in the request body
//     const { userId } = req.body;
//     console.log("Guest userId from request:", userId);

//     if (!userId) {
//       return res.status(400).json({ message: 'Guest userId is required', status: 400 });
//     }

//     // Find or create guest user in the database using guestId
//     user = await User.findOne({ guestId: userId });
//     if (!user) {
//       // Create a new guest user document if not found
//       user = new User({ guestId: userId, cart: [] });
//       await user.save();
//     }
//   }

//   if (user) {
//     // Validate the presence of required fields
//     if (!dishes_id || !newprice || !dishes || !color || !image || image.length === 0) {
//       return res.status(400).json({ message: 'Incomplete cart data provided' });
//     }

//     // Check if the item already exists in the cart for the specific color
//     const existingItem = user.cart.find(item =>
//       item.dishes_id.toString() === dishes_id && item.color === color
//     );

//     if (existingItem) {
//       // If the item exists, update its quantity
//       existingItem.quantity += 1;
//     } else {
//       // If the item does not exist, add a new item to the cart
//       user.cart.push({ dishes_id, image, newprice, dishes, color, quantity: 1 });
//     }

//     // Save the updated user document
//     await user.save();
//     res.status(201).json({ message: 'Item added to cart successfully!', status: 201 });
//   } else {
//     res.status(404).json({ message: 'User not found', status: 404 });
//   }
// });


// exports.getCart = asyncHandler(async (req, res) => {
//   const userId = req.payload; // Extracted from JWT Middleware

//   try {
//     // Find the user and retrieve the cart
//     const user = await User.findById(userId).populate('cart.dishes_id');

//     if (user && user.cart.length > 0) {
//       res.status(200).json({ cartItems: user.cart });
//     } else {
//       res.status(404).json({ message: 'Cart not found for this user', status: 404 });
//     }
//   } catch (error) {
//     console.error('Error retrieving cart:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });

// // Cart Controller

// exports.updateCart = asyncHandler(async (req, res) => {
//   const token = req.headers.authorization; // Extract token from headers
//   const { itemId } = req.params; // Assuming you pass the item ID in the route params
//   const { quantity } = req.body;

//   if (token) {
//     // Authenticated user
//     const userId = req.payload; // Extracted from JWT Middleware

//     // Find the user by ID
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Find the cart item within the user's cart
//     const cartItem = user.cart.id(itemId); // Using the subdocument method
//     if (!cartItem) {
//       return res.status(404).json({ message: 'Cart item not found' });
//     }

//     cartItem.quantity = quantity; // Update the quantity
//     await user.save(); // Save the user document

//     return res.status(200).json({
//       message: 'Cart item updated successfully',
//       cartItem
//     });
//   } else {
//     // Guest user
//     const storedCart = JSON.parse(sessionStorage.getItem('cartItems')) || [];
//     const cartItemIndex = storedCart.findIndex(item => item._id === itemId);
    
//     if (cartItemIndex === -1) {
//       return res.status(404).json({ message: 'Cart item not found for guest' });
//     }

//     storedCart[cartItemIndex].quantity = quantity; // Update the quantity
//     sessionStorage.setItem('cartItems', JSON.stringify(storedCart)); // Save back to session storage

//     return res.status(200).json({
//       message: 'Guest cart item updated successfully',
//       cartItem: storedCart[cartItemIndex]
//     });
//   }
// });


// exports.countCartItems = asyncHandler(async (req, res) => {
//   const userId = req.payload; // Extracted from JWT Middleware

//   const user = await User.findById(userId);
//   if (!user) {
//     return res.status(404).json({ message: 'User not found' });
//   }

//   const count = user.cart.length; // Count items in the user's cart
//   res.status(200).json({ count, cartItems: user.cart }); // Return cart items as well
// });


// exports.deleteCart = asyncHandler(async (req, res) => {
//   const purchase = await User.findByIdAndDelete(userId);
//   res.status(200).json(purchase);
// });
