const Subject = require('../models/subject');

// Get All Subjects
const getAllSubjects = async (req, res) => {
  try {
    // Populate the teacher's 'name' and 'email' fields
    const subjects = await Subject.find().populate('teacher', 'name email');
    res.status(200).json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Failed to fetch subjects' });
  }
};
const mongoose = require('mongoose');
// const Subject = require('../models/subject');
const Teacher = require('../models/teacher');

const addSubject = async (req, res) => {
  try {
    
    const { name, teacherId } = req.body;
    console.log(name, teacherId );

    console.log('🔵 Received Teacher ID:', teacherId);

    if (!name || !teacherId) {
      console.log('🔴 Missing Fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    // ✅ Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      console.log('🔴 Invalid Teacher ID:', teacherId);
      return res.status(400).json({ message: 'Invalid teacher ID' });
    }

    // ✅ Check if teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      console.log('🔴 Teacher Not Found:', teacherId);
      return res.status(400).json({ message: 'Teacher not found' });
    }

    // ✅ Create Subject
    const newSubject = new Subject({ name, teacher: teacherId });
    console.log('🟢 Saving Subject:', newSubject);

    await newSubject.save();

    console.log('🟢 New Subject Saved:', newSubject);
    res.status(201).json({ message: 'Subject added successfully', newSubject });
  } catch (error) {
    console.error('🔴 Error adding subject:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
const editSubject = async (req, res) => {
  try {
    const { name, teacherId } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid subject ID' });
    }

    if (!name || !teacherId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const teacherExists = await Teacher.findById(teacherId);
    if (!teacherExists) {
      return res.status(400).json({ message: 'Teacher not found' });
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      { name, teacher: teacherId },
      { new: true }
    );

    if (!updatedSubject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json(updatedSubject);
  } catch (error) {
    console.error('Error editing subject:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Delete Subject
const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid subject ID' });
    }

    const deletedSubject = await Subject.findByIdAndDelete(id);

    if (!deletedSubject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = { getAllSubjects, addSubject ,  editSubject,
  deleteSubject};
