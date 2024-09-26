
const asyncHandler = require('express-async-handler');
const SettingsModel = require('../Model/SettingsModel');

// Post Settings
exports.postSettings = asyncHandler(async (req, res) => {
  const { companyName, contact, address, mapLink } = req.body;
  const files = req.files;
  const image = files.map((file)=>file.filename)   
  try {
    const newSetting = await SettingsModel.create({
      companyName,
      image,
      contact,
      address,
      mapLink,
    });

    res.status(201).json({
      message: 'Settings posted successfully',
      setting: newSetting,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while posting settings' });
  }
});

// Get All Settings
exports.getSettings = asyncHandler(async (req, res) => {
  try {
    const settings = await SettingsModel.find();
    res.status(200).json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while fetching data' });
  }
});

//hello

// Get Settings By ID
exports.getSettingsById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const setting = await SettingsModel.findById(id);
    if (!setting) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    res.status(200).json(setting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while fetching settings' });
  }
});

// Update Settings By ID
exports.putSettingsById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { companyName, contact, address, mapLink } = req.body;
  const image = req.file ? req.file.filename : undefined;

  try {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const existingSettings = await SettingsModel.findById(id);
    if (!existingSettings) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    const update = {
      companyName,
      contact,
      address,
      mapLink,
      ...(image && { image }),
    };

    const updatedSettings = await SettingsModel.findByIdAndUpdate(id, { $set: update }, { new: true });
    res.status(200).json(updatedSettings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error while updating settings', error: err.message });
  }
});

// Delete Settings By ID
exports.deleteSettingsById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const response = await SettingsModel.findByIdAndDelete(id);
    if (!response) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    res.status(200).json({
      message: 'Settings deleted successfully',
      setting: response,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while deleting settings' });
  }
});


