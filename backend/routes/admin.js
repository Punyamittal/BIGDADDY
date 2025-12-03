const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Report = require('../models/Report');
const { requireAuth } = require('../middleware/auth');
const { param, body, query } = require('express-validator');

// TODO: Add admin role checking middleware
// For now, this is a placeholder - implement proper admin authentication

// Get all reports
router.get('/reports', requireAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status || 'pending';

    const filter = { status };
    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('targetId')
      .lean();

    const total = await Report.countDocuments(filter);

    res.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Review report
router.put('/reports/:id', [
  param('id').isMongoId(),
  body('status').isIn(['reviewed', 'resolved', 'dismissed']),
  body('action').optional().isIn(['remove', 'warn', 'none'])
], requireAuth, async (req, res) => {
  try {
    const { status, action } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    report.status = status;
    report.reviewedBy = req.userId;
    report.reviewedAt = new Date();
    await report.save();

    // Take action if needed
    if (action === 'remove') {
      const Model = report.targetType === 'post' ? Post : Comment;
      await Model.findByIdAndUpdate(report.targetId, { isRemoved: true });
    }

    res.json({ message: 'Report reviewed', report });
  } catch (error) {
    console.error('Review report error:', error);
    res.status(500).json({ error: 'Failed to review report' });
  }
});

// Remove post/comment
router.delete('/:type/:id', [
  param('type').isIn(['post', 'comment']),
  param('id').isMongoId()
], requireAuth, async (req, res) => {
  try {
    const Model = req.params.type === 'post' ? Post : Comment;
    const item = await Model.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: `${req.params.type} not found` });
    }

    await Model.findByIdAndUpdate(req.params.id, { isRemoved: true });

    res.json({ message: `${req.params.type} removed successfully` });
  } catch (error) {
    console.error('Remove item error:', error);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// Pin/unpin post
router.put('/posts/:id/pin', [
  param('id').isMongoId(),
  body('isPinned').isBoolean()
], requireAuth, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { isPinned: req.body.isPinned },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Pin post error:', error);
    res.status(500).json({ error: 'Failed to pin post' });
  }
});

module.exports = router;


