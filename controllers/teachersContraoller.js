const Teacher = require('../models/teacher');

// ✅ Get All Teachers
const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers', error });
  }
};

// ✅ Add Teacher
const addTeacher = async (req, res) => {
  try {
    const newTeacher = new Teacher(req.body);
    await newTeacher.save();
    res.status(201).json({ message: 'Teacher added successfully', teacher: newTeacher });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Edit Teacher
const editTeacher = async (req, res) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json({ message: 'Teacher updated successfully', teacher: updatedTeacher });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete Teacher
const deleteTeacher = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!deletedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTeacherProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).select('-password');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



const getTeacherCount = async (req, res) => {
  try {
    const count = await Teacher.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get teacher count' });
  }
};



const getTimetableForDate = async (req, res) => {
  try {
    const { classId, date } = req.query;

    if (!classId || !date) {
      return res.status(400).json({ message: 'Class and date are required' });
    }

    // ✅ Step 1: Try to find an existing timetable for that date
    let timetable = await Timetable.findOne({ class: classId, date })
      .populate({
        path: 'periods.subject',
        populate: { path: 'teacher' }
      });

    if (!timetable) {
      // ✅ Step 2: If not found → Get the base timetable for that weekday
      const dayOfWeek = new Date(date).getDay(); // 0 = Sunday, 1 = Monday ...

      timetable = await Timetable.findOne({
        class: classId,
        date: { 
          $gte: new Date(new Date(date).getFullYear(), new Date(date).getMonth(), 1), 
          $lt: new Date(new Date(date).getFullYear(), new Date(date).getMonth() + 1, 1) 
        },
        $expr: { $eq: [{ $dayOfWeek: "$date" }, dayOfWeek + 1] }
      }).populate({
        path: 'periods.subject',
        populate: { path: 'teacher' }
      });

      if (!timetable) {
        return res.status(404).json({ message: 'No timetable found for this class and date' });
      }
    }

    res.status(200).json(timetable);
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTimetableForTeacher = async (req, res) => {
  try {
    const teacherId = req.user.id; // ✅ Get logged-in teacher ID
    const { classId, date } = req.query;

    if (!classId || !date) {
      return res.status(400).json({ message: 'Class and date are required' });
    }

    // ✅ Step 1: Check if the teacher is assigned to any subject in the class timetable
    const timetable = await Timetable.findOne({
      class: classId,
      date
    }).populate({
      path: 'periods.subject',
      populate: { path: 'teacher' }
    });

    if (!timetable) {
      return res.status(404).json({ message: 'No timetable found for this date and class' });
    }

    // ✅ Step 2: Filter out periods not assigned to the logged-in teacher
    const teacherPeriods = timetable.periods
      .filter(period => period.subject.teacher && period.subject.teacher._id.toString() === teacherId);

    res.status(200).json({ 
      date: timetable.date,
      periods: teacherPeriods
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// const getTimetableForTeacher = async (req, res) => {
//   try {
//     const teacherId = req.user.id; // ✅ Get logged-in teacher ID
//     const { classId, date } = req.query;

//     if (!classId || !date) {
//       return res.status(400).json({ message: 'Class and date are required' });
//     }

//     // ✅ Step 1: Check if the teacher is assigned to any subject in the class timetable
//     const timetable = await Timetable.findOne({
//       class: classId,
//       date
//     }).populate({
//       path: 'periods.subject',
//       populate: { path: 'teacher' }
//     });

//     if (!timetable) {
//       return res.status(404).json({ message: 'No timetable found for this date and class' });
//     }

//     // ✅ Step 2: Filter out periods not assigned to the logged-in teacher
//     const teacherPeriods = timetable.periods
//       .filter(period => period.subject.teacher && period.subject.teacher._id.toString() === teacherId);

//     res.status(200).json({ 
//       date: timetable.date,
//       periods: teacherPeriods
//     });
//   } catch (error) {
//     console.error('❌ Error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };




module.exports = {
  getTeacherCount,
  getTeachers,getTeacherProfile,
  addTeacher,
  editTeacher,
  deleteTeacher,
    getTimetableForDate,getTimetableForTeacher

};
