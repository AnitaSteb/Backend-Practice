const express = require('express');
const router = express.Router();
const Test = require('../models/test');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// User registration route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Create a new Test document with username and password from request body
    const test = new Test({ username, password });
    
    try {
        // Save the new Test document to the database
        await test.save();

        // Respond with status 201 (Created) and success message
        res.status(201).send('Test registered successfully');
    } catch (error) {
        // Handle any errors during registration and respond with status 500 (Internal Server Error)
        res.status(500).send(error.message);
    }
});

// User login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find a Test document with the provided username
        const test = await Test.findOne({ username });

        // If no test is found with the given username, respond with status 404 (Not Found)
        if (!test) {
            return res.status(404).send('Test not found');
        }

        // Use the comparePassword method defined on the Test model to check password validity
        const isMatch = await test.comparePassword(password);

        // If passwords do not match, respond with status 401 (Unauthorized)
        if (!isMatch) {
            return res.status(401).send('Invalid credentials');
        }

        // Generate a JWT token containing the user ID (test._id) and sign it with the JWT_SECRET
        const token = jwt.sign({ userId: test._id }, process.env.JWT_SECRET);

        // Respond with the generated token
        res.send({ token });
    } catch (error) {
        // Handle any errors during login and respond with status 500 (Internal Server Error)
        res.status(500).send(error.message);
    }
});

// Export the router containing the registration and login routes
module.exports = router;
