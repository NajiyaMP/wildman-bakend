const RecentlyViewed = require('../Model/Recentlyviewed');
const Product = require('../Model/DishesModel');

// Get recently viewed products by user ID
exports.getRecentlyViewed = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the recently viewed products for the user
    const recent = await RecentlyViewed.findOne({ userId }).populate('productIds');

    // Return the first 5 products or an empty array if none are found
    res.status(200).json(recent && recent.productIds ? recent.productIds.slice(0, 5) : []);
  } catch (error) {
    console.error('Error fetching recently viewed products:', error);
    res.status(500).json({ message: 'Error fetching recently viewed products' });
  }
};



// Add or update product content in the database when viewing details
exports.addRecentlyViewed = async (req, res) => {
  try {
    const { userId, productId, productData } = req.body;

    // Check if the product already exists in the database
    let product = await Product.findById(productId);

    if (product) {
      // Update the existing product with new details
      await Product.findByIdAndUpdate(productId, { ...productData });
      res.status(200).json({ message: 'Product details updated' });
    } else {
      // Add the new product details to the database
      const newProduct = new Product({
        _id: productId,
        ...productData
      });
      await newProduct.save();
      res.status(201).json({ message: 'Product details added to database' });
    }

    // Add product to Recently Viewed for the user
    let recentlyViewed = await RecentlyViewed.findOne({ userId });

    if (recentlyViewed) {
      // Update recently viewed products (keeping only the latest 5)
      if (!recentlyViewed.productIds.includes(productId)) {
        recentlyViewed.productIds.unshift(productId);
        if (recentlyViewed.productIds.length > 5) {
          recentlyViewed.productIds.pop();
        }
      }
    } else {
      // Create a new recently viewed list for the user
      recentlyViewed = new RecentlyViewed({
        userId,
        productIds: [productId]
      });
    }
    await recentlyViewed.save();

    res.status(200).json({ message: 'Product added to recently viewed' });
  } catch (error) {
    console.error('Error adding/updating product details:', error);
    res.status(500).json({ message: 'Error adding/updating product details' });
  }
};
