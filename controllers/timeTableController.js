const Timetable = require('../models/timetable');
const Class = require('../models/classes');
const Subject = require('../models/subject'); 
const Teacher = require('../models/teacher'); 
const mongoose = require('mongoose');
const Student=require('../models/student')


// 📌 Add or Update Timetable for a Date
// const addOrUpdateTimetable = async (req, res) => {
//   try {
//     console.log( date, periods ,"date");
    
//     const { date, periods } = req.body;
//     let timetable = await Timetable.findOne({ date });

//     if (timetable) {
//       timetable.periods = periods; // Update existing timetable
//     } else {
//       timetable = new Timetable({ date, periods });
//     }

//     await timetable.save();
//     res.status(201).json({ message: 'Timetable saved successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error saving timetable' });
//   }
// };
// const addTimetable = async (req, res) => {
//   try {
//     console.log('Incoming request:', req.body);

//     const { date, periods } = req.body;
//     if (!date || !Array.isArray(periods) || periods.length === 0) {
//       console.log('Validation failed: Missing or empty fields');
//       return res.status(400).json({ message: 'Periods cannot be empty' });
//     }

//     console.log('Periods:', periods);

//     // Check if timetable for this date already exists
//     const existingTimetable = await Timetable.findOne({ date });

//     if (existingTimetable) {
//       console.log('Timetable already exists:', existingTimetable);
//       return res.status(400).json({ message: 'Timetable already added for this date' });
//     }

//     // If timetable does not exist, create a new one
//     const newTimetable = new Timetable({
//       date,
//       periods,
//     });

//     await newTimetable.save();
//     console.log('Timetable saved successfully:', newTimetable);
//     res.status(201).json({ message: 'Timetable saved successfully' });
//   } catch (error) {
//     console.error('Error while saving timetable:', error.message);
//     res.status(500).json({ message: error.message });
//   }
// };
const addTimetable = async (req, res) => {
  try {
    console.log('Incoming request:', req.body);

    const { date, periods, classId } = req.body;

    if (!date || !Array.isArray(periods) || periods.length === 0 || !classId) {
      console.log('Validation failed: Missing or empty fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    console.log('Periods:', periods);

    // ✅ Check if class exists
    const existingClass = await Class.findById(classId);
    if (!existingClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // ✅ Check if timetable for this date and class already exists
    const existingTimetable = await Timetable.findOne({ date, class: classId });
    if (existingTimetable) {
      console.log('Timetable already exists:', existingTimetable);
      return res.status(400).json({ message: 'Timetable already added for this class and date' });
    }

    // ✅ Validate each period in the array
    for (const period of periods) {
      const { subject, periodNumber } = period;

      if (!subject || !periodNumber) {
        console.log('Validation failed: Missing required fields in period', period);
        return res.status(400).json({ message: 'All period fields (subject, periodNumber) are required' });
      }

      // ✅ Check if subject exists in the database
      const existingSubject = await Subject.findById(subject);

      if (!existingSubject) {
        console.log('Subject not found:', subject);
        return res.status(400).json({ message: `Subject with ID ${subject} not found` });
      }
    }

    // ✅ Create a new timetable for the specific class
    const newTimetable = new Timetable({
      class: classId,
      date,
      periods
    });

    await newTimetable.save();
    console.log('Timetable saved successfully:', newTimetable);
    res.status(201).json({ message: 'Timetable saved successfully' });
  } catch (error) {
    console.error('Error while saving timetable:', error.message);
    res.status(500).json({ message: error.message });
  }
};



const getTimetableByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const timetable = await Timetable.find({ class: classId })
      .populate('class')
      .populate('periods.subject')
      .populate('periods.teacher');

    res.status(200).json(timetable);
  } catch (error) {
    console.error('Error while fetching timetable:', error.message);
    res.status(500).json({ message: error.message });
  }
};


// 📌 Get Timetable by Date
const getTimetableByDate = async (req, res) => {
  try {
    let { date } = req.params;

    console.log(date, "Requested date");

    // Convert to start and end of the day to match any time part
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Use $gte and $lt to match the date without time mismatch
    const timetable = await Timetable.findOne({ 
      date: { $gte: startOfDay, $lt: endOfDay }
    })
    .populate('periods.subject')
    .populate('periods.teacher');

    if (!timetable) {
      return res.status(404).json({ message: 'No timetable found for this date' });
    }

    res.status(200).json(timetable);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({ message: 'Error fetching timetable' });
  }
};



// 📌 Get Weekly Timetable
const getWeeklyTimetable = async (req, res) => {
  try {
    console.log(startDate, endDate,"some");
    
    const { startDate, endDate } = req.query; // Get week range from query
    const timetable = await Timetable.find({ 
      date: { $gte: startDate, $lte: endDate } 
    }).populate('periods.subject periods.teacher');

    res.status(200).json(timetable);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weekly timetable' });
  }
};

// 📌 Get Monthly Timetable
const getMonthlyTimetable = async (req, res) => {
  try {
    console.log(month, year);
    
    const { month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const timetable = await Timetable.find({ 
      date: { $gte: startDate, $lte: endDate }
    }).populate('periods.subject periods.teacher');

    res.status(200).json(timetable);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching monthly timetable' });
  }
};

// 📌 Mark a Holiday
const markHoliday = async (req, res) => {
  try {
    const { date, classId, isHoliday } = req.body;

    if (!classId) {
      return res.status(400).json({ message: 'Class ID is required.' });
    }

    // Format date to YYYY-MM-DD for consistency
    const formattedDate = new Date(date).toISOString().split('T')[0];

    // Update timetable at root level using "class" instead of "classId"
    const timetable = await Timetable.findOneAndUpdate(
      { date: formattedDate, class: classId }, // Changed to class
      { isHoliday },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: isHoliday ? 'Day marked as holiday.' : 'Holiday removed.',
      timetable,
    });
  } catch (error) {
    console.error('Error while marking holiday:', error);
    res.status(500).json({ message: 'Error while marking holiday.' });
  }
};



// Controller function to get timetable based on the filter
const getTimetable = async (req, res) => {
  try {
    const { classId } = req.params;
    console.log('Received classId:', classId);

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ message: 'Invalid class ID' });
    }

    const timetable = await Timetable.findOne({ class: classId })
      .populate('class')
      .populate({
        path: 'periods.subject',
        select: 'name',
      })
      .populate({
        path: 'periods.studentsAttendance.student',
        select: 'name',
      });

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    res.status(200).json(timetable);
  } catch (error) {
    console.error('Error while fetching timetable:', error);
    res.status(500).json({ message: error.message });
  }
};



