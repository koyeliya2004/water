const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  location: {
    state: { type: String, default: '' },
    city: { type: String, default: '' },
    locality: { type: String, default: '' },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  credits: {
    total: { type: Number, default: 0 },
    monthly: { type: Number, default: 0 },
    allTime: { type: Number, default: 0 },
    lifetime: { type: Number, default: 0 },
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze',
  },
  achievements: [{
    id: String,
    unlockedAt: { type: Date, default: Date.now },
  }],
  stats: {
    litersRecharged: { type: Number, default: 0 },
    assessmentsCompleted: { type: Number, default: 0 },
    referrals: { type: Number, default: 0 },
    structuresImplemented: { type: Number, default: 0 },
  },
  privacy: {
    showOnLeaderboard: { type: Boolean, default: true },
    showLocation: { type: Boolean, default: true },
    anonymous: { type: Boolean, default: false },
  },
  social: {
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
  },
  streaks: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActivityDate: Date,
  },
  challenges: [{
    challengeId: String,
    progress: Number,
    completed: { type: Boolean, default: false },
    completedAt: Date,
  }],
  referralCode: {
    type: String,
    unique: true,
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  notificationSettings: {
    dailyChallenge: { type: Boolean, default: true },
    achievements: { type: Boolean, default: true },
    community: { type: Boolean, default: true },
    leaderboard: { type: Boolean, default: false },
  },
}, {
  timestamps: true,
});

// Virtual for rank calculation
userSchema.virtual('rank').get(function() {
  return 0; // Calculated dynamically
});

// Method to calculate tier based on credits
userSchema.methods.calculateTier = function() {
  const total = this.credits.lifetime || this.credits.total;
  if (total >= 50000) return 'platinum';
  if (total >= 20000) return 'gold';
  if (total >= 5000) return 'silver';
  return 'bronze';
};

// Method to add credits
userSchema.methods.addCredits = function(amount, type = 'general') {
  this.credits.total += amount;
  this.credits.lifetime += amount;
  this.credits.monthly += amount;
  this.credits.allTime += amount;
  this.tier = this.calculateTier();
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
