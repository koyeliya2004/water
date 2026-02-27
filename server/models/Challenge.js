const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'seasonal', 'community', 'milestone'],
    required: true,
  },
  category: {
    type: String,
    enum: ['harvest', 'referral', 'assessment', 'social', 'streak', 'special'],
    default: 'harvest',
  },
  requirement: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    default: 'liters',
  },
  creditReward: {
    type: Number,
    required: true,
  },
  badge: {
    icon: String,
    name: String,
  },
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
    progress: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    completedAt: Date,
  }],
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  season: {
    type: String,
    enum: ['monsoon', 'post-monsoon', 'winter', 'summer', 'all'],
    default: 'all',
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium',
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Virtual for participant count
challengeSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

// Virtual for completion rate
challengeSchema.virtual('completionRate').get(function() {
  const completed = this.participants.filter(p => p.completed).length;
  return this.participants.length > 0 
    ? Math.round((completed / this.participants.length) * 100) 
    : 0;
});

module.exports = mongoose.model('Challenge', challengeSchema);
