const express = require('express');
const authenticate = require('../middleware/authenticate');
const superAdminAuth = require('../middleware/superAdminauth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Appointment = require('../models/Appointment');
const superAdminRoutes = express.Router();


superAdminRoutes.post('/doctors', authenticate, superAdminAuth, async (req, res) => {
    try {
        const { name, specialization, email, password } = req.body; 

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);

        const newDoctor = new User({
            name,
            email,
            password: hashedPassword, 
            role: 'doctor',
            specialization: specialization || undefined
        });

        await newDoctor.save();
        res.status(201).json({ message: 'Doctor created successfully.', doctor: newDoctor });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Doctor with this email already exists.' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

superAdminRoutes.delete('/doctors/:id', authenticate, superAdminAuth, async (req, res) => {
    try {
        const doctor = await User.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json({ message: 'Doctor deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

superAdminRoutes.get('/doctors', authenticate, superAdminAuth, async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' });
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

superAdminRoutes.get('/doctors', authenticate, superAdminAuth, async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' });
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to list all patients
superAdminRoutes.get('/patients', authenticate, superAdminAuth, async (req, res) => {
    try {
        const patients = await User.find({ role: 'patient' });
        res.json(patients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

superAdminRoutes.post('/patients', authenticate, superAdminAuth, async (req, res) => {
    try {
        const { name, email, password } = req.body; 

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newPatient = new User({
            name,
            email,
            password: hashedPassword, 
            role: 'patient'
        });

        await newPatient.save();
        res.status(201).json({ message: 'Patient created successfully.', patient: newPatient });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Patient with this email already exists.' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});


// Route to delete a patient
superAdminRoutes.delete('/patients/:id', authenticate, superAdminAuth, async (req, res) => {
    try {
        const patient = await User.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json({ message: 'Patient deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = {
    superAdminRoutes
};
