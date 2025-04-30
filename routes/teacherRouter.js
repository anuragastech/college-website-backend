const express = require('express');
const {  
    getTeachers,
    addTeacher,
    editTeacher,
    deleteTeacher,
    getTeacherProfile,getTeacherCount,   getTimetableForTeacher
    
} = require('../controllers/teachersContraoller');

const router = express.Router();

// ✅ Get All Teachers
router.get('/getData', getTeachers);

// ✅ Add Teacher
router.post('/add', addTeacher);

// ✅ Edit Teacher
router.put('/edit/:id', editTeacher);

// ✅ Delete Teacher
router.delete('/delete/:id', deleteTeacher);


router.get('/profile', getTeacherProfile);

router.get('/get-count', getTeacherCount);


router.get('/get-timetable', getTimetableForTeacher);

// router.post('/mark-attendance', markAttendance);


module.exports = router;
