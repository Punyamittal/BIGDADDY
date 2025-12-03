const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { getAnonymousId } = require('../middleware/auth');
const { checkContent } = require('../middleware/contentFilter');
const rateLimit = require('express-rate-limit');

const createCommentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 comments per 5 minutes
  message: 'Too many comments, please try again later.'
});

// Get comments for a post
router.get('/post/:postId', [
  param('postId').isMongoId(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], getAnonymousId, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({
      postId: req.params.postId,
      isRemoved: false,
      parentCommentId: null // Top-level comments only
    })
      .sort({ voteScore: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get replies for each comment
    const commentIds = comments.map(c => c._id);
    const replies = await Comment.find({
      postId: req.params.postId,
      parentCommentId: { $in: commentIds },
      isRemoved: false
    })
      .sort({ createdAt: 1 })
      .lean();

    // Get user votes
    const allCommentIds = [...commentIds, ...replies.map(r => r._id)];
    const userVotes = await Comment.aggregate([
      {
        $match: {
          _id: { $in: allCommentIds.map(id => require('mongoose').Types.ObjectId(id)) }
        }
      }
    ]);

    const Vote = require('../models/Vote');
    const votes = await Vote.find({
      userId: req.userId,
      targetId: { $in: allCommentIds },
      targetType: 'comment'
    }).lean();

    const voteMap = {};
    votes.forEach(vote => {
      voteMap[vote.targetId.toString()] = vote.voteType;
    });

    // Organize replies under parent comments
    const repliesMap = {};
    replies.forEach(reply => {
      const parentId = reply.parentCommentId.toString();
      if (!repliesMap[parentId]) {
        repliesMap[parentId] = [];
      }
      repliesMap[parentId].push({
        ...reply,
        userVote: voteMap[reply._id.toString()] || null
      });
    });

    const commentsWithReplies = comments.map(comment => ({
      ...comment,
      userVote: voteMap[comment._id.toString()] || null,
      replies: repliesMap[comment._id.toString()] || []
    }));

    const total = await Comment.countDocuments({
      postId: req.params.postId,
      isRemoved: false,
      parentCommentId: null
    });

    res.json({
      comments: commentsWithReplies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Create comment
router.post('/', [
  body('postId').isMongoId(),
  body('content').trim().isLength({ min: 1, max: 1000 }),
  body('parentCommentId').optional().isMongoId()
], createCommentLimiter, getAnonymousId, async (req, res) => {
  try {
    const { postId, content, parentCommentId } = req.body;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post || post.isRemoved) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check content
    const contentCheck = checkContent(content);
    if (!contentCheck.isClean) {
      return res.status(400).json({ 
        error: 'Content contains inappropriate language',
        filteredContent: contentCheck.filteredText
      });
    }

    const comment = await Comment.create({
      postId,
      content: contentCheck.filteredText,
      authorId: req.userId,
      parentCommentId: parentCommentId || null
    });

    // Update post comment count
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    // Update parent comment reply count if it's a reply
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, { $inc: { repliesCount: 1 } });
    }

    // Update user comment count
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user._id, { $inc: { commentsCount: 1 } });

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('feed').emit('new-comment', comment);
    }

    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Update comment
router.put('/:id', [
  param('id').isMongoId(),
  body('content').trim().isLength({ min: 1, max: 1000 })
], getAnonymousId, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment || comment.isRemoved) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.authorId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const contentCheck = checkContent(req.body.content);
    if (!contentCheck.isClean) {
      return res.status(400).json({ error: 'Content contains inappropriate language' });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content: contentCheck.filteredText },
      { new: true }
    );

    res.json(updatedComment);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// Delete comment
router.delete('/:id', param('id').isMongoId(), getAnonymousId, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.authorId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Comment.findByIdAndUpdate(req.params.id, { isRemoved: true });

    // Update post comment count
    await Post.findByIdAndUpdate(comment.postId, { $inc: { commentsCount: -1 } });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;


