const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const Vote = require('../models/Vote');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { getAnonymousId } = require('../middleware/auth');

// Vote on post or comment
router.post('/', [
  body('targetType').isIn(['post', 'comment']),
  body('targetId').isMongoId(),
  body('voteType').isIn(['upvote', 'downvote'])
], getAnonymousId, async (req, res) => {
  try {
    const { targetType, targetId, voteType } = req.body;

    // Check if target exists
    const Model = targetType === 'post' ? Post : Comment;
    const target = await Model.findById(targetId);
    
    if (!target || target.isRemoved) {
      return res.status(404).json({ error: `${targetType} not found` });
    }

    // Check for existing vote
    const existingVote = await Vote.findOne({
      userId: req.userId,
      targetId,
      targetType
    });

    let vote;
    let voteChange = 0;

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Remove vote (toggle off)
        await Vote.findByIdAndDelete(existingVote._id);
        voteChange = voteType === 'upvote' ? -1 : 1;
        vote = null;
      } else {
        // Change vote type
        existingVote.voteType = voteType;
        await existingVote.save();
        vote = existingVote;
        voteChange = voteType === 'upvote' ? 2 : -2; // +2 or -2 because we're changing from opposite
      }
    } else {
      // Create new vote
      vote = await Vote.create({
        userId: req.userId,
        targetType,
        targetId,
        voteType
      });
      voteChange = voteType === 'upvote' ? 1 : -1;
    }

    // Update target vote counts
    if (voteChange !== 0) {
      if (voteType === 'upvote' || (existingVote && existingVote.voteType === 'upvote' && voteChange < 0)) {
        await Model.findByIdAndUpdate(targetId, {
          $inc: {
            upvotes: voteChange > 0 ? 1 : -1,
            voteScore: voteChange
          }
        });
      } else {
        await Model.findByIdAndUpdate(targetId, {
          $inc: {
            downvotes: voteChange < 0 ? 1 : -1,
            voteScore: voteChange
          }
        });
      }

      // Recalculate vote score properly
      const updatedTarget = await Model.findById(targetId);
      const newVoteScore = updatedTarget.upvotes - updatedTarget.downvotes;
      await Model.findByIdAndUpdate(targetId, { voteScore: newVoteScore });
    }

    res.json({
      vote: vote ? { type: vote.voteType } : null,
      message: vote ? 'Vote recorded' : 'Vote removed'
    });
  } catch (error) {
    console.error('Vote error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Vote already exists' });
    }
    res.status(500).json({ error: 'Failed to process vote' });
  }
});

// Get user's votes for multiple targets
router.post('/batch', [
  body('targets').isArray().notEmpty(),
  body('targets.*.targetType').isIn(['post', 'comment']),
  body('targets.*.targetId').isMongoId()
], getAnonymousId, async (req, res) => {
  try {
    const { targets } = req.body;

    const votes = await Vote.find({
      userId: req.userId,
      $or: targets.map(t => ({
        targetId: t.targetId,
        targetType: t.targetType
      }))
    }).lean();

    const voteMap = {};
    votes.forEach(vote => {
      const key = `${vote.targetType}_${vote.targetId}`;
      voteMap[key] = vote.voteType;
    });

    res.json({ votes: voteMap });
  } catch (error) {
    console.error('Get votes error:', error);
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
});

module.exports = router;


