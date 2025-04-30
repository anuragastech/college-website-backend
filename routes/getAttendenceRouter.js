const express = require('express');
const router = express.Router();
const Timetable = require('../models/timetable');
const Student = require('../models/student');

router.get('/get-attendance/:classId/:date', async (req, res) => {
  const { classId, date } = req.params;
  const userEmail = req.user.email; // Get logged-in user's email

  try {
    const timetable = await Timetable.findOne({ class: classId, date })
      .populate({
        path: 'periods.subject',
        select: 'name'
      })
      .populate({
        path: 'periods.studentsAttendance.student',
        select: 'name email'
      });

    if (!timetable) {
      return res.status(404).json({ message: 'No timetable found for the selected class and date.' });
    }

    // Find student matching the logged-in user's email
    let matchedAttendance = timetable.periods.map((period) => {
      const studentAttendance = period.studentsAttendance.find(
        (attendance) => attendance.student.email === userEmail
      );
      return {
        periodNumber: period.periodNumber,
        subject: period.subject.name,
        status: studentAttendance ? studentAttendance.status : 'Not Available',
      };
    });

    res.json({ classId, date, attendance: matchedAttendance });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Failed to fetch attendance' });
  }
});

module.exports = router;
