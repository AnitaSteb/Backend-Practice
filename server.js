// Load environment variables from .env file into process.env
require('dotenv').config();

const { Pool } = require('pg'); // Import the Pool class from the pg

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
// const testsRouter = require('./routes/tests');
const usersRouter = require('./routes/users');
// const authRouter = require('./routes/auth');
const userAuth = require('./routes/userAuth');
// Mount the testsRouter middleware for routes starting with '/tests'
app.use('/users', usersRouter);

// Mount the authRouter middleware for routes starting with '/auth'
app.use('/userAuth', userAuth); // Add authentication routes



// PostgreSQL database connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '1234',
  port: 5432,
});

// Endpoint to create a new file
app.post('/file', async (req, res) => {
  // Check if user is authenticated (you can implement your own authentication logic here)
  const isAuthenticated = true; // Implement your authentication logic
  if (!isAuthenticated) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { fileName, size, pathToFile, fileType, fileOwner, sha } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO files (fileName, size, pathToFile, fileType, fileOwner, sha) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [fileName, size, pathToFile, fileType, fileOwner, sha]
    );

    res.json(result.rows[0]); // Return the created file details
  } catch (error) {
    console.error('Error creating file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get file details by ID
app.get('/file/:id', async (req, res) => {
  const fileId = req.params.id;

  // Check authentication (implement your logic here)

  try {
    const result = await pool.query('SELECT * FROM files WHERE id = $1', [fileId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json(result.rows[0]); // Return the file details
  } catch (error) {
    console.error('Error retrieving file details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to delete a file by ID
app.delete('/file/:id', async (req, res) => {
  const fileId = req.params.id;

  // Check authentication and ownership (implement your logic here)

  try {
    const result = await pool.query('DELETE FROM files WHERE id = $1 RETURNING *', [fileId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Express server to listen on port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});