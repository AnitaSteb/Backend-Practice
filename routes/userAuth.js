const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// User registration route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Create a new User document with username and password from request body
    const user = new User({ username, password });
    
    try {
        // Save the new User document to the database
        await user.save();

        // Respond with status 201 (Created) and success message
        res.status(201).send('User registered successfully');
    } catch (error) {
        // Handle any errors during registration and respond with status 500 (Internal Server Error)
        res.status(500).send(error.message);
    }
});

// User login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find a User document with the provided username
        const user = await User.findOne({ username });

        // If no User is found with the given username, respond with status 404 (Not Found)
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Use the comparePassword method defined on the User model to check password validity
        const isMatch = await user.comparePassword(password);

        // If passwords do not match, respond with status 401 (Unauthorized)
        if (!isMatch) {
            return res.status(401).send('Invalid credentials');
        }

        // Generate a JWT token containing the user ID (user._id) and sign it with the JWT_SECRET
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        // Respond with the generated token
        res.send({ token });
    } catch (error) {
        // Handle any errors during login and respond with status 500 (Internal Server Error)
        res.status(500).send(error.message);
    }
});

// Export the router containing the registration and login routes
module.exports = router;
