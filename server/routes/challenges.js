const express = require('express');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Default challenges
const defaultChallenges = [
  {
    title: 'Daily Assessment',
    description: 'Complete one water harvesting assessment today',
    type: 'daily',
    category: 'assessment',
    requirement: 1,
    unit: 'assessment',
    creditReward: 50,
    badge: { icon: '📋', name: 'Daily Assessor' },
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
    difficulty: 'easy',
  },
  {
    title: 'Weekly Referral',
    description: 'Refer one friend to join the community',
    type: 'weekly',
    category: 'referral',
    requirement: 1,
    unit: 'referral',
    creditReward: 100,
    badge: { icon: '👥', name: 'Friend Maker' },
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    difficulty: 'medium',
  },
  {
    title: 'Monsoon Harvest',
    description: 'Harvest 10,000 liters during monsoon season',
    type: 'seasonal',
    category: 'harvest',
    requirement: 10000,
    unit: 'liters',
    creditReward: 500,
    badge: { icon: '🌧️', name: 'Monsoon Master' },
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    season: 'monsoon',
    difficulty: 'hard',
  },
  {
    title: 'Community Builder',
    description: 'Join a community group',
    type: 'daily',
    category: 'social',
    requirement: 1,
    unit: 'community',
    creditReward: 100,
    badge: { icon: '🤝', name: 'Team Player' },
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
    difficulty: 'easy',
  },
  {
    title: 'Streak Champion',
    description: 'Maintain a 7-day activity streak',
    type: 'daily',
    category: 'streak',
    requirement: 7,
    unit: 'days',
    creditReward: 150,
    badge: { icon: '🔥', name: 'On Fire' },
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    difficulty: 'medium',
  },
  {
    title: 'Share the Impact',
    description: 'Share your water harvesting impact on social media',
    type: 'daily',
    category: 'social',
    requirement: 1,
    unit: 'share',
    creditReward: 25,
    badge: { icon: '📤', name: 'Spread the Word' },
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
    difficulty: 'easy',
  },
  {
    title: 'Quiz Master',
    description: 'Complete an educational quiz about water conservation',
    type: 'daily',
    category: 'special',
    requirement: 1,
    unit: 'quiz',
    creditReward: 30,
    badge: { icon: '🧠', name: 'Quiz Wiz' },
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
    difficulty: 'easy',
  },
  {
    title: '100K Challenge',
    description: 'Reach 100,000 liters total harvest',
    type: 'milestone',
    category: 'harvest',
    requirement: 100000,
    unit: 'liters',
    creditReward: 2000,
    badge: { icon: '🏆', name: 'Century Hero' },
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    difficulty: 'expert',
  },
];

// Initialize default challenges
const initializeChallenges = async () => {
  try {
    const now = new Date();
    for (const challenge of defaultChallenges) {
      const exists = await Challenge.findOne({ 
        title: challenge.title,
        type: challenge.type,
      });
      
      if (!exists) {
        await Challenge.create({
          ...challenge,
          isActive: true,
        });
      }
    }
  } catch (error) {
    console.log('Challenge initialization skipped');
  }
};

initializeChallenges();

// GET /api/challenges - Get all active challenges
router.get('/', async (req, res) => {
  try {
    const { type, category } = req.query;
    let query = { isActive: true, endDate: { $gt: new Date() } };
    
    if (type) query.type = type;
    if (category) query.category = category;

    const challenges = await Challenge.find(query)
      .sort({ difficulty: 1, endDate: 1 })
      .limit(20);

    res.json({
      success: true,
      data: challenges,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/challenges/featured - Get featured challenges
router.get('/featured', async (req, res) => {
  try {
    const challenges = await Challenge.find({
      isActive: true,
      featured: true,
      endDate: { $gt: new Date() },
    }).limit(5);

    res.json({
      success: true,
      data: challenges,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/challenges/user - Get user's challenge progress
router.get('/user', auth, async (req, res) => {
  try {
    const user = req.user;
    
    // Get all active challenges
    const challenges = await Challenge.find({
      isActive: true,
      endDate: { $gt: new Date() },
    });

    // Map user's progress
    const challengesWithProgress = challenges.map(challenge => {
      const participant = challenge.participants.find(
        p => p.user.toString() === user._id.toString()
      );
      
      return {
        id: challenge._id,
        title: challenge.title,
        description: challenge.description,
        type: challenge.type,
        category: challenge.category,
        requirement: challenge.requirement,
        unit: challenge.unit,
        creditReward: challenge.creditReward,
        badge: challenge.badge,
        difficulty: challenge.difficulty,
        endDate: challenge.endDate,
        progress: participant?.progress || 0,
        completed: participant?.completed || false,
        completedAt: participant?.completedAt || null,
      };
    });

    const daily = challengesWithProgress.filter(c => c.type === 'daily');
    const weekly = challengesWithProgress.filter(c => c.type === 'weekly');
    const seasonal = challengesWithProgress.filter(c => c.type === 'seasonal');
    const milestone = challengesWithProgress.filter(c => c.type === 'milestone');

    res.json({
      success: true,
      data: {
        all: challengesWithProgress,
        daily,
        weekly,
        seasonal,
        milestone,
        completedCount: challengesWithProgress.filter(c => c.completed).length,
        totalCount: challengesWithProgress.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/challenges/:id/progress - Update challenge progress
router.post('/:id/progress', auth, async (req, res) => {
  try {
    const { progress } = req.body;
    const user = req.user;
    
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ success: false, error: 'Challenge not found' });
    }

    // Find or create participant
    let participant = challenge.participants.find(
      p => p.user.toString() === user._id.toString()
    );

    if (!participant) {
      participant = {
        user: user._id,
        progress: 0,
        completed: false,
      };
      challenge.participants.push(participant);
    }

    participant.progress = Math.max(participant.progress, progress);
    
    // Check if completed
    if (participant.progress >= challenge.requirement && !participant.completed) {
      participant.completed = true;
      participant.completedAt = new Date();
      
      // Award credits
      user.credits.total += challenge.creditReward;
      user.credits.lifetime += challenge.creditReward;
      user.credits.monthly += challenge.creditReward;
      
      // Log activity
      await Activity.create({
        user: user._id,
        type: 'challenge_completed',
        data: {
          challengeId: challenge._id,
          creditAmount: challenge.creditReward,
        },
      });
      
      await user.save();
    }

    await challenge.save();

    res.json({
      success: true,
      data: {
        progress: participant.progress,
        completed: participant.completed,
        creditReward: participant.completed ? challenge.creditReward : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/challenges/:id/join - Join a challenge
router.post('/:id/join', auth, async (req, res) => {
  try {
    const user = req.user;
    
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ success: false, error: 'Challenge not found' });
    }

    // Check if already participating
    const alreadyParticipating = challenge.participants.some(
      p => p.user.toString() === user._id.toString()
    );

    if (alreadyParticipating) {
      return res.status(400).json({ success: false, error: 'Already participating' });
    }

    challenge.participants.push({
      user: user._id,
      progress: 0,
      completed: false,
    });

    await challenge.save();

    res.json({
      success: true,
      data: {
        message: 'Successfully joined challenge',
        challenge: {
          id: challenge._id,
          title: challenge.title,
          creditReward: challenge.creditReward,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
