const asyncHandler = require('express-async-handler');
const SubcategoriesModel = require('../Model/SubcategoryModel');

// POST - Create a new subcategory
exports.postSubcategory = asyncHandler(async (req, res) => {
    const { name, category, maincategoriesData } = req.body;

    try {
        const newSubcategory = await SubcategoriesModel.create({
            name: name,
            category: category,
            maincategoriesData: maincategoriesData
        });

        res.status(200).json({
            message: 'Subcategory posted successfully',
            subcategory: newSubcategory
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while posting subcategory');
    }
});

// GET - Fetch all subcategories
exports.getSubcategories = asyncHandler(async (req, res) => {
    try {
        const subcategories = await SubcategoriesModel.find()
            .populate({
                path: 'category',
                populate: {
                    path: 'maincategoriesData'
                }
            })
            .exec();
        res.status(200).json(subcategories);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while fetching subcategories');
    }
});
// exports.getSubcategories = asyncHandler(async (req, res) => {
//     try {
//         // Populate category and maincategoriesData with actual data
//         const response = await SubcategoriesModel.find()
//             .populate('category')
//             .populate('maincategoriesData');

//         res.status(200).json(response);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('An error occurred while fetching subcategories');
//     }
// });

// GET - Fetch a subcategory by ID
exports.getSubcategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const response = await SubcategoriesModel.findById(id)
            .populate('category')
            .populate('maincategoriesData');

        if (!response) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while fetching subcategory');
    }
});

// PUT - Update a subcategory by ID
exports.putSubcategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, category, maincategoriesData } = req.body;

    try {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ err: 'Invalid ID format.' });
        }

        const subcategory = await SubcategoriesModel.findById(id);
        if (!subcategory) {
            return res.status(404).json({ err: 'Subcategory not found.' });
        }

        const update = { name, category, maincategoriesData };
        const updatedSubcategory = await SubcategoriesModel.findByIdAndUpdate(id, update, { new: true });

        res.status(200).json(updatedSubcategory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Error updating subcategory', message: err.message });
    }
});

// DELETE - Delete a subcategory by ID
exports.deleteSubcategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const response = await SubcategoriesModel.findByIdAndDelete(id);
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'An error occurred while deleting subcategory' });
    }
});