// ------------------------------------------------  
const nodemailer = require('nodemailer');

const getAllTimetable = async (req, res) => {
  const { classId, date } = req.params;

  console.log('Class ID :', classId);
  console.log('Date:', date);

  if (!classId || !date) {
    return res.status(400).json({ error: 'Class ID and date are required' });
  }

  try {
    // Find timetable by classId and date and populate details
    let timetable = await Timetable.findOne({ class: classId, date })
      .populate('periods.subject')
      .populate('periods.studentsAttendance.student');

    // Get all students in the class
    const allStudents = await Student.find({ classId: classId });
console.log(allStudents);

    // If timetable exists, merge all students into the attendance
    if (timetable) {
      const updatedPeriods = timetable.periods.map((period) => {
        // Create a map of existing attendance records
        const attendanceMap = new Map(
          period.studentsAttendance.map((attendance) => [attendance.student?._id.toString(), attendance])
        );

        // Add all students, defaulting to 'absent' if no record exists
        const completeAttendance = allStudents.map((student) => {
          if (attendanceMap.has(student._id.toString())) {
            return attendanceMap.get(student._id.toString());
          } else {
            return {
              student: {
                _id: student._id,
                name: student.name,
              },
              status: 'absent', // Default status
            };
          }
        });

        return {
          periodNumber: period.periodNumber,
          subject: period.subject ? {
            _id: period.subject._id,
            name: period.subject.name,
          } : { name: 'No subject' },
          studentsAttendance: completeAttendance,
        };
      });

      res.status(200).json({
        isHoliday: timetable.isHoliday,
        periods: updatedPeriods,
      });
    } else {
      // If no timetable, create empty periods with all students as absent
      const emptyPeriods = Array.from({ length: 7 }, (_, i) => ({
        periodNumber: i + 1,
        subject: { name: 'No subject' },
        studentsAttendance: allStudents.map((student) => ({
          student: {
            _id: student._id,
            name: student.name,
          },
          status: 'absent',
        })),
      }));

      res.status(200).json({
        isHoliday: false,
        periods: emptyPeriods,
      });
    }
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// ✅ Mark Attendance
const markAttendance = async (req, res) => {
  const { timetableId } = req.params;
  const { periodNumber, attendanceData } = req.body;

  if (!timetableId || !periodNumber || !attendanceData) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Find the timetable by ID
    const timetable = await Timetable.findById(timetableId);
    if (!timetable) {
      return res.status(404).json({ error: 'Timetable not found' });
    }

    // Find the correct period using periodNumber
    const period = timetable.periods.find(p => p.periodNumber === periodNumber);
    if (!period) {
      return res.status(404).json({ error: 'Period not found' });
    }

    // Update student attendance for that period
    attendanceData.forEach(({ student, status }) => {
      const studentRecord = period.studentsAttendance.find(att => att.student.toString() === student);
      if (studentRecord) {
        // Update existing student attendance
        studentRecord.status = status;
      } else {
        // Add new student attendance record if not already present
        period.studentsAttendance.push({ student, status });
      }
    });

    // Save updated timetable
    await timetable.save();

    res.status(200).json({ message: 'Attendance updated successfully' });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ error: 'Failed to update attendance' });
  }
};


const getAttendancePercentage = async (req, res) => {
  try {
    const totalClasses = await Timetable.aggregate([
      { $unwind: '$periods' }, // Flatten periods array
      { $unwind: '$periods.studentsAttendance' }, // Flatten studentsAttendance array
      {
        $group: {
          _id: null,
          totalAttendance: { $sum: 1 },
          presentCount: {
            $sum: {
              $cond: [{ $eq: ['$periods.studentsAttendance.status', 'present'] }, 1, 0]
            }
          }
        }
      }
    ]);

    if (totalClasses.length === 0) {
      return res.status(200).json({ percentage: 0 });
    }

    const { totalAttendance, presentCount } = totalClasses[0];
    const percentage = (presentCount / totalAttendance) * 100;

    res.status(200).json({ percentage: percentage.toFixed(2) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate attendance percentage' });
  }
};

module.exports = { 

  getAttendancePercentage,
  getAllTimetable,
  markAttendance,
  getTimetable,
  addTimetable, 
  getTimetableByDate, 
  getWeeklyTimetable, 
  getMonthlyTimetable, 
  markHoliday ,
  getTimetableByClass
};

