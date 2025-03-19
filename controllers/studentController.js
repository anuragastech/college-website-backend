const Student = require('../models/student');
const Class = require('../models/classes');

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students', error });
  }
};

// Add student
const addStudent = async (req, res) => {
  try {
    console.log(req.body); // ✅ Debug log
    const {
      name,
      rollNumber,
      classId, // ✅ Make sure this is received
      email,
      phone,
      password,
      parentDetails,
      address
    } = req.body;

    if (!classId) {
      return res.status(400).json({ message: 'Class ID is required' });
    }

    const studentClass = await Class.findById(classId);
    if (!studentClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const newStudent = new Student({
      name,
      rollNumber,
      classId,
      email,
      phone,
      password,
      parentDetails,
      address,
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student added successfully', student: newStudent });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Update student

const updateStudent = async (req, res) => {
    const { id } = req.params;
    const {
      name,
      rollNumber,
      classId,
      email,
      phone,
      password,
      parentDetails = {}
    } = req.body;
  
    try {
      // Check if the student exists
      const existingStudent = await Student.findById(id);
      if (!existingStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Check if the email already exists for another student
      if (email && email !== existingStudent.email) {
        const emailExists = await Student.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }
  
      // Update fields only if provided
      existingStudent.name = name || existingStudent.name;
      existingStudent.rollNumber = rollNumber || existingStudent.rollNumber;
      existingStudent.classId = classId || existingStudent.classId;
      existingStudent.email = email || existingStudent.email;
      existingStudent.phone = phone || existingStudent.phone;
      existingStudent.password = password || existingStudent.password;
  
      // Update parent details only if provided
      existingStudent.parentDetails = {
        ...existingStudent.parentDetails,
        name: parentDetails.name || existingStudent.parentDetails.name,
        email: parentDetails.email || existingStudent.parentDetails.email,
        phone: parentDetails.phone || existingStudent.parentDetails.phone
      };
  
      // Save the updated student data
      await existingStudent.save();
  
      res.status(200).json({ message: 'Student updated successfully', student: existingStudent });
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({ message: 'Failed to update student', error: error.message });
    }
  };
  
  
// Delete student
const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findByIdAndDelete(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete student', error });
  }
};


const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


const getStudentCount = async (req, res) => {
  try {
    const count = await Student.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get student count' });
  }
};

module.exports = {
  getStudents,
  getStudentProfile,
  addStudent,
  getStudentCount,
  updateStudent,
  deleteStudent
};
