const express = require('express');
const Community = require('../models/Community');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Mock communities data
const mockCommunities = [
  {
    id: '1',
    name: 'Mumbai Green Initiative',
    description: 'Mumbai residents working together for water conservation',
    location: { state: 'Maharashtra', city: 'Mumbai', locality: 'Andheri' },
    memberCount: 1250,
    totalRecharged: 5000000,
    image: '',
  },
  {
    id: '2',
    name: 'Bangalore Water Warriors',
    description: 'Creating sustainable water solutions for Bangalore',
    location: { state: 'Karnataka', city: 'Bangalore', locality: 'Whitefield' },
    memberCount: 980,
    totalRecharged: 4200000,
    image: '',
  },
  {
    id: '3',
    name: 'Chennai Rain Harvesters',
    description: 'Chennai community embracing rainwater harvesting',
    location: { state: 'Tamil Nadu', city: 'Chennai', locality: 'Adyar' },
    memberCount: 750,
    totalRecharged: 3100000,
    image: '',
  },
  {
    id: '4',
    name: 'Delhi Water Keepers',
    description: 'Delhi NCR residents fighting water crisis together',
    location: { state: 'Delhi', city: 'Delhi', locality: 'Dwarka' },
    memberCount: 1100,
    totalRecharged: 4500000,
    image: '',
  },
  {
    id: '5',
    name: 'Hyderabad Harvesters',
    description: 'Hyderabad community for sustainable water management',
    location: { state: 'Telangana', city: 'Hyderabad', locality: 'Gachibowli' },
    memberCount: 620,
    totalRecharged: 2800000,
    image: '',
  },
];

// GET /api/community - Get all communities
router.get('/', async (req, res) => {
  try {
    const { state, city, locality, search, sortBy } = req.query;
    
    let communities = [...mockCommunities];
    
    if (state) {
      communities = communities.filter(c => 
        c.location.state.toLowerCase() === state.toLowerCase()
      );
    }
    
    if (city) {
      communities = communities.filter(c => 
        c.location.city.toLowerCase() === city.toLowerCase()
      );
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      communities = communities.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (sortBy === 'members') {
      communities.sort((a, b) => b.memberCount - a.memberCount);
    } else if (sortBy === 'recharged') {
      communities.sort((a, b) => b.totalRecharged - a.totalRecharged);
    }

    res.json({
      success: true,
      data: communities,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/community/featured - Get featured communities
router.get('/featured', async (req, res) => {
  try {
    const featured = mockCommunities.slice(0, 3);
    res.json({
      success: true,
      data: featured,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/community/nearby - Get nearby communities
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 50 } = req.query;
    
    // In real implementation, would use geospatial queries
    // For now, return mock data based on state
    res.json({
      success: true,
      data: mockCommunities.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/community/:id - Get community details
router.get('/:id', async (req, res) => {
  try {
    const community = mockCommunities.find(c => c.id === req.params.id);
    
    if (!community) {
      return res.status(404).json({ success: false, error: 'Community not found' });
    }

    // Mock leaderboard for community
    const leaderboard = [
      { rank: 1, name: 'Rajesh Kumar', rechargedLiters: 150000, credits: 15000 },
      { rank: 2, name: 'Priya Sharma', rechargedLiters: 125000, credits: 12500 },
      { rank: 3, name: 'Amit Patel', rechargedLiters: 98000, credits: 9800 },
      { rank: 4, name: 'Sunita Reddy', rechargedLiters: 82000, credits: 8200 },
      { rank: 5, name: 'Vikram Singh', rechargedLiters: 75000, credits: 7500 },
    ];

    // Mock recent activity
    const recentActivity = [
      { user: 'Rajesh K.', action: 'Harvested 2,500L', time: '2 hours ago' },
      { user: 'Priya S.', action: 'Completed assessment', time: '5 hours ago' },
      { user: 'Amit P.', action: 'Earned 250 credits', time: '1 day ago' },
      { user: 'Sunita R.', action: 'Joined community', time: '2 days ago' },
    ];

    res.json({
      success: true,
      data: {
        ...community,
        leaderboard,
        recentActivity,
        stats: {
          totalMembers: community.memberCount,
          activeThisMonth: Math.floor(community.memberCount * 0.6),
          avgRechargedPerMember: Math.floor(community.totalRecharged / community.memberCount),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/community - Create a new community
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, location, image, isPublic } = req.body;
    
    const user = req.user;
    
    const community = new Community({
      name,
      description,
      location,
      image,
      admin: user._id,
      members: [{
        user: user._id,
        role: 'admin',
        joinedAt: new Date(),
      }],
      settings: {
        isPublic: isPublic !== false,
        allowJoinRequests: true,
        showOnLeaderboard: true,
      },
    });

    await community.save();

    // Update user's community
    user.social.communityId = community._id;
    await user.save();

    // Log activity
    await Activity.create({
      user: user._id,
      type: 'community_created',
      data: { communityId: community._id },
      community: community._id,
    });

    res.status(201).json({
      success: true,
      data: community,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/community/:id/join - Join a community
router.post('/:id/join', auth, async (req, res) => {
  try {
    const user = req.user;
    const communityId = req.params.id;
    
    const community = await Community.findById(communityId);
    
    if (!community) {
      // Use mock data
      const mockCommunity = mockCommunities.find(c => c.id === communityId);
      if (!mockCommunity) {
        return res.status(404).json({ success: false, error: 'Community not found' });
      }
      
      // Update user
      user.social.communityId = communityId;
      await user.save();
      
      // Log activity
      await Activity.create({
        user: user._id,
        type: 'community_joined',
        data: { communityId },
      });
      
      return res.json({
        success: true,
        data: {
          message: 'Successfully joined community',
          community: mockCommunity,
        },
      });
    }

    await community.addMember(user._id);
    
    // Update user's community
    user.social.communityId = community._id;
    await user.save();

    // Log activity
    await Activity.create({
      user: user._id,
      type: 'community_joined',
      data: { communityId: community._id },
      community: community._id,
    });

    res.json({
      success: true,
      data: {
        message: 'Successfully joined community',
        community: {
          id: community._id,
          name: community.name,
        },
      },
    });
  } catch (error) {
    if (error.message === 'User is already a member') {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/community/:id/leave - Leave a community
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const user = req.user;
    const communityId = req.params.id;
    
    const community = await Community.findById(communityId);
    
    if (!community) {
      // Update user anyway for mock data
      user.social.communityId = null;
      await user.save();
      
      return res.json({
        success: true,
        data: { message: 'Left community' },
      });
    }

    // Remove member
    community.members = community.members.filter(
      m => m.user.toString() !== user._id.toString()
    );
    await community.save();

    // Update user
    user.social.communityId = null;
    await user.save();

    res.json({
      success: true,
      data: { message: 'Successfully left community' },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/community/user/my - Get user's community
router.get('/user/my', auth, async (req, res) => {
  try {
    const user = req.user;
    
    if (!user.social.communityId) {
      return res.json({
        success: true,
        data: null,
      });
    }

    // Try to find in database first
    let community = await Community.findById(user.social.communityId);
    
    if (!community) {
      // Use mock data
      community = mockCommunities.find(c => c.id === user.social.communityId);
    }

    res.json({
      success: true,
      data: community,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
