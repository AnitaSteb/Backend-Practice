const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define a new Mongoose schema for the 'Test' model
const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true  // Ensure 'name' field is unique
    },
    password: { 
        type: String, 
        required: true  // 'password' field is required
    },
    age: {
        type: Number,
        required: true  // 'age' field is required
    },
    date: {
        type: Date,
        required: true,
        default: Date.now  // Default value is current date/time when not specified
    }
});

// Method to compare passwords
testSchema.methods.comparePassword = function(candidatePassword) {
    // Use bcrypt to compare the provided 'candidatePassword' with the stored hashed password ('this.password')
    return bcrypt.compare(candidatePassword, this.password);
};

// Export the Mongoose model 'Test' based on the defined schema
module.exports = mongoose.model('Test', testSchema);

// Hash password before saving to database (pre-save hook)
testSchema.pre('save', async function(next) {
    try {
        const user = this;  // Reference to the current document
        if (user.isModified('password')) {
            // Hash the 'password' field only if it has been modified or is new
            user.password = await bcrypt.hash(user.password, 10);  // Hash password with salt factor 10
        }
        next();  // Proceed to the next middleware or operation
    } catch (error) {
        next(error);  // Pass any encountered error to the next middleware
    }
});
