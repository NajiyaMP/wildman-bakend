const asyncHandler = require('express-async-handler');
const ColorModel = require('../Model/ColorModel');

exports.postColors = asyncHandler(async (req, res) => {
    const { Color } = req.body;

    try {
        const newColor = await ColorModel.create({ Color });
        res.status(200).json(newColor); // Return the created color object
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while posting categories');
    }
});

exports.getColors = asyncHandler(async (req, res) => {
    try {
        const response = await ColorModel.find();
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while fetching data');
    }
});

exports.getColorsById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const response = await ColorModel.findById(id);
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while fetching data');
    }
});

exports.putColorsById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { Color } = req.body; // Ensure correct naming

    try {
        const updatedData = await ColorModel.findByIdAndUpdate(id, { Color }, { new: true });
        res.status(200).json(updatedData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Error while updating data' });
    }
});

exports.deleteColorsById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const response = await ColorModel.findByIdAndDelete(id);
        if (!response) {
            return res.status(404).json({ message: 'Color not found' });
        }
        res.status(200).json({ message: 'Color deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while deleting the color');
    }
});
