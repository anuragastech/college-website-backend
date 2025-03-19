const express = require('express');
const { getAllSubjects,editSubject,deleteSubject, addSubject } = require('../controllers/subjectController');

const router = express.Router();

router.get('/getsubjects', getAllSubjects);
router.post('/add-subject', addSubject);
// ✅ Edit Subject
router.put('/edit-subject/:id', editSubject);

// ✅ Delete Subject
router.delete('/delete-subject/:id', deleteSubject);

module.exports = router;
