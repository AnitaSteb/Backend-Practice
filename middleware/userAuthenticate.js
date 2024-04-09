const jwt = require('jsonwebtoken');
const User = require('../models/user');

const secretKey = 'your-secret-key'; // Replace with your own secret key

function userAuthenticate(req, res, next) {
    // Get the token from the request headers
    const token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, secretKey);

        // Attach the decoded user information to the request object
        req.user = decoded;

        // Call the next middleware
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
}

module.exports = userAuthenticate;