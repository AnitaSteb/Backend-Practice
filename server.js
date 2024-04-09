// Load environment variables from .env file into process.env
require('dotenv').config();

// Import the Express framework
const express = require('express');

// Create an instance of Express application
const app = express();

// Import Mongoose library for MongoDB interaction
const mongoose = require('mongoose');

// Connect to MongoDB database using the DATABASE_URL environment variable
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Event listener for MongoDB connection error
db.on('error', (error) => console.error(error));

// Event listener for successful MongoDB connection
db.once('open', () => console.log('Connected to Database'));

// Middleware to parse incoming JSON data
app.use(express.json());

// Import routers for handling test-related routes and authentication routes
const testsRouter = require('./routes/tests');
const authRouter = require('./routes/auth');

// Mount the testsRouter middleware for routes starting with '/tests'
app.use('/tests', testsRouter);

// Mount the authRouter middleware for routes starting with '/auth'
app.use('/auth', authRouter); // Add authentication routes

// Start the Express server to listen on port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
