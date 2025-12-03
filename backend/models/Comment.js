const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  authorId: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    default: 'Anonymous'
  },
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  voteScore: {
    type: Number,
    default: 0
  },
  reports: {
    type: Number,
    default: 0
  },
  isReported: {
    type: Boolean,
    default: false
  },
  isRemoved: {
    type: Boolean,
    default: false
  },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  repliesCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ parentCommentId: 1 });

module.exports = mongoose.model('Comment', commentSchema);


