const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  anonymousId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    default: null
  },
  postsCount: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  karma: {
    type: Number,
    default: 0
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: {
    type: String,
    default: null
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

userSchema.index({ anonymousId: 1 });

module.exports = mongoose.model('User', userSchema);


