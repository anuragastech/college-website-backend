const Teacher = require('../models/teacher');
const Student = require('../models/student');
const Subject = require('../models/subject');

const addTeacher = async (req, res) => {
  try {
    const { name, email, password, subject } = req.body;
    const newTeacher = new Teacher({ name, email, password, subject });
    await newTeacher.save();
    res.status(201).json({ message: 'Teacher added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add teacher', error });
  }
};

const addStudent = async (req, res) => {
  try {
    const { name, email, password, parentEmail } = req.body;
    const newStudent = new Student({ name, email, password, parentEmail });
    await newStudent.save();
    res.status(201).json({ message: 'Student added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add student', error });
  }
};

const addSubject = async (req, res) => {
  try {
    const { name } = req.body;
    const newSubject = new Subject({ name });
    await newSubject.save();
    res.status(201).json({ message: 'Subject added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add subject', error });
  }
};

module.exports = { addTeacher, addStudent, addSubject };
