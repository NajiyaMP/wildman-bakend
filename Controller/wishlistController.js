const asyncHandler = require('express-async-handler');
const Wishlist = require('../Model/WishlistModel');
const Product = require('../Model/DishesModel');

// POST - Add a product to the wishlist
exports.postwishlist = asyncHandler(async (req, res) => {
    try {
        const { product_id, image, price, product_name, user_id } = req.body;

        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({
                status: 404,
                message: 'Product not found'
            });
        }

        const existingWishlistItem = await Wishlist.findOne({ product_id, user_id });

        if (existingWishlistItem) {
            return res.status(409).json({
                status: 409,
                message: 'Product is already in the wishlist'
            });
        }

        const newWishlistItem = new Wishlist({
            user_id,
            product_id,
            image,
            price,
            product_name
        });

        await newWishlistItem.save();

        return res.status(201).json({
            status: 201,
            message: 'Product added to the wishlist successfully',
            wishlistItem: newWishlistItem
        });
    } catch (error) {
        console.error('Error adding product to wishlist:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error'
        });
    }
});

// GET - Fetch all wishlist items
exports.getwishlist = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.userId;
        const wishlistItems = await Wishlist.find({ user_id: userId })
            .populate('product_id', ['product_name', 'price', 'image']); // Populate fields from ProductModel

        return res.status(200).json({
            status: 200,
            wishlistItems
        });
    } catch (error) {
        console.error('Error fetching wishlist items:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error'
        });
    }
});

// PUT - Update a wishlist item (for example, if you allow changing notes or quantity)
exports.putwishlistById = asyncHandler(async (req, res) => {
    try {
        const wishlistItemId = req.params.id;
        const { note } = req.body; // Example field to update, like a note

        const wishlistItem = await Wishlist.findById(wishlistItemId);

        if (!wishlistItem) {
            return res.status(404).json({ message: 'Wishlist item not found' });
        }

        wishlistItem.note = note;
        await wishlistItem.save();

        return res.status(200).json({
            message: 'Wishlist item updated successfully',
            wishlistItem
        });
    } catch (error) {
        console.error('Error updating wishlist item:', error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

// DELETE - Remove a wishlist item
exports.deletewishlistById = asyncHandler(async (req, res) => {
    try {
        const wishlistItemId = req.params.id;
        const wishlistItem = await Wishlist.findByIdAndDelete(wishlistItemId);

        if (!wishlistItem) {
            return res.status(404).json({ message: 'Wishlist item not found' });
        }

        return res.status(200).json({ message: 'Wishlist item deleted successfully' });
    } catch (error) {
        console.error('Error deleting wishlist item:', error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

// GET - Count wishlist items for a user
exports.countwishlist = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.userId;
        const count = await Wishlist.countDocuments({ user_id: userId });

        return res.status(200).json({ count });
    } catch (err) {
        console.error('Error counting wishlist items:', err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});
