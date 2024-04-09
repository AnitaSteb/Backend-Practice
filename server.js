require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', (error)=>console.error(error));
db.once('open', ()=>console.log('Connected to Database'));

app.use(express.json());

const testsRouter = require('./routes/tests');
const authRouter = require('./routes/auth');
app.use('/tests',testsRouter);
app.use('/auth', authRouter); // Add authentication routes


app.listen(3000, () => {console.log('Server is running on port 3000')});
