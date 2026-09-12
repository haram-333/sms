const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Override DNS locally to fix Node.js ECONNREFUSED on Windows.
// We skip this in production (Vercel/Render) to avoid breaking cloud VPC DNS.
if (process.env.NODE_ENV !== 'production') {
    try {
        require('dns').setServers(['8.8.8.8', '8.8.4.4']);
    } catch (e) {}
}

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/grades', require('./routes/grades'));

// Seed Admin (Unrestricted setup)
const seedAdmin = async () => {
    const Admin = require('./models/Admin');
    try {
        const adminExists = await Admin.findOne({ username: 'admin' });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            await Admin.create({ username: 'admin', password: hashedPassword });
            console.log('Default admin seeded (admin / admin123)');
        }
    } catch (error) {
        console.error('Error seeding admin', error);
    }
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
    seedAdmin();
})
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
