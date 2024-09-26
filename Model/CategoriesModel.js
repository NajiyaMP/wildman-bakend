// orginal

// var mongoose = require('mongoose');

// var categoriesModel = new mongoose.Schema({
//     categories: { type: String, required: true },
//     maincategories:{type:String, required:true}

// });

// var categoriesData = new mongoose.model('categoriesData', categoriesModel);
// module.exports = categoriesData;

//new
const mongoose = require('mongoose');

const categoriesModel = new mongoose.Schema({
    name: { type: String, required: true },
    maincategoriesData: { type: mongoose.Schema.Types.ObjectId, ref: 'MaincategoriesData', required: true }
});

const CategoriesData = mongoose.model('CategoriesData', categoriesModel);

module.exports = CategoriesData;
