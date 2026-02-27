const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: [
      'assessment_completed',
      'credits_earned',
      'achievement_unlocked',
      'challenge_completed',
      'referral_made',
      'community_joined',
      'community_created',
      'streak_updated',
      'tier_upgraded',
      'installation_verified',
      'share_posted',
      'quiz_completed',
    ],
    required: true,
  },
  data: {
    creditsEarned: Number,
    achievementId: String,
    challengeId: String,
    communityId: String,
    litersRecharged: Number,
    streakDays: Number,
    newTier: String,
    referredUserId: mongoose.Schema.Types.ObjectId,
  },
  visibility: {
    type: String,
    enum: ['public', 'friends', 'community', 'private'],
    default: 'public',
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
  },
}, {
  timestamps: true,
});

// Index for efficient querying
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ type: 1, createdAt: -1 });
activitySchema.index({ community: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
