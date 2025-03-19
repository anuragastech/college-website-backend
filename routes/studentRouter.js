const express = require('express');
const { getStudents, addStudent, updateStudent, deleteStudent ,getStudentProfile ,getStudentCount} = require('../controllers/studentController');
const { protect } = require('../middleware/protect'); 
const router = express.Router();

router.get('/get-students', getStudents); 
router.post('/add-students', addStudent); 
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent); 

router.get('/profile', protect, getStudentProfile);

router.get('/get-counts', getStudentCount);



module.exports = router;
