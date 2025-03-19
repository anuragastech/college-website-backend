const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }, // ✅ ObjectId reference
});

module.exports = mongoose.model('Subject', subjectSchema);
