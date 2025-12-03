const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  targetType: {
    type: String,
    enum: ['post', 'comment'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetType'
  },
  reason: {
    type: String,
    enum: ['spam', 'harassment', 'inappropriate', 'misinformation', 'other'],
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending'
  },
  reviewedBy: {
    type: String,
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

reportSchema.index({ targetId: 1, targetType: 1 });
reportSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);


