const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

// Get platform statistics
router.get('/', async (req, res) => {
  try {
    const [
      totalPosts,
      totalComments,
      totalUsers,
      postsByCategory,
      recentActivity
    ] = await Promise.all([
      Post.countDocuments({ isRemoved: false }),
      Comment.countDocuments({ isRemoved: false }),
      User.countDocuments(),
      Post.aggregate([
        { $match: { isRemoved: false } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]),
      Post.find({ isRemoved: false })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('title category createdAt')
        .lean()
    ]);

    res.json({
      totalPosts,
      totalComments,
      totalUsers,
      postsByCategory: postsByCategory.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentActivity
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get trending topics
router.get('/trending', async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const trendingPosts = await Post.find({
      createdAt: { $gte: since },
      isRemoved: false
    })
      .sort({ trendingScore: -1 })
      .limit(10)
      .select('title category trendingScore createdAt')
      .lean();

    res.json({ trending: trendingPosts });
  } catch (error) {
    console.error('Get trending error:', error);
    res.status(500).json({ error: 'Failed to fetch trending topics' });
  }
});

module.exports = router;


