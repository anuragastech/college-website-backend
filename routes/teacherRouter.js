const express = require('express');
const {  
    getTeachers,
    addTeacher,
    editTeacher,
    deleteTeacher,
    getTeacherProfile,getTeacherCount
} = require('../controllers/teachersContraoller'); // ✅ Fixed typo in the file name

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



module.exports = router;
