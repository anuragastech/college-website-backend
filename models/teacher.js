const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String, // Optional
    unique: true, // Ensures no duplicate emails
    sparse: true, // Allows multiple `null` or undefined values
  },
  password: {
    type: String,
  },
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
