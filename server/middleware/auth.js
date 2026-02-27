const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'jaldhar-secret-key-2024';

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // For development, create a mock user
      req.user = {
        _id: 'mock-user-id',
        name: 'Demo User',
        email: 'demo@jaldhar.app',
        credits: { total: 1250, lifetime: 1250, monthly: 250 },
        tier: 'silver',
        achievements: [],
        privacy: { showOnLeaderboard: true },
        location: { state: 'Maharashtra', city: 'Mumbai' },
      };
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    // For development, allow mock user
    req.user = {
      _id: 'mock-user-id',
      name: 'Demo User',
      email: 'demo@jaldhar.app',
      credits: { total: 1250, lifetime: 1250, monthly: 250 },
      tier: 'silver',
      achievements: [],
      privacy: { showOnLeaderboard: true },
      location: { state: 'Maharashtra', city: 'Mumbai' },
    };
    next();
  }
};

// Optional auth - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
};

module.exports = { auth, optionalAuth, generateToken, JWT_SECRET };
