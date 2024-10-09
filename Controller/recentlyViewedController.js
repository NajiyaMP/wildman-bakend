// const RecentlyViewed = require('../Model/Recentlyviewed');
const Product = require('../Model/DishesModel');
const User=require('../Model/UserLoginModal');
const asyncHandler = require('express-async-handler');


// Get recently viewed products by user ID
// exports.getRecentlyViewed = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // Find the recently viewed products for the user
//     const recent = await RecentlyViewed.findOne({ userId }).populate('productIds');

//     // Return the first 5 products or an empty array if none are found
//     res.status(200).json(recent && recent.productIds ? recent.productIds.slice(0, 5) : []);
//   } catch (error) {
//     console.error('Error fetching recently viewed products:', error);
//     res.status(500).json({ message: 'Error fetching recently viewed products' });
//   }
// };



// Add or update product content in the database when viewing details
// exports.addRecentlyViewed = async (req, res) => {
//   try {
//     const { userId, productId, productData } = req.body;

//     // Check if the product already exists in the database
//     let product = await Product.findById(productId);

//     if (product) {
//       // Update the existing product with new details
//       await Product.findByIdAndUpdate(productId, { ...productData });
//       res.status(200).json({ message: 'Product details updated' });
//     } else {
//       // Add the new product details to the database
//       const newProduct = new Product({
//         _id: productId,
//         ...productData
//       });
//       await newProduct.save();
//       res.status(201).json({ message: 'Product details added to database' });
//     }

//     // Add product to Recently Viewed for the user
//     let recentlyViewed = await RecentlyViewed.findOne({ userId });

//     if (recentlyViewed) {
//       // Update recently viewed products (keeping only the latest 5)
//       if (!recentlyViewed.productIds.includes(productId)) {
//         recentlyViewed.productIds.unshift(productId);
//         if (recentlyViewed.productIds.length > 5) {
//           recentlyViewed.productIds.pop();
//         }
//       }
//     } else {
//       // Create a new recently viewed list for the user
//       recentlyViewed = new RecentlyViewed({
//         userId,
//         productIds: [productId]
//       });
//     }
//     await recentlyViewed.save();

//     res.status(200).json({ message: 'Product added to recently viewed' });
//   } catch (error) {
//     console.error('Error adding/updating product details:', error);
//     res.status(500).json({ message: 'Error adding/updating product details' });
//   }
// };

//get
// exports.postRecentlyViewed = async (req, res) => {
//   try {
//     const userId = req.payload; // Extracted from JWT Middleware
//     const { productId, productData } = req.body;

//     // Find the user by userId
//     const user = await login.findById(userId);

//     if (user) {
//       // Check if the item already exists in the recently viewed list
//       const existingItem = user.recentlyViewed.find(item => item.productId.toString() === productId);

//       if (!existingItem) {
//         // If item does not exist, add a new item to the recently viewed list
//         user.recentlyViewed.push({ productId, ...productData });
        
//         // Limit the number of recently viewed items to 5
//         if (user.recentlyViewed.length > 5) {
//           user.recentlyViewed.shift(); // Remove the oldest one
//         }
//       }

//       await user.save();
//       res.status(201).json({ message: 'Product added to recently viewed successfully!', status: 201 });
//     } else {
//       res.status(404).json({ message: 'User not found', status: 404 });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding item to recently viewed', status: 500 });
//   }
// };


exports.getRecentlyViewed = asyncHandler(async (req, res) => {
  const { id } = req.params; // Extract user ID from the request parameters
  console.log("Received userId:", id); // Log userId for debugging

  try {
    if (id) {
      // Authenticated user
      const user = await User.findById(id).populate('recentlyViewed.dishes_id'); // Only fetch recently viewed items
    console.log(user,'this is the yuser')
      
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      return res.status(200).json({ message: 'Recently viewed items fetched successfully.', recentlyViewedItems: user.recentlyViewed });
    } else {
      // Handle guest user case
      return res.status(200).json({ message: 'Guest user, no recently viewed items available.' });
    }
  } catch (error) {
    console.error("Error fetching recently viewed items:", error); // Log the error
    return res.status(500).json({ error: 'Error fetching recently viewed items.' });
  }
});


// add
// exports.addRecentlyViewed = asyncHandler(async (req, res) => {
//   const { productId, productData } = req.body;
//   const { id } = req.params;
//   console.log("Received userId:", id); // Log userId for debugging

//   try {
//     if (id) {
//       // Authenticated user
//       const user = await User.findById(id);
//       if (!user) {
//         return res.status(404).json({ message: 'User not found.' });
//       }

//       // Check if the product already exists in the database
//       let product = await Product.findById(productId);
//       if (!product) {
//         product = new Product({
//           _id: productId,
//           ...productData,
//         });
//         await product.save(); // Save product if it doesn't exist
//       }

//       const recentlyViewed = user.recentlyViewed || [];
//       const alreadyViewed = recentlyViewed.find(item => item.dishes_id.toString() === productId);

//       if (!alreadyViewed) {
//         recentlyViewed.unshift({
//           dishes_id: productId,
//           viewedAt: new Date(),
//         });

//         // Keep only the latest 5 viewed items
//         if (recentlyViewed.length > 5) {
//           recentlyViewed.pop();
//         }

//         user.recentlyViewed = recentlyViewed;
//         await user.save(); // Save updated user data
//       }

//       return res.status(200).json({ message: 'Product added to recently viewed.', recentlyViewed: user.recentlyViewed });
//     } else {
//       // Handle guest user
//       return res.status(200).json({ message: 'Guest user, recently viewed stored in session.' });
//     }
//   } catch (error) {
//     console.error("Error adding product to recently viewed:", error); // Log the error
//     return res.status(500).json({ error: 'Error adding product to recently viewed.' });
//   }
// });

exports.addRecentlyViewed = asyncHandler(async (req, res) => {
  const { productId, productData } = req.body; // Ensure productData is passed
  const { id } = req.params;

  console.log("Received userId:", id); // Log userId for debugging
  console.log("Received data:", req.body); // Log the incoming request data
  console.log("Product ID to add:", productId); // Log the productId
  console.log("Product Data:", productData); // Log the product data

  try {
    if (id) {
      // Authenticated user
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Check if the product already exists in the database
      let product = await Product.findById(productId);
      if (!product) {
        product = new Product({
          _id: productId,
          ...productData,
        });
        await product.save(); // Save product if it doesn't exist
      }

      const recentlyViewed = user.recentlyViewed || [];
      const alreadyViewed = recentlyViewed.find(item => item.dishes_id.toString() === productId);

      if (!alreadyViewed) {
        recentlyViewed.unshift({
          dishes_id: productId,
          viewedAt: new Date(),
          productData: productData, // Include product data here
        });

        // Keep only the latest 5 viewed items
        if (recentlyViewed.length > 5) {
          recentlyViewed.pop();
        }

        user.recentlyViewed = recentlyViewed;
        await user.save(); // Save updated user data
      }

      return res.status(200).json({ message: 'Product added to recently viewed.', recentlyViewed: user.recentlyViewed });
    } else {
      // Handle guest user
      return res.status(200).json({ message: 'Guest user, recently viewed stored in session.' });
    }
  } catch (error) {
    console.error("Error adding product to recently viewed:", error); // Log the error
    return res.status(500).json({ error: 'Error adding product to recently viewed.' });
  }
});




