const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const Report = require('../models/Report');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { getAnonymousId } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const reportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 reports per hour
  message: 'Too many reports, please try again later.'
});

// Create report
router.post('/', [
  body('targetType').isIn(['post', 'comment']),
  body('targetId').isMongoId(),
  body('reason').isIn(['spam', 'harassment', 'inappropriate', 'misinformation', 'other']),
  body('description').optional().trim().isLength({ max: 500 })
], reportLimiter, getAnonymousId, async (req, res) => {
  try {
    const { targetType, targetId, reason, description } = req.body;

    // Check if target exists
    const Model = targetType === 'post' ? Post : Comment;
    const target = await Model.findById(targetId);
    
    if (!target || target.isRemoved) {
      return res.status(404).json({ error: `${targetType} not found` });
    }

    // Check if user already reported this
    const existingReport = await Report.findOne({
      userId: req.userId,
      targetId,
      targetType
    });

    if (existingReport) {
      return res.status(400).json({ error: 'You have already reported this content' });
    }

    const report = await Report.create({
      userId: req.userId,
      targetType,
      targetId,
      reason,
      description
    });

    // Increment report count on target
    await Model.findByIdAndUpdate(targetId, { 
      $inc: { reports: 1 },
      isReported: true
    });

    res.status(201).json({ message: 'Report submitted successfully', report });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

// Get user's reports (optional, for transparency)
router.get('/my-reports', getAnonymousId, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json({ reports });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

module.exports = router;


