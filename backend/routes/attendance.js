const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const auth = require('../middleware/auth');

// @route   GET api/attendance/:studentId
// @desc    Get attendance for a student
// @access  Private
router.get('/:studentId', auth, async (req, res) => {
    try {
        const attendance = await Attendance.find({ student: req.params.studentId }).sort({ date: -1 });
        res.json(attendance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/attendance
// @desc    Add attendance record
// @access  Private
router.post('/', auth, async (req, res) => {
    const { studentId, date, status } = req.body;

    try {
        const newAttendance = new Attendance({
            student: studentId,
            date,
            status
        });

        const attendance = await newAttendance.save();
        res.json(attendance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
