const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
