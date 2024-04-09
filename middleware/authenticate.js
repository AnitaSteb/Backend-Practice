// const jwt = require('jsonwebtoken');
// const Test = require('../models/test');

// const authenticate = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const test = await Test.findOne({ _id: decoded.userId });

//     if (!test) {
//       throw new Error();
//     }

//     req.test = test;
//     next();
//   } catch (error) {
//     res.status(401).send('Authentication failed');
//   }
// };

// module.exports = authenticate;

const jwt = require('jsonwebtoken');
const Test = require('../models/test');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).send('Authentication failed: Missing or invalid token');
    }

    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    const test = await Test.findById(decoded.userId);

    if (!test) {
      return res.status(401).send('Authentication failed: User not found');
    }

    req.test = test;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send('Authentication failed: Invalid token');
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).send('Authentication failed: Token expired');
    } else {
      console.error('Authentication error:', error);
      return res.status(401).send('Authentication failed');
    }
  }
};

module.exports = authenticate;
