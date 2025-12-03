const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  category: {
    type: String,
    required: true,
    enum: ['news', 'campus-updates', 'academics', 'events', 'confessions', 'clubs', 'placements', 'lost-found', 'general'],
    default: 'general'
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
  commentsCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  shares: {
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
  isPinned: {
    type: Boolean,
    default: false
  },
  images: [{
    type: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
  trendingScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for performance
postSchema.index({ createdAt: -1 });
postSchema.index({ voteScore: -1 });
postSchema.index({ trendingScore: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ isRemoved: 1, isReported: 1 });

// Calculate trending score before save
postSchema.pre('save', function(next) {
  const hoursSinceCreation = (Date.now() - this.createdAt) / (1000 * 60 * 60);
  const timeDecay = Math.max(0.1, 1 / (1 + hoursSinceCreation / 24));
  
  this.trendingScore = (
    this.voteScore * 2 +
    this.commentsCount * 1.5 +
    this.views * 0.1 +
    this.shares * 1
  ) * timeDecay;
  
  next();
});

module.exports = mongoose.model('Post', postSchema);


