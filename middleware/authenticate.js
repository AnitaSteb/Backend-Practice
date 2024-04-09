const jwt = require('jsonwebtoken');
const Test = require('../models/test');

// Authentication middleware function
const authenticate = async (req, res, next) => {
  try {
    // Extract the token from the 'Authorization' header
    const token = req.header('Authorization');

    // Check if token is missing or doesn't start with 'Bearer '
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).send('Authentication failed: Missing or invalid token');
    }

    // Extract the token (remove 'Bearer ' prefix) and verify it using JWT_SECRET
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

    // Find the user (Test document) in the database using the decoded userId from the token
    const test = await Test.findById(decoded.userId);

    // If user (test) not found, authentication fails
    if (!test) {
      return res.status(401).send('Authentication failed: User not found');
    }

    // Attach the user (test) object to the request for further processing
    req.test = test;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle specific JWT-related errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send('Authentication failed: Invalid token');
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).send('Authentication failed: Token expired');
    } else {
      // Log any other authentication errors to the console
      console.error('Authentication error:', error);
      return res.status(401).send('Authentication failed');
    }
  }
};

module.exports = authenticate; // Export the authentication middleware
