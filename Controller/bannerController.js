const asyncHandler = require('express-async-handler');
const BannerModel = require('../Model/BannerModel');

// POST - Create a new dish
exports.postBanner = asyncHandler(async (req, res) => {
    const files = req.files;
    const image = files.map(file => file.filename);

    try {
        const newBanner = await BannerModel.create({
          image,
        });

        res.status(200).json({
            message: 'Banners posted successfully',
            banner: newBanner,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while posting the banner');
    }
});

// GET - Fetch all dishes
// GET - Fetch all banners
exports.getBanner = asyncHandler(async (req, res) => {
    try {
        const response = await BannerModel.find();
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while fetching data');
    }
});

// exports.getBanner = asyncHandler(async (req, res) => {
//     try {
//         const response = await BannerModel.find();
//         res.status(200).json(response);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('An error occurred while fetching data');
//     }
// });

exports.getBannerById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    try {
        const response = await BannerModel.findById(id);
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while fetching data');
    }
});


// PUT - Update a dish by ID
exports.putBannerById = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    // Process files if present
    const files = req.files || [];
    const image = files.map(file => file.filename);
  
    try {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            console.error('Invalid ID format.');
            return res.status(400).json({ err: 'Invalid ID format.' });
        }
  
        // Check if the dish exists
        const banner = await BannerModel.findById(id);
        if (!banner) {
            console.error('banner not found.');
            return res.status(404).json({ err: 'banner not found.' });
        }
  
        const update = {
         ...(files.length && { image })
        };
  
        const updatedData = await BannerModel.findByIdAndUpdate(id, { $set: update }, { new: true });
        res.status(200).json(updatedData);
    } catch (err) {
        console.error('Error while updating data:', err);
        res.status(500).json({ err: 'Error while updating data', message: err.message });
    }
});

// DELETE - Delete a dish by ID
exports.deleteBannerById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const response = await BannerModel.findByIdAndDelete(id);
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'An error occurred while deleting data' });
    }
});
