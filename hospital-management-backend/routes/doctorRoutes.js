const express = require('express');
const Doctor = require('../models/Doctors');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (err) {
        console.error('Error fetching doctors:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

module.exports = router;
