const express = require('express');
const router = express.Router();
const Test = require('../models/test');
const authenticate = require('../middleware/authenticate');

// Route: GET all tests (protected with authentication)
router.get('/', authenticate, (req, res) => {
    res.send('This route is protected with JWT');
});

// Route: GET one test by ID
router.get('/:id', getTest, (req, res) => {
    res.json(res.test);
});

// Route: Create a new test
router.post('/', async (req, res) => {
    const test = new Test({
        name: req.body.name,
        age: req.body.age,
        password: req.body.password  // Include password if required
    });
    try {
        const newTest = await test.save();
        res.status(201).json(newTest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route: Update an existing test by ID
router.patch('/:id', getTest, async (req, res) => {
    if (req.body.name != null) {
        res.test.name = req.body.name;
    }
    if (req.body.age != null) {
        res.test.age = req.body.age;
    }
    if (req.body.password != null) {
        res.test.password = req.body.password;
    }
    try {
        const updatedTest = await res.test.save();
        res.json(updatedTest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route: Delete an existing test by ID
router.delete('/:id', getTest, async (req, res) => {
    try {
        await Test.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted test' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting test', error: error.message });
    }
});

// Middleware function to fetch a test by ID and attach to 'res' object
async function getTest(req, res, next) {
    let test;
    try {
        test = await Test.findById(req.params.id);
        if (test == null) {
            return res.status(404).json({ message: 'Cannot find test' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.test = test;
    next();  // Proceed to the next middleware or route handler
}

module.exports = router;
