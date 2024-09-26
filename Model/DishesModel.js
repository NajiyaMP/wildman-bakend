const mongoose = require('mongoose');

const dishesModel = new mongoose.Schema({
    Itemnumber: { type: String },
    images: { // Modify the images field
        type: Map,
        of: [{ type: String }] // Each color can have an array of images
    },
    oldprice: { type: Number },
    newprice: { type: Number },
    dishes: { type: String },
    color: { type: String },
    features: { type: String },
    manufacturer: { type: String },
    productcare: { type: String },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoriesData', required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubcategoriesData' },
    createdAt: { type: Date, default: Date.now }
});

const DishesData = mongoose.model('DishesData', dishesModel);

module.exports = DishesData;


// const mongoose = require('mongoose');

// const dishesModel = new mongoose.Schema({
//     Itemnumber: { type: String },
//     image: [{ type: String }],
//     oldprice: { type: Number },
//     newprice: { type: Number },
//     dishes: { type: String },
//     color:{ type:String},
//     // color:{ type: mongoose.Schema.Types.ObjectId, ref: 'ColorsData', required: true },
//     features: { type: String },
//     manufacturer:{type:String},
//     productcare:{type:String},
//     description: { type: String },
//     category: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoriesData', required: true },
//     subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubcategoriesData' },
//     createdAt: { type: Date, default: Date.now } // Add this field// Add subcategory reference
// });

// const DishesData = mongoose.model('DishesData', dishesModel);

// module.exports = DishesData;


