const jwt = require('jsonwebtoken');

// Define the same SECRET KEY used for signing the token
//const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_internship_key';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_key_for_local_testing_only';
const restricted = (req, res, next) => {
  // 1. Check for the token in the 'Authorization' header
  const token = req.headers.authorization;

  if (token) {
    // 2. Verify the token using the secret key
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        // Token is invalid, expired, or corrupted
        return res.status(401).json({ message: 'Token is invalid or expired. Please log in again.' });
      }
      

      // 3. Token is valid! Attach user info to the request object
      req.user = decodedToken;

      // Move to the next middleware or the route handler
      next(); 
    });
  } else {
    // No token provided
    return res.status(401).json({ message: 'No authorization token provided. Access denied.' });
  }
};

module.exports = restricted;