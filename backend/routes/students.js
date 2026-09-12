const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const auth = require('../middleware/auth');

// @route   GET api/students
// @desc    Get all students (with optional search and filter)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { search, department } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { studentId: { $regex: search, $options: 'i' } }
            ];
        }

        if (department) {
            query.department = department;
        }

        const students = await Student.find(query).sort({ createdAt: -1 });
        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/students/:id
// @desc    Get single student by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Student not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/students
// @desc    Add new student
// @access  Private
router.post('/', auth, async (req, res) => {
    const { studentId, firstName, lastName, email, department } = req.body;

    try {
        let existingStudent = await Student.findOne({ studentId });
        if (existingStudent) {
            return res.status(400).json({ msg: 'Student ID already exists' });
        }

        const newStudent = new Student({
            studentId,
            firstName,
            lastName,
            email,
            department
        });

        const student = await newStudent.save();
        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/students/:id
// @desc    Update student
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { studentId, firstName, lastName, email, department } = req.body;

    // Build student object
    const studentFields = {};
    if (studentId) studentFields.studentId = studentId;
    if (firstName) studentFields.firstName = firstName;
    if (lastName) studentFields.lastName = lastName;
    if (email) studentFields.email = email;
    if (department) studentFields.department = department;

    try {
        let student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        student = await Student.findByIdAndUpdate(
            req.params.id,
            { $set: studentFields },
            { new: true }
        );

        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/students/:id
// @desc    Delete student and associated records
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        // Delete associated attendance and grades
        await Attendance.deleteMany({ student: req.params.id });
        await Grade.deleteMany({ student: req.params.id });

        // Delete student
        await Student.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Student removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Student not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
