const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true }, // ✅ ObjectId reference to Class model
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String },


  
  // Parent Details
  parentDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },

  // Address
  // address: {
  //   street: { type: String, required: true },
  //   city: { type: String, required: true },
  //   state: { type: String, required: true },
  //   postalCode: { type: String, required: true },
  //   country: { type: String, required: true }
  // }
});

module.exports = mongoose.model('Student', studentSchema);




// const mongoose = require('mongoose');

// const studentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   parentEmail: { type: String, required: true },
// });

// module.exports = mongoose.model('Student', studentSchema);
