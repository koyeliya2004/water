const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  location: {
    state: { type: String, required: true },
    city: { type: String, required: true },
    locality: { type: String, default: '' },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  image: {
    type: String,
    default: '',
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'member'],
      default: 'member',
    },
    joinedAt: { type: Date, default: Date.now },
  }],
  stats: {
    totalRecharged: { type: Number, default: 0 },
    totalCredits: { type: Number, default: 0 },
    assessmentsCompleted: { type: Number, default: 0 },
    activeChallenges: { type: Number, default: 0 },
  },
  settings: {
    isPublic: { type: Boolean, default: true },
    allowJoinRequests: { type: Boolean, default: true },
    showOnLeaderboard: { type: Boolean, default: true },
  },
  activeChallenge: {
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
    target: Number,
    current: Number,
    endsAt: Date,
  },
  leaderboard: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rank: Number,
    rechargedLiters: Number,
    credits: Number,
  }],
}, {
  timestamps: true,
});

// Virtual for member count
communitySchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Method to add member
communitySchema.methods.addMember = async function(userId, role = 'member') {
  const alreadyMember = this.members.find(m => m.user.toString() === userId.toString());
  if (alreadyMember) {
    throw new Error('User is already a member');
  }
  
  this.members.push({ user: userId, role });
  return this.save();
};

module.exports = mongoose.model('Community', communitySchema);
