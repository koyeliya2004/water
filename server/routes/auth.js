const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const { auth, generateToken } = require('../middleware/auth');

const router = express.Router();

// Generate unique referral code
const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, location, referralCode } = req.body;

    // Check if user exists
    let existingUser = null;
    if (email) {
      existingUser = await User.findOne({ email });
    }
    if (!existingUser && phone) {
      existingUser = await User.findOne({ phone });
    }

    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Hash password if provided
    let hashedPassword = '';
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Check referral
    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        referredBy = referrer._id;
        // Give referrer bonus credits
        referrer.credits.total += 100;
        referrer.credits.lifetime += 100;
        referrer.stats.referrals += 1;
        await referrer.save();
      }
    }

    // Create user
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      location: location || {},
      referralCode: generateReferralCode(),
      referredBy,
      credits: {
        total: referralCode ? 150 : 50, // Bonus for using referral
        monthly: referralCode ? 150 : 50,
        allTime: referralCode ? 150 : 50,
        lifetime: referralCode ? 150 : 50,
      },
      tier: 'bronze',
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          credits: user.credits,
          tier: user.tier,
          referralCode: user.referralCode,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // Find user
    let user = null;
    if (email) {
      user = await User.findOne({ email });
    }
    if (!user && phone) {
      user = await User.findOne({ phone });
    }

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check password
    if (password && user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          credits: user.credits,
          tier: user.tier,
          achievements: user.achievements,
          stats: user.stats,
          location: user.location,
          privacy: user.privacy,
          referralCode: user.referralCode,
          streaks: user.streaks,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/auth/me - Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        credits: user.credits,
        tier: user.tier,
        achievements: user.achievements,
        stats: user.stats,
        location: user.location,
        privacy: user.privacy,
        referralCode: user.referralCode,
        streaks: user.streaks,
        challenges: user.challenges,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/auth/profile - Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['name', 'avatar', 'location', 'privacy', 'notificationSettings'];
    
    const user = req.user;
    
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        if (field === 'location' || field === 'privacy' || field === 'notificationSettings') {
          user[field] = { ...user[field].toObject(), ...updates[field] };
        } else {
          user[field] = updates[field];
        }
      }
    });

    await user.save();

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        location: user.location,
        privacy: user.privacy,
        notificationSettings: user.notificationSettings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/referral/validate - Validate referral code
router.post('/referral/validate', async (req, res) => {
  try {
    const { code } = req.body;
    
    const user = await User.findOne({ referralCode: code.toUpperCase() });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'Invalid referral code' });
    }

    res.json({
      success: true,
      data: {
        valid: true,
        referrerName: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
