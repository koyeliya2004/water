const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'jaldhar-secret-key-2024';
const JWT_VENDOR_SECRET = process.env.JWT_VENDOR_SECRET || 'vendor-secret-key-change-in-production';

// Middleware to verify JWT token (user)
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // For development, create a mock user
      req.user = {
        id: 'mock-user-id',
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

    // Check if it's a vendor token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_VENDOR_SECRET);
      if (decoded.role === 'vendor') {
        req.vendor = { id: decoded.id };
        return next();
      }
    } catch (vendorErr) {
      // Not a vendor token, try user token
    }

    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      // Invalid token, use mock user
      req.user = {
        id: 'mock-user-id',
        _id: 'mock-user-id',
        name: 'Demo User',
        email: 'demo@jaldhar.app',
      };
      return next();
    }
    
    const user = await User.findById(decoded.userId || decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }
    
    req.user = {
      id: user._id,
      ...user.toObject()
    };
    next();
  } catch (error) {
    // For development, allow mock user
    req.user = {
      id: 'mock-user-id',
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

// Middleware to verify vendor JWT token
const vendorAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT_VENDOR_SECRET);
    
    if (decoded.role !== 'vendor') {
      return res.status(401).json({ success: false, error: 'Vendor authentication required' });
    }
    
    req.vendor = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// Optional auth - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      // Try user token
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId || decoded.id).select('-password');
        if (user) {
          req.user = { id: user._id, ...user.toObject() };
        }
      } catch {
        // Try vendor token
        try {
          const decoded = jwt.verify(token, JWT_VENDOR_SECRET);
          if (decoded.role === 'vendor') {
            req.vendor = { id: decoded.id };
          }
        } catch {
          // Invalid token
        }
      }
    }
    next();
  } catch (error) {
    next();
  }
};

// Generate JWT token for user
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
};

// Generate JWT token for vendor
const generateVendorToken = (vendorId) => {
  return jwt.sign({ id: vendorId, role: 'vendor' }, JWT_VENDOR_SECRET, { expiresIn: '7d' });
};

module.exports = { 
  auth, 
  vendorAuth,
  optionalAuth, 
  generateToken, 
  generateVendorToken,
  JWT_SECRET,
  JWT_VENDOR_SECRET 
};
