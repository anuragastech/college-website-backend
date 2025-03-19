const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
});

// ✅ Ensure unique combination of name + section
classSchema.index({ name: 1, section: 1 }, { unique: true });

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
