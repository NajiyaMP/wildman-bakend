//latest
const asyncHandler = require('express-async-handler');
const CategoriesModel = require('../Model/CategoriesModel');

exports.postCategories = asyncHandler(async (req, res) => {
    const { name, maincategoriesData } = req.body;

    try {
        const newCategory = await CategoriesModel.create({
            name: name,
            maincategoriesData: maincategoriesData
        });
        res.status(200).json({
            message: 'Category posted successfully',
            category: newCategory
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while posting category');
    }
});


exports.getCategories = async (req, res) => {
    try {
        // Populate maincategoriesData with actual data
        const response = await CategoriesModel.find().populate('maincategoriesData');
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while fetching data');
    }
};

exports.getCategoriesById = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await CategoriesModel.findById(id).populate('maincategoriesData');
        res.status(200).json(response); // Ensure response contains the data you expect
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while fetching data');
    }
};


    exports.putCategoriesById = async (req, res) => {
    const { id } = req.params;
    const { name, maincategoriesData } = req.body;

    try {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ err: 'Invalid ID format.' });
        }

        const category = await CategoriesModel.findById(id);
        if (!category) {
            return res.status(404).json({ err: 'Category not found.' });
        }

        const update = { name, maincategoriesData };
        const updatedCategory = await CategoriesModel.findByIdAndUpdate(id, update, { new: true });
        res.status(200).json(updatedCategory);
    } catch (err) {
        res.status(500).json({ err: 'Error updating category', message: err.message });
    }
};



// exports.putCategoriesById = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const { name, maincategoriesData } = req.body;

//     try {
//         const update = { name, maincategoriesData };
//         const updatedData = await CategoriesModel.findByIdAndUpdate(id, { $set: update }, { new: true });
//         res.status(200).json(updatedData); // Ensure response contains updated data
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ err: 'Error while updating data' });
//     }
// });

exports.deleteCategoriesById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const response = await CategoriesModel.findByIdAndDelete(id);
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'An error occurred while deleting data' });
    }
});



exports.countCategories = asyncHandler(async (req, res) => {
    try {
        const count = await CategoriesModel.countDocuments();
        res.status(200).json({ count });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while counting categories');
    }
});





//try-1
// var asynchandler = require('express-async-handler');
// var categoriesModel = require('../Model/CategoriesModel');

// exports.postCategories = asynchandler(async (req, res) => {
//     const { categories, maincategories } = req.body;

//     try {
//         const newCategories = await categoriesModel.create({
//             categories: categories,
//             maincategories: maincategories
//         });
//         res.status(200).send('Categories posted successfully');
//         categories: newCategories

//     } catch (err) {
//         console.log(err);
//         res.status(500).send('An error occurred while posting categories');
//     }
// });
// exports.getCategories = async (req, res) => {
//     const search = req.query.search;
//     console.log(search, "the search term"); // Log the search term
//     try {
//         const query = {};
//         if (search) {
//             query.$or = [
//                 { maincategories: { $regex: search, $options: 'i' } }
//             ];
//         }
//         console.log(query, "the query"); // Log the formed query
//         const response = await categoriesModel.find(query);
//         console.log(response, "the response"); // Log the response from the database
//         res.status(200).json(response);
//     } catch (err) {
//         console.error(err); // Log any errors
//         res.status(500).send('An error occurred while fetching data');
//     }
// };

// exports.getCategoriesByMainCategoryId = async (req, res) => {
//     const { mainCategoryId } = req.params;
//     try {
//         const response = await categoriesModel.find({ maincategories: mainCategoryId });
//         res.status(200).json(response);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('An error occurred while fetching data');
//     }
// };
// // exports.getCategoriesById = asynchandler(async (req, res) => {
// //     const { id } = req.params;
// //     console.log(req.params, 'the id is here');
// //     try {
// //         const response = await categoriesModel.findById(id);
// //         res.status(200).json(response);
// //     } catch (err) {
// //         console.log(err);
// //         res.status(500).send('An error occurred while fetching data');
// //     }
// // });

// exports.putCategoriesById = asynchandler(async (req, res) => {
//     const { id } = req.params;
//     const { categories, maincategories } = req.body;

//     try {
//         const update = {
//             categories: categories,
//             maincategories: maincategories
//         };
//         const updateData = await categoriesModel.findByIdAndUpdate(id, { $set: update }, { new: true });
//         res.status(200).json(updateData);
//     } catch (err) {
//         res.status(500).json({ err: 'error while updating data' });
//     }
// });

// exports.deleteCategoriesById = asynchandler(async (req, res) => {
//     const { id } = req.params;
//     try {
//         const response = await categoriesModel.findByIdAndDelete(id);
//         res.status(200).json(response);
//     } catch (err) {
//         console.log(err);
//         res.status(500).send('An error occurred while deleting data');
//     }
// });






//orginal

// var asynchandler = require('express-async-handler')
// var catagoriesModel = require('../Model/CategoriesModel')


// exports.postCategories = asynchandler(async(req, res)=>{
//     const {categories} = req.body
    
//     try{
//         await catagoriesModel.create({
//             categories:categories
//         })
//         res.status(200).send('Categories posted successfully')
//     }catch(err){
//         console.log(err)
//         res.status(500).send('An error occured while posting categories')
//     }
// })

// exports.getCategories = asynchandler(async(req,res)=>{
//     try{
//         const response = await catagoriesModel.find()
//         res.status(200).json(response)
//     }catch(err){
//         console.log(err)
//         res.status(500).send('An error occured while fetching data')
//     }
// })

// exports.getCategoriesById = asynchandler(async(req,res)=>{
//     const {id} = req.params
//     console.log(req.params, 'the id is here')
//     try{
//         const response = await catagoriesModel.findById(id)
//         res.status(200).json(response)
//     }catch(err){
//         console.log(err)
//         res.status(500).send('An error occured while fetching data')
//     }
// })

// exports.putCategoriesById = asynchandler(async(req, res)=>{
//     const {id} = req.params;
//     const {categories} = req.body;
   
   

//     try{
    
//         const update = {
//            categories:categories
//         }
//         const updateData = await catagoriesModel.findByIdAndUpdate(id, {$set:update}, {new:true})
//         res.status(200).json(updateData)
       
//     }catch(err){
//         res.status(500).json({err:'error while updating data'})
//     }
// })

// exports.deleteCategoriesById = asynchandler(async(req, res)=>{
//     const {id} = req.params
//     try{
//         const response = await catagoriesModel.findByIdAndDelete(id)
//         res.status(200).json(response)
//     }catch(err){
//         console.log(err)
//     }
// })











