const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: String, required: true },
    marks: { type: Number, required: true, min: 0, max: 100 },
    grade: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Grade', gradeSchema);
