const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateAnonymousId } = require('../middleware/auth');

// Generate anonymous token
router.post('/anonymous', async (req, res) => {
  try {
    const anonymousId = generateAnonymousId();
    
    // Create or get user
    let user = await User.findOne({ anonymousId });
    if (!user) {
      user = await User.create({ anonymousId });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: anonymousId },
      process.env.JWT_SECRET,
      { expiresIn: '365d' } // Long expiration for anonymous users
    );

    res.json({
      token,
      anonymousId,
      user: {
        id: user._id,
        anonymousId: user.anonymousId,
        karma: user.karma,
        postsCount: user.postsCount,
        commentsCount: user.commentsCount
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Failed to generate anonymous token' });
  }
});

// Get current user info
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.json({ user: null });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ anonymousId: decoded.userId });
      
      if (!user) {
        return res.json({ user: null });
      }

      res.json({
        user: {
          id: user._id,
          anonymousId: user.anonymousId,
          karma: user.karma,
          postsCount: user.postsCount,
          commentsCount: user.commentsCount
        }
      });
    } catch (err) {
      res.json({ user: null });
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

module.exports = router;


