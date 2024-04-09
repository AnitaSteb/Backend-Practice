const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: { type: String, required: true },
    age: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
})

  // Method to compare passwords
  testSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };
module.exports = mongoose.model('Test', testSchema);


// Hash password before saving to database
testSchema.pre('save', async function(next) {
    try {
        const user = this;
        if (user.isModified('password')) {
            user.password = await bcrypt.hash(user.password, 10);  // Hash password with salt factor 10
        }
        next();
    } catch (error) {
        next(error);  // Pass error to the next middleware
    }
});
