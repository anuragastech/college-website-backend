const express = require('express');
const router = express.Router();
const Timetable = require('../models/timetable');

router.get('/api/timetable', async (req, res) => {
  try {
    const { classId, date } = req.query;

    if (!classId || !date) {
      return res.status(400).json({ error: 'Class ID and date are required.' });
    }

    const selectedDate = new Date(date);

    // Fetch timetable for the selected class and date
    const timetable = await Timetable.findOne({
      class: classId,
      date: selectedDate
    }).populate('class periods.subject periods.studentsAttendance.student');

    if (!timetable) {
      // If no timetable is found, create a placeholder for 7 periods with "Not assigned"
      const periods = Array.from({ length: 7 }, (_, i) => ({
        periodNumber: i + 1,
        subject: null
      }));
      return res.status(200).json({ date: selectedDate, periods });
    }

    res.status(200).json(timetable);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
