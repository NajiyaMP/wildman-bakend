// const RecentlyViewed = require('../Model/Recentlyviewed');
const Product = require('../Model/DishesModel');
const login=require('../Model/UserLoginModal')

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

const mongoose = require('mongoose');

exports.getRecentlyViewed = async (req, res) => {
    try {
        const userId = req.payload.userId; // Extract userId from the JWT payload

        // Validate if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId', status: 400 });
        }

        // Find the user and populate recently viewed dishes
        const user = await logins.findById(userId).populate('recentlyViewed.dishes_id');

        // Check if user exists and has recently viewed items
        if (user && user.recentlyViewed.length > 0) {
            return res.status(200).json({ recentlyViewedItems: user.recentlyViewed });
        } else {
            return res.status(404).json({ message: 'No recently viewed items found for this user', status: 404 });
        }
    } catch (error) {
        console.error('Error fetching recently viewed items:', error);
        return res.status(500).json({ message: 'Error fetching recently viewed items', status: 500 });
    }
};


// add
exports.addRecentlyViewed = async (req, res) => {
  try {
    const userId = req.payload; // Extracted from JWT Middleware
    const { productId, productData } = req.body;

    // Check if the user exists
    const user = await login.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the product already exists in the database
    let product = await Product.findById(productId);
    if (!product) {
      // If product does not exist, create it
      product = new Product({
        _id: productId,
        ...productData,
      });
      await product.save();
    }

    // Add or update the recently viewed products
    const recentlyViewed = user.recentlyViewed;

    // Check if the product is already in the recently viewed list
    const alreadyViewed = recentlyViewed.find(item => item.dishes_id.toString() === productId);
    if (!alreadyViewed) {
      recentlyViewed.unshift({
        dishes_id: productId, // Ensure you're using the correct key
        viewedAt: new Date(),
      });
      
      // Keep only the latest 5 viewed items
      if (recentlyViewed.length > 5) {
        recentlyViewed.pop(); // Remove the oldest viewed item
      }
      
      user.recentlyViewed = recentlyViewed;
      await user.save();
    }

    res.status(200).json({ message: 'Product added to recently viewed' });
  } catch (error) {
    console.error('Error adding product to recently viewed:', error);
    res.status(500).json({ message: 'Error adding product to recently viewed' });
  }
};


exports.addGuestRecentlyViewed = async (req, res) => {
  try {
    const { productId, productData } = req.body;

    // Implement logic to handle guest recently viewed items
    // For example, store in a database or session if needed.

    // Return success response
    res.status(200).json({ message: 'Guest product added to recently viewed' });
  } catch (error) {
    console.error('Error adding guest product to recently viewed:', error);
    res.status(500).json({ message: 'Error adding guest product to recently viewed' });
  }
};
