const express = require('express');
const  router = express.Router();
const { addClass,getData, getAllClasses, deleteClass } = require('../controllers/classController');

router.post('/add', addClass);
router.get('/get-classes', getAllClasses);
router.get('/get-page', getData);

router.delete('/delete/:id', deleteClass);

module.exports = router;



