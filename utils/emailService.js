const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // ✅ Your Gmail
    pass: process.env.EMAIL_PASS, // ✅ Your App Password
  },
});

const sendAbsenceEmail = async (student, period) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: student.parentDetails.email, // ✅ Parent's Email
    subject: `Attendance Alert for ${student.name}`,
    html: `
      <p>Dear ${student.parentDetails.name},</p>
      <p>We would like to inform you that <b>${student.name}</b> was marked <b>ABSENT</b> on:</p>
      <ul>
        <li><b>Date:</b> ${new Date(period.date).toDateString()}</li>
        <li><b>Period Number:</b> ${period.periodNumber}</li>
        <li><b>Subject:</b> ${period.subject.name}</li>
      </ul>
      <p>Please contact the school if you have any concerns.</p>
      <p>Thank you,</p>
      <p><b>Your School Admin</b></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${student.parentDetails.email}`);
  } catch (error) {
    console.error(`❌ Failed to send email: ${error.message}`);
  }
};

module.exports = sendAbsenceEmail;
