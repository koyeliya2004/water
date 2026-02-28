const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Vendor = require('../models/Vendor');
const Review = require('../models/Review');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'vendor-secret-key-change-in-production';

// POST /api/vendor/register
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      location,
      services,
      certifications,
      workingAreas,
      businessHours,
      priceRange,
      specialties,
      teamSize,
    } = req.body;

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ 
      $or: [{ email }, { phone }] 
    });
    
    if (existingVendor) {
      return res.status(400).json({
        success: false,
        error: 'Vendor with this email or phone already exists'
      });
    }

    const vendor = new Vendor({
      name,
      email,
      phone,
      password,
      location,
      services: services || [],
      certifications: certifications || [],
      workingAreas: workingAreas || [{ city: location.city, state: location.state, radius: 50 }],
      businessHours: businessHours || {},
      priceRange: priceRange || 'Medium',
      specialties: specialties || [],
      teamSize: teamSize || 1,
    });

    await vendor.save();

    const token = jwt.sign(
      { id: vendor._id, role: 'vendor' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        vendor: {
          id: vendor._id,
          name: vendor.name,
          email: vendor.email,
          location: vendor.location,
          services: vendor.services,
          verified: vendor.verified,
          rating: vendor.rating,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/vendor/login
router.post('/login', async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    const vendor = await Vendor.findOne({
      $or: [{ email }, { phone }],
    });

    if (!vendor) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    if (vendor.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { id: vendor._id, role: 'vendor' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        vendor: {
          id: vendor._id,
          name: vendor.name,
          email: vendor.email,
          location: vendor.location,
          services: vendor.services,
          verified: vendor.verified,
          rating: vendor.rating,
          completedProjects: vendor.completedProjects,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/vendor/me
router.get('/me', auth, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/vendor/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = [
      'name', 'phone', 'location', 'services', 'certifications',
      'workingAreas', 'businessHours', 'priceRange', 'specialties',
      'teamSize', 'warranty', 'insurance', 'equipment'
    ];

    const vendor = await Vendor.findById(req.vendor.id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        vendor[field] = updates[field];
      }
    });

    await vendor.save();

    res.json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/vendor/dashboard
router.get('/dashboard', auth, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    // Get recent reviews
    const recentReviews = await Review.find({ vendorId: vendor._id })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        profile: vendor,
        stats: {
          totalProjects: vendor.completedProjects,
          rating: vendor.rating,
          reviewCount: vendor.reviewCount,
          quotesSent: vendor.stats.quotesSent,
          quotesAccepted: vendor.stats.quotesAccepted,
          totalEarnings: vendor.stats.totalEarnings,
          responseTime: vendor.stats.responseTime,
        },
        recentReviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/vendor/portfolio
router.put('/portfolio', auth, async (req, res) => {
  try {
    const { portfolio } = req.body;
    const vendor = await Vendor.findById(req.vendor.id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    vendor.portfolio = portfolio;
    await vendor.save();

    res.json({
      success: true,
      data: vendor.portfolio,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/vendor/documents
router.post('/documents', auth, async (req, res) => {
  try {
    const { documents } = req.body;
    const vendor = await Vendor.findById(req.vendor.id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    if (documents.gstCertificate) vendor.documents.gstCertificate = documents.gstCertificate;
    if (documents.idProof) vendor.documents.idProof = documents.idProof;
    if (documents.addressProof) vendor.documents.addressProof = documents.addressProof;
    if (documents.workSamples) vendor.documents.workSamples = documents.workSamples;

    await vendor.save();

    res.json({
      success: true,
      data: { message: 'Documents uploaded successfully' },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/vendor/reviews
router.get('/reviews', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, rating } = req.query;
    
    const query = { vendorId: req.vendor.id };
    if (rating) query.rating = rating;

    const reviews = await Review.find(query)
      .populate('userId', 'name avatar location')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(query);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/vendor/stats
router.put('/stats', auth, async (req, res) => {
  try {
    const { quotesSent, responseTime } = req.body;
    const vendor = await Vendor.findById(req.vendor.id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    if (quotesSent) vendor.stats.quotesSent += 1;
    if (responseTime) vendor.stats.responseTime = responseTime;

    await vendor.save();

    res.json({
      success: true,
      data: vendor.stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
