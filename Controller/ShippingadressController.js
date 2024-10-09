const asyncHandler = require('express-async-handler');
const User = require('../Model/UserLoginModal'); // Adjust the model name as necessary
const Address = require('../Model/ShippingAdressModel');

exports.postShippingAddress = asyncHandler(async (req, res) => {
  const { name, mobileNo, pinCode, address, locality } = req.body;

  // Extract userId from the decoded token in req.payload
  const userId = req.payload.userId;  
  console.log("Received userId from token payload:", userId); // Debugging

  try {
    // Validate required fields
    if (!name || !mobileNo || !pinCode || !address || !locality) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (userId) {
      // Authenticated user logic
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Create a new address object
      const newAddress = new Address({
        user: userId, // Link address to the authenticated user
        name,
        mobileNo,
        pinCode,
        address,
        locality,
      });

      // Save the address to the database
      const createdAddress = await newAddress.save();

      // Optionally associate the saved address with the user
      user.shippingAddresses.push(createdAddress._id); // Change here to push to array
      await user.save();

      res.status(201).json({
        message: 'Shipping address added successfully.',
        address: createdAddress,
      });
    } else {
      // Handle guest users if needed
      return res.status(200).json({ message: "Guest user, no shipping address saved." });
    }
  } catch (error) {
    console.error("Error adding shipping address:", error); // Log the error
    return res.status(500).json({ error: 'Error adding shipping address.' });
  }
});


exports.getShippingAddresses = asyncHandler(async (req, res) => {
  try {
    // Extract userId from the decoded token in req.payload
    const userId = req.payload.userId;
    console.log("Fetching shipping addresses for userId:", userId); // Debugging

    // Check if the user exists and populate shippingAddresses
    const user = await User.findById(userId).populate('shippingAddresses'); // Make sure this matches your User model
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the user has shipping addresses
    if (!user.shippingAddresses || user.shippingAddresses.length === 0) {
      return res.status(404).json({ message: 'No shipping addresses found for this user.' });
    }

    // Return the user's shipping addresses data to the frontend
    res.status(200).json({
      message: 'Shipping addresses fetched successfully.',
      addresses: user.shippingAddresses, // Return the populated addresses
    });
  } catch (error) {
    console.error("Error fetching shipping addresses:", error); // Log the error
    res.status(500).json({ error: 'Error fetching shipping addresses.' });
  }
});


exports.updateShippingAddress = asyncHandler(async (req, res) => {
  try {
    const userId = req.payload.userId; // Extract userId from the token payload
    const { addressId } = req.params; // Get address ID from the request parameters
    const updatedData = req.body; // Get updated address data from the request body

    console.log("Updating shipping address for userId:", userId, "addressId:", addressId); // Debugging

    // Check if the user exists
    const user = await User.findById(userId).populate('shippingAddresses');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Find the address to update
    const addressIndex = user.shippingAddresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found.' });
    }

    // Update the address with the new data
    user.shippingAddresses[addressIndex] = { ...user.shippingAddresses[addressIndex]._doc, ...updatedData };
    await user.save(); // Save the user with the updated address

    res.status(200).json({
      message: 'Shipping address updated successfully.',
      address: user.shippingAddresses[addressIndex], // Return the updated address
    });
  } catch (error) {
    console.error("Error updating shipping address:", error); // Log the error
    res.status(500).json({ error: 'Error updating shipping address.' });
  }
});


exports.deleteShippingAddress = asyncHandler(async (req, res) => {
  try {
    const userId = req.payload.userId; // Extract userId from the token payload
    const { addressId } = req.params; // Get address ID from the request parameters

    console.log("Deleting shipping address for userId:", userId, "addressId:", addressId); // Debugging

    // Check if the user exists
    const user = await User.findById(userId).populate('shippingAddresses');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Find the address to delete
    const addressIndex = user.shippingAddresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found.' });
    }

    // Remove the address from the user's shipping addresses
    user.shippingAddresses.splice(addressIndex, 1);
    await user.save(); // Save the user with the updated address list

    res.status(200).json({ message: 'Shipping address deleted successfully.' });
  } catch (error) {
    console.error("Error deleting shipping address:", error); // Log the error
    res.status(500).json({ error: 'Error deleting shipping address.' });
  }
});

// exports.postShippingAddress = asyncHandler(async (req, res) => {
//   const { name, mobileNo, pinCode, address, locality } = req.body;
  
//   // Extract userId from the decoded token in req.payload
//   const userId = req.payload.userId;  
//   console.log("Received userId from token payload:", userId); // Debugging

//   try {
//     // Validate required fields
//     if (!name || !mobileNo || !pinCode || !address || !locality) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     if (userId) {
//       // Authenticated user logic
//       const user = await User.findById(userId);
//       if (!user) {
//         return res.status(404).json({ message: 'User not found.' });
//       }

//       // Create a new address object
//       const newAddress = new Address({
//         user: userId, // Link address to the authenticated user
//         name,
//         mobileNo,
//         pinCode,
//         address,
//         locality,
//       });

//       // Save the address to the database
//       const createdAddress = await newAddress.save();

//       // Optionally associate the saved address with the user
//       user.shippingAddress = createdAddress._id;
//       await user.save();

//       res.status(201).json({
//         message: 'Shipping address added successfully.',
//         address: createdAddress,
//       });
//     } else {
//       // Handle guest users if needed
//       return res.status(200).json({ message: "Guest user, no shipping address saved." });
//     }
//   } catch (error) {
//     console.error("Error adding shipping address:", error); // Log the error
//     return res.status(500).json({ error: 'Error adding shipping address.' });
//   }
// });


// Fetch Shipping Address for Authenticated User
// Fetch Shipping Address for Authenticated User
// exports.getShippingAddresses = asyncHandler(async (req, res) => {
//   try {
//     // Extract userId from the decoded token in req.payload
//     const userId = req.payload.userId;
//     console.log("Fetching shipping address for userId:", userId); // Debugging

//     // Check if the user exists
//     const user = await User.findById(userId).populate('shippingAddress');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     // Check if user has a shipping address
//     if (!user.shippingAddress) {
//       return res.status(404).json({ message: 'No shipping address found for this user.' });
//     }

//     // Fetch the user's shipping address
//     const address = await Address.findById(user.shippingAddress);
//     if (!address) {
//       return res.status(404).json({ message: 'Shipping address not found.' });
//     }

//     // Return the address data to the frontend
//     res.status(200).json({
//       message: 'Shipping address fetched successfully.',
//       address,
//     });
//   } catch (error) {
//     console.error("Error fetching shipping address:", error); // Log the error
//     res.status(500).json({ error: 'Error fetching shipping address.' });
//   }
// });

