const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const Post = require('../models/Post');
const Vote = require('../models/Vote');
const { getAnonymousId } = require('../middleware/auth');
const { checkContent } = require('../middleware/contentFilter');
const rateLimit = require('express-rate-limit');

// Rate limiting
const createPostLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 posts per 15 minutes
  message: 'Too many posts created, please try again later.'
});

// Get all posts with pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('category').optional().isIn(['news', 'campus-updates', 'academics', 'events', 'confessions', 'clubs', 'placements', 'lost-found', 'general']),
  query('sort').optional().isIn(['newest', 'trending', 'top'])
], getAnonymousId, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const sort = req.query.sort || 'newest';

    let sortOption = {};
    if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'trending') {
      sortOption = { trendingScore: -1 };
    } else if (sort === 'top') {
      sortOption = { voteScore: -1 };
    }

    const filter = {
      isRemoved: false,
      isReported: false
    };

    if (category) {
      filter.category = category;
    }

    const posts = await Post.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get user votes for these posts
    const postIds = posts.map(p => p._id);
    const userVotes = await Vote.find({
      userId: req.userId,
      targetId: { $in: postIds },
      targetType: 'post'
    }).lean();

    const voteMap = {};
    userVotes.forEach(vote => {
      voteMap[vote.targetId.toString()] = vote.voteType;
    });

    // Add user vote info to posts
    const postsWithVotes = posts.map(post => ({
      ...post,
      userVote: voteMap[post._id.toString()] || null
    }));

    const total = await Post.countDocuments(filter);

    res.json({
      posts: postsWithVotes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get single post
router.get('/:id', param('id').isMongoId(), getAnonymousId, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean();

    if (!post || post.isRemoved) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment views
    await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    // Get user vote
    const userVote = await Vote.findOne({
      userId: req.userId,
      targetId: req.params.id,
      targetType: 'post'
    }).lean();

    res.json({
      ...post,
      userVote: userVote?.voteType || null
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Create post
router.post('/', [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
  body('content').trim().isLength({ min: 10, max: 5000 }).withMessage('Content must be 10-5000 characters'),
  body('category').isIn(['news', 'campus-updates', 'academics', 'events', 'confessions', 'clubs', 'placements', 'lost-found', 'general']),
  body('tags').optional().isArray()
], createPostLimiter, getAnonymousId, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    // Check content for inappropriate words
    const contentCheck = checkContent(content);
    const titleCheck = checkContent(title);

    if (!contentCheck.isClean || !titleCheck.isClean) {
      return res.status(400).json({ 
        error: 'Content contains inappropriate language',
        filteredContent: contentCheck.filteredText,
        filteredTitle: titleCheck.filteredText
      });
    }

    const post = await Post.create({
      title: titleCheck.filteredText,
      content: contentCheck.filteredText,
      category,
      authorId: req.userId,
      tags: tags || []
    });

    // Update user post count
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user._id, { $inc: { postsCount: 1 } });

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('feed').emit('new-post', post);
    }

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update post (only by author)
router.put('/:id', [
  param('id').isMongoId(),
  body('title').optional().trim().isLength({ min: 5, max: 200 }),
  body('content').optional().trim().isLength({ min: 10, max: 5000 })
], getAnonymousId, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || post.isRemoved) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updates = {};
    if (req.body.title) {
      const titleCheck = checkContent(req.body.title);
      if (!titleCheck.isClean) {
        return res.status(400).json({ error: 'Title contains inappropriate language' });
      }
      updates.title = titleCheck.filteredText;
    }

    if (req.body.content) {
      const contentCheck = checkContent(req.body.content);
      if (!contentCheck.isClean) {
        return res.status(400).json({ error: 'Content contains inappropriate language' });
      }
      updates.content = contentCheck.filteredText;
    }

    if (req.body.category) {
      updates.category = req.body.category;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json(updatedPost);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post (soft delete by author)
router.delete('/:id', param('id').isMongoId(), getAnonymousId, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Post.findByIdAndUpdate(req.params.id, { isRemoved: true });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;


