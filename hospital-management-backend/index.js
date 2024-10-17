require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); 

const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const {superAdminRoutes} = require('./routes/superAdminRoutes'); 


app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/superadmin', superAdminRoutes); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));
 
const PORT =  4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;