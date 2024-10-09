const jwt = require('jsonwebtoken');
const login=require('../Model/UserLoginModal')
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');



exports.registerClient = async (req, res) => {
  console.log("Inside Register request");
  const { username, password, email } = req.body;
  console.log(username, password, email);

  try {
      const existingUser = await login.findOne({ username });
      if (existingUser) {
          return res.status(409).json({ message: "User already exists" }); // Use 409 Conflict
      } else {
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);

          const newUser = new login({
              username,
              email,
              password: hashedPassword
          });
          await newUser.save();
          return res.status(201).json(newUser); // Use 201 Created
      }
  } catch (err) {
      console.error("Registration error:", err);
      return res.status(500).json({ message: "Internal server error" });
  }
};

exports.loginClient = async (req, res) => {
    console.log("Inside login function");
    const { username, password } = req.body;
    console.log("Login attempt for username:", username);
    
    try {
      const existingUser = await login.findOne({ username });
      if (existingUser) {
        // Compare the password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (isPasswordValid) {
          // Generate token
          const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_USERSECRET);
          console.log("Login successful, token generated:", token);
          return res.status(200).json({ user: existingUser, token });
        } else {
          console.log("Invalid password for username:", username);
          return res.status(401).json({ message: "Invalid credentials" });
        }
      } else {
        console.log("User not found:", username);
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  exports.logoutclient = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.clearCookie('connect.sid'); // Add this line to clear the session cookie
      res.status(200).json({ message: 'Logout successful' });
    });
  };
  
// Sync guest cart items with user's cart
exports.syncGuestCart = asyncHandler(async (req, res) => {
  const userId = req.payload && req.payload.userId; // Extract userId from the decoded JWT payload
  const { cartItems } = req.body; // Cart items sent from the frontend
  console.log("Syncing guest cart for userId:", userId); // Log userId for debugging

  if (!userId) {
    // Handle the case where userId is missing (i.e., guest user)
    return res.status(400).json({ message: 'Guest user cannot sync without logging in.' });
  }

  try {
    // Authenticated user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Find the user's existing cart
    let userCart = await Cart.findOne({ userId });
    if (!userCart) {
      // If no cart exists, create a new one for the user
      userCart = new Cart({ userId, items: [] });
    }

    // Sync guest cart items with user's cart
    cartItems.forEach((guestItem) => {
      const existingItem = userCart.items.find(
        (item) => item.productId.toString() === guestItem.productId && item.color === guestItem.color
      );

      if (existingItem) {
        // If the item already exists in the user's cart, update the quantity
        existingItem.quantity += guestItem.quantity;
      } else {
        // If the item doesn't exist, add it to the cart
        userCart.items.push(guestItem);
      }
    });

    // Save the updated cart
    await userCart.save();

    return res.status(200).json({ message: 'Guest cart successfully synced with user cart.' });
  } catch (error) {
    console.error("Error syncing guest cart:", error); // Log the error
    return res.status(500).json({ error: 'Error syncing guest cart.' });
  }
});

