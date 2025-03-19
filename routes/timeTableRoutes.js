const express = require('express');
const { 
  addTimetable, 
  getTimetableByDate, 
  getWeeklyTimetable, 
  getMonthlyTimetable, 
  markHoliday ,
  getTimetableByClass,
  getTimetable,getAllTimetable, markAttendance ,getAttendancePercentage
} = require('../controllers/timeTableController');

const router = express.Router();

router.post('/add', addTimetable); 
router.get('/date/:date', getTimetableByDate); 
router.get('/week', getWeeklyTimetable); 
router.get('/month', getMonthlyTimetable);
router.post('/holiday', markHoliday);
router.get('/:classId', getTimetableByClass);
router.get('/getAllTimetable/:classId', getTimetable);
// router.post('/getTimetable', getTimetable);



// ✅ Get timetable by class and date
router.get('/getTimetables/:classId/:date', getAllTimetable);

// ✅ Mark attendance for a period
router.put('/markAttendance/:timetableId', markAttendance);

router.get('/get-percentage', getAttendancePercentage);


module.exports = router;
