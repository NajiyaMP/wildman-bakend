//new
const asyncHandler = require('express-async-handler');
const MaincategoriesModel = require('../Model/MaincategoriesModel');
const CategoriesModel = require('../Model/CategoriesModel'); // Import CategoriesModel

exports.postMaincategories = asyncHandler(async (req, res) => {
    const { maincategories } = req.body;
    
    try {
        await MaincategoriesModel.create({
            maincategories: maincategories
        });
        res.status(200).send('MainCategories posted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while posting categories');
    }
});

exports.getMaincategories = asyncHandler(async (req, res) => {
    try {
        const response = await MaincategoriesModel.find();
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while fetching data');
    }
});

exports.getMaincategoriesById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    try {
        const response = await MaincategoriesModel.findById(id);
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while fetching data');
    }
});

exports.putMaincategoriesById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { maincategories } = req.body;

    try {
        const update = { maincategories };
        const updatedData = await MaincategoriesModel.findByIdAndUpdate(id, { $set: update }, { new: true });
        res.status(200).json(updatedData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Error while updating data' });
    }
});

exports.countMaincategories = asyncHandler(async (req, res) => {
    try {
        const count = await MaincategoriesModel.countDocuments();
        res.status(200).json({ count });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while counting main categories');
    }
});


exports.deleteMaincategoriesById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const response = await MaincategoriesModel.findByIdAndDelete(id);
        // When deleting a main category, also delete associated categories
        await CategoriesModel.deleteMany({ maincategoriesData: id });
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'An error occurred while deleting data' });
    }
});










//Orginal

// var asynchandler = require('express-async-handler')
// var maincategoriesModel = require('../Model/MaincategoriesModel')


// exports.postMaincategories = asynchandler(async(req, res)=>{
//     const {maincategories} = req.body
    
//     try{
//         await maincategoriesModel.create({
//             maincategories:maincategories
//         })
//         res.status(200).send('MainCategories posted successfully')
//     }catch(err){
//         console.log(err)
//         res.status(500).send('An error occured while posting categories')
//     }
// })

// exports.getMaincategories = asynchandler(async(req,res)=>{
//     try{
//         const response = await maincategoriesModel.find()
//         res.status(200).json(response)
//     }catch(err){
//         console.log(err)
//         res.status(500).send('An error occured while fetching data')
//     }
// })

// exports.getMaincategoriesById = asynchandler(async(req,res)=>{
//     const {id} = req.params
//     console.log(req.params, 'the id is here')
//     try{
//         const response = await maincategoriesModel.findById(id)
//         res.status(200).json(response)
//     }catch(err){
//         console.log(err)
//         res.status(500).send('An error occured while fetching data')
//     }
// })

// // exports.putMaincategoriesById = asynchandler(async(req, res)=>{
// //     const {id} = req.params;
// //     const {Maincategories} = req.body;
   
// //     try{
    
// //         const update = {
// //             Maincategories:Maincategories
// //         }
// //         const updateData = await maincategoriesModel.findByIdAndUpdate(id, {$set:update}, {new:true})
// //         res.status(200).json(updateData)
       
// //     }catch(err){
// //         res.status(500).json({err:'error while updating data'})
// //     }
// // })

// exports.putMaincategoriesById = asynchandler(async (req, res) => {
//     const { id } = req.params;
//     const { maincategories } = req.body; // Use lowercase consistently

//     try {
//         const update = { maincategories }; // Use lowercase consistently
//         const updateData = await maincategoriesModel.findByIdAndUpdate(id, { $set: update }, { new: true });
//         res.status(200).json(updateData);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ err: 'Error while updating data' });
//     }
// });


// exports.deleteMaincategoriesById = asynchandler(async(req, res)=>{
//     const {id} = req.params
//     try{
//         const response = await maincategoriesModel.findByIdAndDelete(id)
//         res.status(200).json(response)
//     }catch(err){
//         console.log(err)
//     }
// })