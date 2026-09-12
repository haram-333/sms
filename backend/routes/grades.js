const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade');
const auth = require('../middleware/auth');

// @route   GET api/grades/:studentId
// @desc    Get grades for a student
// @access  Private
router.get('/:studentId', auth, async (req, res) => {
    try {
        const grades = await Grade.find({ student: req.params.studentId }).sort({ createdAt: -1 });
        res.json(grades);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/grades
// @desc    Add a grade record
// @access  Private
router.post('/', auth, async (req, res) => {
    const { studentId, subject, marks, grade } = req.body;

    try {
        const newGrade = new Grade({
            student: studentId,
            subject,
            marks,
            grade
        });

        const savedGrade = await newGrade.save();
        res.json(savedGrade);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
