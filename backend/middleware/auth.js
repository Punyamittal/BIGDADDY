const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate or retrieve anonymous user ID
const getAnonymousId = async (req, res, next) => {
  try {
    let userId = null;
    
    // Check for token in header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (err) {
        // Invalid token, generate new anonymous ID
        userId = generateAnonymousId();
      }
    } else {
      // No token, generate new anonymous ID
      userId = generateAnonymousId();
    }
    
    // Ensure user exists in database
    let user = await User.findOne({ anonymousId: userId });
    if (!user) {
      user = await User.create({ anonymousId: userId });
    }
    
    req.userId = userId;
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    req.userId = generateAnonymousId();
    next();
  }
};

// Generate random anonymous ID
const generateAnonymousId = () => {
  return 'anon_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Optional: Require valid token (for admin routes)
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { getAnonymousId, requireAuth, generateAnonymousId };


