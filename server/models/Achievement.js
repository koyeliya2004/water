const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['harvest', 'community', 'streak', 'referral', 'milestone', 'special'],
    default: 'harvest',
  },
  condition: {
    type: String,
    required: true,
  },
  requirement: {
    type: Number,
    default: 1,
  },
  creditReward: {
    type: Number,
    default: 0,
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze',
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Achievement', achievementSchema);
