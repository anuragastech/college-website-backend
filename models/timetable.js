const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  date: { type: Date, required: true },
  isHoliday: { type: Boolean, default: false },
  periods: [{
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    periodNumber: { type: Number, required: true },
    studentsAttendance: [{
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
      status: {
        type: String,
        enum: ['present', 'absent'],
        default: 'absent'
      }
    }]
  }]
}, { timestamps: true });

const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = Timetable;
