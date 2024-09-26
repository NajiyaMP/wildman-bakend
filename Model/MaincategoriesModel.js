
//orginal
// var mongoose = require('mongoose');
// var maincategoriesModel = new mongoose.Schema({
//     maincategories:{type:String, required:true}
// })
// var maincategoriesData = new mongoose.model('maincategoriesData', maincategoriesModel);
// module.exports = maincategoriesData

//new
const mongoose = require('mongoose');

const maincategoriesModel = new mongoose.Schema({
    maincategories: { type: String, required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'categoriesData' }]
});

const MaincategoriesData = mongoose.model('MaincategoriesData', maincategoriesModel);

module.exports = MaincategoriesData;

