const mongoose = require('mongoose');

const subcategoriesModel = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoriesData', required: true },
    maincategoriesData: { type: mongoose.Schema.Types.ObjectId, ref: 'MaincategoriesData', required: true }
});

const SubcategoriesData = mongoose.model('SubcategoriesData', subcategoriesModel);

module.exports = SubcategoriesData;

