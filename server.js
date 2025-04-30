const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
// app.use(cors({
//     // origin: 'http://localhost:3000', // React frontend URL
//     methods: 'GET,POST,PUT,DELETE',
//     allowedHeaders: 'Content-Type,Authorization'
//   }));
app.use(express.json());
app.use(cookieParser());


// Routes
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const timetableRoutes = require('./routes/timeTableRoutes');
const subjectRoutes = require('./routes/subjectRouter');
const teacherRoutes = require('./routes/teacherRouter');
const classRoutes = require('./routes/classRoute');
const studentRoutes = require('./routes/studentRouter');
const examRoutes = require('./routes/examRoutes');
const eventRoutes = require('./routes/eventRoutes');
const timetableRoute = require('./routes/getTimetablRouter');
const getattendenceRoute = require('./routes/getAttendenceRouter')

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/subject', subjectRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gettimetable',timetableRoute);
app.use('/api/getattendence',getattendenceRoute);


const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error(`Failed to start server: ${err.message}`);
});
