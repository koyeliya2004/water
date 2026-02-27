const express = require('express');
const User = require('../models/User');
const Achievement = require('../models/Achievement');
const achievementsData = require('../data/achievements');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Initialize achievements in database
const initializeAchievements = async () => {
  try {
    for (const achievement of achievementsData) {
      await Achievement.findOneAndUpdate(
        { id: achievement.id },
        achievement,
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    console.log('Achievement initialization skipped');
  }
};

// Run on startup
initializeAchievements();

// GET /api/achievements - Get all achievements
router.get('/', async (req, res) => {
  try {
    const allAchievements = await Achievement.find({}).sort({ rarity: 1, category: 1 });
    
    res.json({
      success: true,
      data: allAchievements,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/achievements/user - Get user's achievements
router.get('/user', auth, async (req, res) => {
  try {
    const user = req.user;
    
    // Get all achievements
    const allAchievements = await Achievement.find({});
    
    // Map user achievements
    const userAchievementIds = user.achievements.map(a => a.id);
    
    const achievementsWithStatus = allAchievements.map(achievement => {
      const userAchievement = user.achievements.find(a => a.id === achievement.id);
      return {
        ...achievement.toObject(),
        unlocked: !!userAchievement,
        unlockedAt: userAchievement?.unlockedAt || null,
      };
    });

    // Group by category
    const grouped = {
      harvest: achievementsWithStatus.filter(a => a.category === 'harvest'),
      community: achievementsWithStatus.filter(a => a.category === 'community'),
      streak: achievementsWithStatus.filter(a => a.category === 'streak'),
      referral: achievementsWithStatus.filter(a => a.category === 'referral'),
      milestone: achievementsWithStatus.filter(a => a.category === 'milestone'),
      special: achievementsWithStatus.filter(a => a.category === 'special'),
    };

    res.json({
      success: true,
      data: {
        achievements: achievementsWithStatus,
        grouped,
        unlockedCount: userAchievementIds.length,
        totalCount: allAchievements.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/achievements/check - Check and unlock achievements
router.post('/check', auth, async (req, res) => {
  try {
    const user = req.user;
    const { stats } = req.body; // Pass current stats to check
    
    const allAchievements = await Achievement.find({});
    const userAchievementIds = user.achievements.map(a => a.id);
    
    const newUnlocks = [];
    
    for (const achievement of allAchievements) {
      if (userAchievementIds.includes(achievement.id)) continue;
      
      let unlocked = false;
      
      switch (achievement.id) {
        case 'first_harvest':
          unlocked = (stats?.assessmentsCompleted || user.stats.assessmentsCompleted) >= 1;
          break;
        case 'droplet_collector':
          unlocked = (stats?.litersRecharged || user.stats.litersRecharged) >= 1000;
          break;
        case 'stream_starter':
          unlocked = (stats?.litersRecharged || user.stats.litersRecharged) >= 10000;
          break;
        case 'river_ranger':
          unlocked = (stats?.litersRecharged || user.stats.litersRecharged) >= 100000;
          break;
        case 'ocean_guardian':
          unlocked = (stats?.litersRecharged || user.stats.litersRecharged) >= 1000000;
          break;
        case 'referral_star':
          unlocked = (stats?.referrals || user.stats.referrals) >= 5;
          break;
        case 'referral_champion':
          unlocked = (stats?.referrals || user.stats.referrals) >= 25;
          break;
        case 'word_spreader':
          unlocked = (stats?.referrals || user.stats.referrals) >= 100;
          break;
        case 'streak_starter':
          unlocked = (stats?.streakDays || user.streaks.current) >= 7;
          break;
        case 'streak_master':
          unlocked = (stats?.streakDays || user.streaks.current) >= 30;
          break;
        case 'unstoppable':
          unlocked = (stats?.streakDays || user.streaks.longest) >= 100;
          break;
        case 'credit_collector_1k':
          unlocked = (stats?.lifetimeCredits || user.credits.lifetime) >= 1000;
          break;
        case 'credit_collector_10k':
          unlocked = (stats?.lifetimeCredits || user.credits.lifetime) >= 10000;
          break;
        case 'credit_collector_50k':
          unlocked = (stats?.lifetimeCredits || user.credits.lifetime) >= 50000;
          break;
        case 'platinum_elite':
          unlocked = user.tier === 'platinum';
          break;
        case 'team_player':
          unlocked = !!user.social?.communityId;
          break;
        default:
          break;
      }
      
      if (unlocked) {
        user.achievements.push({
          id: achievement.id,
          unlockedAt: new Date(),
        });
        
        if (achievement.creditReward > 0) {
          user.credits.total += achievement.creditReward;
          user.credits.lifetime += achievement.creditReward;
          user.credits.monthly += achievement.creditReward;
        }
        
        newUnlocks.push({
          ...achievement.toObject(),
          creditReward: achievement.creditReward,
        });
      }
    }
    
    if (newUnlocks.length > 0) {
      await user.save();
    }
    
    res.json({
      success: true,
      data: {
        newUnlocks,
        totalUnlocked: user.achievements.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/achievements/:id - Get specific achievement
router.get('/:id', async (req, res) => {
  try {
    const achievement = await Achievement.findOne({ id: req.params.id });
    
    if (!achievement) {
      return res.status(404).json({ success: false, error: 'Achievement not found' });
    }
    
    res.json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/achievements/leaderboard/rarity - Get achievement leaderboard
router.get('/leaderboard/rarity', async (req, res) => {
  try {
    // This would query users sorted by achievement count in real implementation
    // For now, return mock data
    
    const mockData = [
      { userId: '1', name: 'Water Warrior', achievements: 25, rarity: { legendary: 3, epic: 8, rare: 10, common: 4 } },
      { userId: '2', name: 'Rain Maker', achievements: 22, rarity: { legendary: 2, epic: 6, rare: 8, common: 6 } },
      { userId: '3', name: 'Droplet Hero', achievements: 20, rarity: { legendary: 1, epic: 5, rare: 7, common: 7 } },
    ];
    
    res.json({
      success: true,
      data: mockData,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
