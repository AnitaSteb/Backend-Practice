const express = require('express');
const router = express.Router();
const Test = require('../models/test');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// User registration
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const test = new Test({ username, password });
    
    try {
      await test.save();
      res.status(201).send('Test registered successfully');
    } catch (error) {
      res.status(500).send(error.message);
    }
});

// User login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
      const test = await Test.findOne({ username });
      if (!test) {
        return res.status(404).send('Test not found');
      }
  
      const isMatch = await test.comparePassword(password); // Use 'test' to call comparePassword
      if (!isMatch) {
        return res.status(401).send('Invalid credentials');
      }
  
      const token = jwt.sign({ userId: test._id }, process.env.JWT_SECRET);
      res.send({ token });
    } catch (error) {
      res.status(500).send(error.message);
    }
});

module.exports = router;
