const express = require('express');
const { addTeacher, addStudent, addSubject } = require('../controllers/adminController');
const router = express.Router();

router.post('/add-teacher', addTeacher);
router.post('/add-student', addStudent);
router.post('/add-subject', addSubject);

module.exports = router;
