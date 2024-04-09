const express = require('express');
const router = express.Router();
const User = require('../models/user');
const userAuthenticate = require('../middleware/userAuthenticate');
const { v4: uuidv4 } = require('uuid'); // Import uuidv4 function from uuid package

// Route: GET all users (protected with authentication)
router.get('/', userAuthenticate, (req, res) => {
    res.send('This route is protected with JWT');
});

// Route: GET one user by ID
router.get('/:id', getUser, (req, res) => {
    res.json(res.user);
});


// Route to create a new user
router.post('/', async (req, res) => {
    const { firstname, lastName, age, height } = req.body;

    try {
        // Check if the user with the provided ID already exists
        const existingUser = await User.findOne({ id });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this ID already exists' });
        }

        // Create a new user instance
        const id = uuidv4(); // Generate a random ID using uuidv4
        const newUser = new User({
            id,
            firstname,
            lastName,
            age,
            height
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
});

// Route to update an existing user by ID
router.patch('/:id', getUser, async (req, res) => {
    const { user } = res; // Retrieved user from the middleware

    const { firstname, lastName, age, height } = req.body;

    try {
        // Update user properties based on the provided fields in the request body
        if (firstname) user.firstname = firstname;
        if (lastName) user.lastName = lastName;
        if (age) user.age = age;
        if (height) user.height = height;

        // Save the updated user to the database
        await user.save();

        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user', error: error.message });
    }
});

// Route: Delete an existing user by ID
router.delete('/:id', getUser, async (req, res) => {
    try {
        const { user } = res; // Retrieved user from the middleware

        await user.remove(); // Delete the user document from the database

        res.json({ message: 'Deleted user', deletedUser: user });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

// Middleware function to fetch a user by ID and attach to 'res' object
async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.user = user;
    next();  // Proceed to the next middleware or route handler
}

module.exports = router;
