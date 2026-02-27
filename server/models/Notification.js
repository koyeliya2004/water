const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: [
      'achievement_unlocked',
      'challenge_completed',
      'streak_milestone',
      'leaderboard_rank',
      'community_update',
      'friend_activity',
      'referral_bonus',
      'tier_upgrade',
      'daily_reminder',
      'system',
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  data: {
    achievementId: String,
    challengeId: String,
    communityId: String,
    newRank: Number,
    creditAmount: Number,
    actionUrl: String,
  },
  read: {
    type: Boolean,
    default: false,
  },
  readAt: Date,
}, {
  timestamps: true,
});

// Index for efficient querying
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
