const Class = require('../models/classes');

// ✅ Create new class
const addClass = async (req, res) => {
  try {
    const { name, section } = req.body;

    // ✅ Check if class already exists
    const existingClass = await Class.findOne({ name, section });
    if (existingClass) {
      return res.status(400).json({ message: 'Class already exists' });
    }

    const newClass = new Class({ name, section });
    await newClass.save();

    res.status(201).json({ message: 'Class created successfully', class: newClass });
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ message: 'Error creating class' });
  }
};

// ✅ Get all classes
const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.status(200).json({ classes });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ message: 'Error fetching classes' });
  }
};

// ✅ Delete a class
const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    await Class.findByIdAndDelete(id);
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ message: 'Error deleting class' });
  }
};

const getData = async (req, res) => {
  try {
    const classes = await Class.find();

    if (!classes || classes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No classes found',
      });
    }

    res.status(200).json({
      success: true,
      data: classes,
      message: 'Classes fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching classes:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch classes',
      error: error.message,
    });
  }
};

module.exports = { addClass, getAllClasses, deleteClass,getData };
