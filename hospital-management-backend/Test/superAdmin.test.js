// require('dotenv').config(); 
// const request = require('supertest');
// const express = require('express');
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const app = express();
// const {superAdminRoutes}=require('../routes/superAdminRoutes')
// const User = require('../models/User');
// const Appointment = require('../models/Appointment');
// // console.log('Super Admin Routes:', superAdminRoutes);
// app.use(express.json());
// app.use('/api/superadmin', superAdminRoutes);

// const mongoURI = process.env.MONGO_URL; 
// const jwtSecret = process.env.JWT_SECRET;

// describe('SuperAdmin Tests', () => {
//     beforeAll(async () => {
//         await mongoose.connect(mongoURI);
//     });

//     afterAll(async () => {
//         await mongoose.connection.close();
//     });

//     const createDoctor = async () => {
//         const doctorData = {
//             email: `doctor_${Date.now()}@example.com`,
//             password: 'hashedPassword', 
//             role: 'doctor',
//             name: 'Dr. Test',
//             specialization: 'General'
//         };
//         return await User.create(doctorData);
//     };

//     const createPatient = async () => {
//         const patientData = {
//             email: `patient_${Date.now()}@example.com`,
//             password: 'password123',
//             role: 'patient',
//             name: 'Patient Test'
//         };
//         return await User.create(patientData);
//     };

//     const createSuperAdminToken = () => {
//         return jwt.sign({ id: '670f44b295154e1e91221550', role: 'super_admin' }, jwtSecret);
//     };

//     test('should create a new doctor', async () => {
//         const token = createSuperAdminToken();

//         const response = await request(app)
//             .post('/api/superadmin/doctors')
//             .set('Authorization', `Bearer ${token}`)
//             .send({
//                 name: 'Dr. New',
//                 email: 'newdoctor@example.com',
//                 password: 'password123',
//                 specialization: 'Cardiology'
//             });

//         expect(response.status).toBe(201);
//         expect(response.body.message).toBe('Doctor created successfully.');
//         expect(response.body.doctor).toHaveProperty('name', 'Dr. New');

//         // Cleanup
//         await User.deleteOne({ email: 'newdoctor@example.com' });
//     });

//     test('should delete a doctor', async () => {
//         const token = createSuperAdminToken();
//         const doctor = await createDoctor();

//         const response = await request(app)
//             .delete(`/api/superadmin/doctors/${doctor._id}`)
//             .set('Authorization', `Bearer ${token}`);

//         expect(response.status).toBe(200);
//         expect(response.body.message).toBe('Doctor deleted successfully.');
//     });

//     test('should get all doctors', async () => {
//         const token = createSuperAdminToken();
//         await createDoctor();

//         const response = await request(app)
//             .get('/api/superadmin/doctors')
//             .set('Authorization', `Bearer ${token}`);

//         expect(response.status).toBe(200);
//         expect(Array.isArray(response.body)).toBe(true);
//         expect(response.body.length).toBeGreaterThan(0);
//     });

//     test('should get all patients', async () => {
//         const token = createSuperAdminToken();
//         await createPatient(); 
//         const response = await request(app)
//             .get('/api/superadmin/patients')
//             .set('Authorization', `Bearer ${token}`);

//         expect(response.status).toBe(200);
//         expect(Array.isArray(response.body)).toBe(true);
//         expect(response.body.length).toBeGreaterThan(0);
//     });

//     test('should create a new patient', async () => {
//         const token = createSuperAdminToken();

//         const response = await request(app)
//             .post('/api/superadmin/patients')
//             .set('Authorization', `Bearer ${token}`)
//             .send({
//                 name: 'New Patient',
//                 email: 'newpatient@example.com',
//                 password: 'password123'
//             });

//         expect(response.status).toBe(201);
//         expect(response.body.message).toBe('Patient created successfully.');
//         expect(response.body.patient).toHaveProperty('name', 'New Patient');

//         // Cleanup
//         await User.deleteOne({ email: 'newpatient@example.com' });
//     });

//     test('should delete a patient', async () => {
//         const token = createSuperAdminToken();
//         const patient = await createPatient();

//         const response = await request(app)
//             .delete(`/api/superadmin/patients/${patient._id}`)
//             .set('Authorization', `Bearer ${token}`);

require('dotenv').config(); 
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = express();
const { superAdminRoutes } = require('../routes/superAdminRoutes');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// Set the timeout globally for this test file
jest.setTimeout(30000); // Set 30 seconds timeout for the whole test suite

app.use(express.json());
app.use('/api/superadmin', superAdminRoutes);

const mongoURI = process.env.MONGO_URL; 
const jwtSecret = process.env.JWT_SECRET;

describe('SuperAdmin Tests', () => {
    beforeAll(async () => {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }, 30000); // Set 30 seconds timeout for beforeAll hook

    afterAll(async () => {
        await mongoose.connection.close();
    }, 30000); // Set 30 seconds timeout for afterAll hook

    const createDoctor = async () => {
        const doctorData = {
            email: `doctor_${Date.now()}@example.com`,
            password: 'hashedPassword', 
            role: 'doctor',
            name: 'Dr. Test',
            specialization: 'General',
        };
        return await User.create(doctorData);
    };

    const createPatient = async () => {
        const patientData = {
            email: `patient_${Date.now()}@example.com`,
            password: 'password123',
            role: 'patient',
            name: 'Patient Test',
        };
        return await User.create(patientData);
    };

    const createSuperAdminToken = () => {
        return jwt.sign({ id: '670f44b295154e1e91221550', role: 'super_admin' }, jwtSecret);
    };

    test('should create a new doctor', async () => {
        const token = createSuperAdminToken();

        const response = await request(app)
            .post('/api/superadmin/doctors')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Dr. New',
                email: 'newdoctor@example.com',
                password: 'password123',
                specialization: 'Cardiology',
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Doctor created successfully.');
        expect(response.body.doctor).toHaveProperty('name', 'Dr. New');

        // Cleanup
        await User.deleteOne({ email: 'newdoctor@example.com' });
    }, 30000); // Set 30 seconds timeout for this test

    test('should delete a doctor', async () => {
        const token = createSuperAdminToken();
        const doctor = await createDoctor();

        const response = await request(app)
            .delete(`/api/superadmin/doctors/${doctor._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Doctor deleted successfully.');
    }, 30000); // Set 30 seconds timeout for this test

    test('should get all doctors', async () => {
        const token = createSuperAdminToken();
        await createDoctor();

        const response = await request(app)
            .get('/api/superadmin/doctors')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    }, 30000); // Set 30 seconds timeout for this test

    test('should get all patients', async () => {
        const token = createSuperAdminToken();
        await createPatient(); 

        const response = await request(app)
            .get('/api/superadmin/patients')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    }, 30000); // Set 30 seconds timeout for this test

    test('should create a new patient', async () => {
        const token = createSuperAdminToken();

        const response = await request(app)
            .post('/api/superadmin/patients')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'New Patient',
                email: 'newpatient@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Patient created successfully.');
        expect(response.body.patient).toHaveProperty('name', 'New Patient');

        // Cleanup
        await User.deleteOne({ email: 'newpatient@example.com' });
    }, 30000); // Set 30 seconds timeout for this test

    test('should delete a patient', async () => {
        const token = createSuperAdminToken();
        const patient = await createPatient();

        const response = await request(app)
            .delete(`/api/superadmin/patients/${patient._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Patient deleted successfully.');
    }, 30000); // Set 30 seconds timeout for this test
});

//         expect(response.status).toBe(200);
//         expect(response.body.message).toBe('Patient deleted successfully.');
//     });
// });
