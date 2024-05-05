const mongoose = require('mongoose');

// Define a new Mongoose schema for the 'User' model
const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,       
        unique: true  // Ensure 'id' field is unique

    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;