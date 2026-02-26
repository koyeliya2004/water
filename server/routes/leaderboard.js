const express = require('express');
const router = express.Router();

// Mock leaderboard data
let leaderboardData = [
  { id: 1, name: 'Sharma Family', location: 'Delhi', state: 'Delhi', waterCredits: 45800, rechargedLiters: 125000, rank: 1 },
  { id: 2, name: 'Patel Residence', location: 'Ahmedabad', state: 'Gujarat', waterCredits: 42300, rechargedLiters: 115000, rank: 2 },
  { id: 3, name: 'Rao Household', location: 'Hyderabad', state: 'Telangana', waterCredits: 38900, rechargedLiters: 105000, rank: 3 },
  { id: 4, name: 'Kumar Family', location: 'Bangalore', state: 'Karnataka', waterCredits: 35600, rechargedLiters: 98000, rank: 4 },
  { id: 5, name: 'Nair Residence', location: 'Kochi', state: 'Kerala', waterCredits: 32400, rechargedLiters: 89000, rank: 5 },
  { id: 6, name: 'Singh Household', location: 'Chandigarh', state: 'Punjab', waterCredits: 29800, rechargedLiters: 82000, rank: 6 },
  { id: 7, name: 'Reddy Family', location: 'Chennai', state: 'Tamil Nadu', waterCredits: 27500, rechargedLiters: 76000, rank: 7 },
  { id: 8, name: 'Desai Residence', location: 'Pune', state: 'Maharashtra', waterCredits: 25200, rechargedLiters: 70000, rank: 8 },
  { id: 9, name: 'Malik Family', location: 'Jaipur', state: 'Rajasthan', waterCredits: 23100, rechargedLiters: 65000, rank: 9 },
  { id: 10, name: 'Banerjee Household', location: 'Kolkata', state: 'West Bengal', waterCredits: 21000, rechargedLiters: 58000, rank: 10 }
];

// Mock community data
const communityData = {
  totalParticipants: 15247,
  totalRecharged: 4528000000, // liters
  totalWaterCredits: 12500000,
  thisMonthRecharge: 125000000,
  impactMetrics: {
    olympicPools: Math.floor(4528000000 / 2500000),
    householdsSupplied: Math.floor(4528000000 / 135 / 365),
    co2Offset: Math.floor(4528000000 / 1000 * 0.3) // kg
  }
};

// GET /api/leaderboard/global
router.get('/global', (req, res) => {
  const { limit = 10 } = req.query;
  const topUsers = leaderboardData.slice(0, parseInt(limit));
  
  res.json({
    success: true,
    data: {
      leaderboard: topUsers,
      userCount: leaderboardData.length,
      communityStats: communityData
    }
  });
});

// GET /api/leaderboard/state/:state
router.get('/state/:state', (req, res) => {
  const { state } = req.params;
  const stateUsers = leaderboardData
    .filter(u => u.state.toLowerCase() === state.toLowerCase())
    .sort((a, b) => b.waterCredits - a.waterCredits)
    .map((u, idx) => ({ ...u, stateRank: idx + 1 }));
  
  res.json({
    success: true,
    data: {
      state: state,
      leaderboard: stateUsers,
      participants: stateUsers.length,
      totalRecharged: stateUsers.reduce((sum, u) => sum + u.rechargedLiters, 0)
    }
  });
});

// GET /api/leaderboard/user/:id
router.get('/user/:id', (req, res) => {
  const user = leaderboardData.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  
  // Calculate achievements
  const achievements = [];
  if (user.waterCredits > 40000) achievements.push({ name: 'Water Warrior', icon: '🏆' });
  if (user.rechargedLiters > 100000) achievements.push({ name: 'Aquifer Guardian', icon: '💧' });
  if (user.rank <= 10) achievements.push({ name: 'Top Contributor', icon: '🌟' });
  
  res.json({
    success: true,
    data: {
      user,
      achievements,
      impact: {
        householdsHelped: Math.floor(user.rechargedLiters / 135 / 30),
        treesEquivalent: Math.floor(user.rechargedLiters / 10000)
      }
    }
  });
});

// POST /api/leaderboard/submit
router.post('/submit', (req, res) => {
  try {
    const { userId, rechargedLiters, month, year } = req.body;
    
    // Calculate water credits (1 credit per 10 liters)
    const credits = Math.floor(rechargedLiters / 10);
    
    // Update user data
    const userIndex = leaderboardData.findIndex(u => u.id === userId);
    if (userIndex >= 0) {
      leaderboardData[userIndex].waterCredits += credits;
      leaderboardData[userIndex].rechargedLiters += rechargedLiters;
      
      // Re-sort and update ranks
      leaderboardData.sort((a, b) => b.waterCredits - a.waterCredits);
      leaderboardData.forEach((u, idx) => u.rank = idx + 1);
    }
    
    // Update community stats
    communityData.totalRecharged += rechargedLiters;
    communityData.totalWaterCredits += credits;
    communityData.thisMonthRecharge += rechargedLiters;
    
    res.json({
      success: true,
      data: {
        creditsEarned: credits,
        totalCredits: userIndex >= 0 ? leaderboardData[userIndex].waterCredits : credits,
        newRank: userIndex >= 0 ? leaderboardData[userIndex].rank : null,
        message: `Great job! You earned ${credits} water credits this month!`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/leaderboard/impact
router.get('/impact', (req, res) => {
  res.json({
    success: true,
    data: {
      community: communityData,
      milestones: [
        { target: 10000000, current: communityData.totalRecharged, label: '10 Billion Liters' },
        { target: 20000, current: communityData.totalParticipants, label: '20,000 Participants' },
        { target: 5000000, current: communityData.impactMetrics.householdsSupplied, label: '5M Households Supported' }
      ],
      recentActivity: leaderboardData.slice(0, 5).map(u => ({
        user: u.name,
        action: 'Recharged water',
        amount: u.rechargedLiters,
        timestamp: new Date().toISOString()
      }))
    }
  });
});

module.exports = router;
