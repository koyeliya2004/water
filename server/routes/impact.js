const express = require('express');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Enhanced community impact data
const enhancedCommunityData = {
  totalParticipants: 15247,
  totalRecharged: 4528000000, // liters
  totalWaterCredits: 12500000,
  thisMonthRecharge: 125000000,
  impactMetrics: {
    olympicPools: Math.floor(4528000000 / 2500000),
    householdsSupplied: Math.floor(4528000000 / 135 / 365),
    treesEquivalent: Math.floor(4528000000 / 10000),
    co2Offset: Math.floor(4528000000 / 1000 * 0.3), // kg
    moneySaved: Math.floor(4528000000 * 0.5), // Rs (assuming Rs 0.5 per liter)
  },
  monthlyTrend: [
    { month: 'Jan', recharge: 85000000, participants: 120 },
    { month: 'Feb', recharge: 78000000, participants: 125 },
    { month: 'Mar', recharge: 95000000, participants: 132 },
    { month: 'Apr', recharge: 110000000, participants: 145 },
    { month: 'May', recharge: 145000000, participants: 158 },
    { month: 'Jun', recharge: 280000000, participants: 185 },
    { month: 'Jul', recharge: 420000000, participants: 210 },
    { month: 'Aug', recharge: 380000000, participants: 225 },
    { month: 'Sep', recharge: 220000000, participants: 235 },
    { month: 'Oct', recharge: 165000000, participants: 242 },
    { month: 'Nov', recharge: 120000000, participants: 248 },
    { month: 'Dec', recharge: 92000000, participants: 255 },
  ],
  stateDistribution: [
    { name: 'Maharashtra', value: 2850000000, participants: 4250, percentage: 28.5 },
    { name: 'Karnataka', value: 2420000000, participants: 3180, percentage: 24.2 },
    { name: 'Tamil Nadu', value: 2180000000, participants: 2850, percentage: 21.8 },
    { name: 'Telangana', value: 1950000000, participants: 2420, percentage: 19.5 },
    { name: 'Gujarat', value: 680000000, participants: 1547, percentage: 6.8 },
  ],
  recentActivity: [
    { user: 'Sharma Family', action: 'Recharged 5,000L', location: 'Mumbai', time: '2 min ago', credits: 500 },
    { user: 'Patel Residence', action: 'Completed assessment', location: 'Ahmedabad', time: '15 min ago', credits: 50 },
    { user: 'Rao Household', action: 'Earned achievement', location: 'Hyderabad', time: '32 min ago', credits: 250 },
    { user: 'Kumar Family', action: 'Recharged 12,000L', location: 'Bangalore', time: '1 hour ago', credits: 1200 },
    { user: 'Nair Residence', action: 'Joined challenge', location: 'Kochi', time: '2 hours ago', credits: 0 },
  ],
  milestones: [
    { target: 10000000000, current: 4528000000, label: '10 Billion Liters', progress: 45 },
    { target: 20000, current: 15247, label: '20,000 Participants', progress: 76 },
    { target: 5000000, current: 2450000, label: '5M Households Supported', progress: 49 },
  ],
  seasonalImpact: {
    monsoon: { recharge: 2800000000, percentage: 62 },
    postMonsoon: { recharge: 950000000, percentage: 21 },
    winter: { recharge: 450000000, percentage: 10 },
    summer: { recharge: 328000000, percentage: 7 },
  },
};

// GET /api/impact - Get enhanced community impact
router.get('/', optionalAuth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: enhancedCommunityData,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/impact/user - Get user's personal impact
router.get('/user', auth, async (req, res) => {
  try {
    const user = req.user;
    
    const userImpact = {
      totalRecharged: user.stats.litersRecharged || 0,
      totalCredits: user.credits.total || 0,
      assessmentsCompleted: user.stats.assessmentsCompleted || 0,
      referrals: user.stats.referrals || 0,
      achievements: user.achievements.length || 0,
      streak: user.streaks.current || 0,
      longestStreak: user.streaks.longest || 0,
      rank: 0, // Would be calculated from leaderboard
      impactMetrics: {
        olympicPools: Math.floor((user.stats.litersRecharged || 0) / 2500000),
        householdsSupported: Math.floor((user.stats.litersRecharged || 0) / 135 / 365),
        treesEquivalent: Math.floor((user.stats.litersRecharged || 0) / 10000),
        co2Offset: Math.floor((user.stats.litersRecharged || 0) / 1000 * 0.3),
      },
      percentile: 78, // Mock percentile
      communityRank: { state: 12, city: 3 },
    };

    res.json({
      success: true,
      data: userImpact,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/impact/compare - Compare user impact to community
router.get('/compare', auth, async (req, res) => {
  try {
    const user = req.user;
    
    const comparison = {
      user: {
        litersRecharged: user.stats.litersRecharged || 0,
        credits: user.credits.total || 0,
        assessments: user.stats.assessmentsCompleted || 0,
      },
      community: {
        avgLitersRecharged: 296750, // Community average
        avgCredits: 820,
        avgAssessments: 3.2,
      },
      percentile: {
        litersRecharged: 92,
        credits: 88,
        assessments: 85,
      },
      totalCommunity: enhancedCommunityData,
    };

    res.json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/impact/timeline - Get impact timeline
router.get('/timeline', auth, async (req, res) => {
  try {
    // Mock timeline data
    const timeline = [
      { date: '2024-01', liters: 85000, credits: 8500 },
      { date: '2024-02', liters: 78000, credits: 7800 },
      { date: '2024-03', liters: 95000, credits: 9500 },
      { date: '2024-04', liters: 110000, credits: 11000 },
      { date: '2024-05', liters: 145000, credits: 14500 },
      { date: '2024-06', liters: 280000, credits: 28000 },
      { date: '2024-07', liters: 420000, credits: 42000 },
      { date: '2024-08', liters: 380000, credits: 38000 },
      { date: '2024-09', liters: 220000, credits: 22000 },
      { date: '2024-10', liters: 165000, credits: 16500 },
      { date: '2024-11', liters: 120000, credits: 12000 },
      { date: '2024-12', liters: 92000, credits: 9200 },
    ];

    res.json({
      success: true,
      data: timeline,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/impact/share/:format - Get shareable impact card data
router.get('/share/:format', auth, async (req, res) => {
  try {
    const user = req.user;
    const { format } = req.params;
    
    const shareData = {
      user: {
        name: user.privacy?.anonymous ? 'Anonymous' : user.name,
        tier: user.tier,
      },
      stats: {
        totalRecharged: user.stats.litersRecharged || 0,
        totalCredits: user.credits.total || 0,
        achievements: user.achievements.length || 0,
      },
      impact: {
        olympicPools: Math.floor((user.stats.litersRecharged || 0) / 2500000),
        treesEquivalent: Math.floor((user.stats.litersRecharged || 0) / 10000),
        householdsSupported: Math.floor((user.stats.litersRecharged || 0) / 135 / 365),
      },
      rank: {
        state: Math.floor(Math.random() * 50) + 1,
        city: Math.floor(Math.random() * 20) + 1,
      },
      community: enhancedCommunityData,
      badge: user.tier,
    };

    res.json({
      success: true,
      data: shareData,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
