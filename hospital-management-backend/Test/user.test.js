const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); 
const User = require('../models/User'); 

const testUser = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'patient',
};

describe('User Authentication Tests', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        // Clean up test data
        await User.deleteMany({ email: testUser.email });
        await mongoose.connection.close(); 
    });

    test('Register a new user', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send(testUser);

        expect(res.statusCode).toBe(201);
        expect(res.body.email).toBe(testUser.email);
    });

    test('Return error for duplicate email', async () => {
        await request(app)
            .post('/api/users/register')
            .send(testUser); 

        const res = await request(app)
            .post('/api/users/register')
            .send(testUser); 

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('User already exists');
    });

    test('Login with correct credentials', async () => {
        await request(app)
            .post('/api/users/register')
            .send(testUser); 

        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: testUser.email,
                password: testUser.password,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    test('Return error for incorrect password', async () => {
        await request(app)
            .post('/api/users/register')
            .send(testUser); 

        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: testUser.email,
                password: 'wrongpassword', 
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Invalid credentials');
    });

    test('Return error for non-existent user', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'nonexistent@example.com', 
                password: 'password123',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('User not found');
    });
});
