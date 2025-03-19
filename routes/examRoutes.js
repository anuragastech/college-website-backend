const express = require('express');
const router = express.Router();
const Exam = require('../models/exam');

// Add new exam
router.post('/add-exam', async (req, res) => {
  try {
    const { name, date } = req.body;

    if (!name || !date) {
      return res.status(400).json({ message: 'Name and Date are required.' });
    }

    const newExam = new Exam({ name, date });
    await newExam.save();

    res.status(201).json(newExam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all exams
router.get('/get-exam', async (req, res) => {
  try {
    const exams = await Exam.find().sort({ date: 1 });
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an exam
router.delete('/:id', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    await exam.deleteOne();
    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
