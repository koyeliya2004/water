const express = require('express');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Mock friend suggestions
const mockSuggestions = [
  { id: '1', name: 'Amit Sharma', mutualFriends: 5, location: 'Mumbai, Maharashtra' },
  { id: '2', name: 'Priya Patel', mutualFriends: 3, location: 'Bangalore, Karnataka' },
  { id: '3', name: 'Raj Kumar', mutualFriends: 8, location: 'Chennai, Tamil Nadu' },
  { id: '4', name: 'Sunita Reddy', mutualFriends: 2, location: 'Hyderabad, Telangana' },
  { id: '5', name: 'Vikram Singh', mutualFriends: 4, location: 'Delhi' },
];

// GET /api/social/friends - Get user's friends
router.get('/friends', auth, async (req, res) => {
  try {
    // In real implementation, would query User model
    // For now, return mock data
    const friends = [
      { id: '1', name: 'Rajesh Kumar', tier: 'gold', litersRecharged: 150000, status: 'active' },
      { id: '2', name: 'Priya Sharma', tier: 'silver', litersRecharged: 85000, status: 'active' },
      { id: '3', name: 'Amit Patel', tier: 'bronze', litersRecharged: 45000, status: 'inactive' },
    ];

    res.json({
      success: true,
      data: friends,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/social/suggestions - Get friend suggestions
router.get('/suggestions', auth, async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const suggestions = mockSuggestions.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/social/friends/request - Send friend request
router.post('/friends/request', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const user = req.user;

    // In real implementation, would create friend request
    // For now, simulate success
    
    res.json({
      success: true,
      data: {
        message: 'Friend request sent',
        userId,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/social/friends/accept - Accept friend request
router.post('/friends/accept', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    
    res.json({
      success: true,
      data: {
        message: 'Friend request accepted',
        userId,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/social/friends/:id - Remove friend
router.delete('/friends/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    res.json({
      success: true,
      data: {
        message: 'Friend removed',
        friendId: id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/social/activity - Get friends activity feed
router.get('/activity', auth, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    // Mock activity feed
    const activities = [
      { id: '1', user: 'Rajesh K.', action: 'recharged', amount: '5,000L', time: '2 hours ago', avatar: '' },
      { id: '2', user: 'Priya S.', action: 'completed', target: 'assessment', time: '5 hours ago', avatar: '' },
      { id: '3', user: 'Amit P.', action: 'unlocked', target: 'Water Guardian badge', time: '1 day ago', avatar: '' },
      { id: '4', user: 'Sunita R.', action: 'joined', target: 'Community', time: '2 days ago', avatar: '' },
      { id: '5', user: 'Vikram S.', action: 'earned', amount: '250 credits', time: '3 days ago', avatar: '' },
    ];

    res.json({
      success: true,
      data: activities.slice(0, parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/social/share - Share to social media
router.post('/share', auth, async (req, res) => {
  try {
    const { platform, content } = req.body;
    const user = req.user;

    // In real implementation, would integrate with social APIs
    // For now, simulate and log
    
    // Log activity
    await Activity.create({
      user: user._id,
      type: 'share_posted',
      data: { platform, content },
    });

    // Award bonus credits for sharing
    const shareBonus = 25;
    user.credits.total += shareBonus;
    user.credits.lifetime += shareBonus;
    user.credits.monthly += shareBonus;
    await user.save();

    res.json({
      success: true,
      data: {
        message: 'Successfully shared',
        platform,
        creditsEarned: shareBonus,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/social/referral/link - Get referral link
router.get('/referral/link', auth, async (req, res) => {
  try {
    const user = req.user;
    
    const referralLink = `https://jaldhar.app/ref/${user.referralCode}`;

    res.json({
      success: true,
      data: {
        link: referralLink,
        code: user.referralCode,
        totalReferrals: user.stats.referrals || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/social/invite - Send invitation
router.post('/invite', auth, async (req, res) => {
  try {
    const { emails, phoneNumbers, message } = req.body;
    const user = req.user;

    // In real implementation, would send emails/SMS
    // For now, simulate
    
    res.json({
      success: true,
      data: {
        message: 'Invitations sent',
        count: (emails?.length || 0) + (phoneNumbers?.length || 0),
        referralLink: `https://jaldhar.app/ref/${user.referralCode}`,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/social/leaderboard/friends - Get friends leaderboard
router.get('/leaderboard/friends', auth, async (req, res) => {
  try {
    // Mock friends leaderboard
    const leaderboard = [
      { rank: 1, name: 'Rajesh Kumar', litersRecharged: 150000, credits: 15000, avatar: '' },
      { rank: 2, name: 'Priya Sharma', litersRecharged: 85000, credits: 8500, avatar: '' },
      { rank: 3, name: 'You', litersRecharged: 45000, credits: 4500, avatar: '', isCurrentUser: true },
      { rank: 4, name: 'Amit Patel', litersRecharged: 32000, credits: 3200, avatar: '' },
      { rank: 5, name: 'Sunita Reddy', litersRecharged: 28000, credits: 2800, avatar: '' },
    ];

    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
