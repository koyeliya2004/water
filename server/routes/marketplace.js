const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const Review = require('../models/Review');
const QuoteRequest = require('../models/QuoteRequest');
const authMiddleware = require('../middleware/auth');

// Mock vendor database (fallback)
const mockVendors = [
  {
    id: 'v1',
    name: 'AquaHarvest Solutions',
    location: 'Delhi NCR',
    services: ['RTRWH Installation', 'Recharge Pit Construction', 'Maintenance'],
    rating: 4.8,
    completedProjects: 245,
    contact: { phone: '+91-98765-43210', email: 'info@aquaharvest.in' },
    verified: true,
    priceRange: 'Medium'
  },
  {
    id: 'v2',
    name: 'RainTech India',
    location: 'Mumbai',
    services: ['Complete RWH Systems', 'Consulting', 'Filter Systems'],
    rating: 4.6,
    completedProjects: 189,
    contact: { phone: '+91-98765-43211', email: 'contact@raintech.in' },
    verified: true,
    priceRange: 'Premium'
  },
  {
    id: 'v3',
    name: 'JalSanchay Services',
    location: 'Bangalore',
    services: ['Residential RWH', 'Commercial Systems', 'Recharge Wells'],
    rating: 4.9,
    completedProjects: 312,
    contact: { phone: '+91-98765-43212', email: 'hello@jalsanchay.com' },
    verified: true,
    priceRange: 'Medium'
  },
  {
    id: 'v4',
    name: 'WaterWise Systems',
    location: 'Chennai',
    services: ['RWH Installation', 'Tank Cleaning', 'Filter Maintenance'],
    rating: 4.5,
    completedProjects: 156,
    contact: { phone: '+91-98765-43213', email: 'support@waterwise.in' },
    verified: true,
    priceRange: 'Budget'
  },
  {
    id: 'v5',
    name: 'EcoRain Solutions',
    location: 'Hyderabad',
    services: ['Modular RWH', 'Smart Monitoring', 'Recharge Structures'],
    rating: 4.7,
    completedProjects: 203,
    contact: { phone: '+91-98765-43214', email: 'info@ecorain.in' },
    verified: true,
    priceRange: 'Premium'
  },
  {
    id: 'v6',
    name: 'Bharat Jal Systems',
    location: 'Pune',
    services: ['Government Projects', 'Community RWH', 'Large Scale Systems'],
    rating: 4.4,
    completedProjects: 89,
    contact: { phone: '+91-98765-43215', email: 'projects@bharatjal.in' },
    verified: true,
    priceRange: 'Medium'
  }
];

// Products catalog
const products = [
  { id: 'p1', name: 'Rain Water Filter (Basic)', price: 3500, unit: 'piece', category: 'Filters' },
  { id: 'p2', name: 'Rain Water Filter (Advanced)', price: 8500, unit: 'piece', category: 'Filters' },
  { id: 'p3', name: 'Storage Tank (1000L)', price: 4500, unit: 'piece', category: 'Tanks' },
  { id: 'p4', name: 'Storage Tank (2000L)', price: 8000, unit: 'piece', category: 'Tanks' },
  { id: 'p5', name: 'Storage Tank (5000L)', price: 18000, unit: 'piece', category: 'Tanks' },
  { id: 'p6', name: 'PVC Pipes (3 inch, per meter)', price: 180, unit: 'meter', category: 'Pipes' },
  { id: 'p7', name: 'Gutter System (per meter)', price: 250, unit: 'meter', category: 'Gutters' },
  { id: 'p8', name: 'First Flush Diverter', price: 2200, unit: 'piece', category: 'Diverters' },
  { id: 'p9', name: 'Smart Water Level Monitor', price: 4500, unit: 'piece', category: 'IoT' },
  { id: 'p10', name: 'Submersible Pump (0.5HP)', price: 6500, unit: 'piece', category: 'Pumps' }
];

// Helper to convert Vendor mongoose doc to plain object
const vendorToObj = (vendor) => ({
  id: vendor._id,
  _id: vendor._id,
  name: vendor.name,
  location: vendor.location,
  services: vendor.services,
  rating: vendor.rating,
  reviewCount: vendor.reviewCount,
  completedProjects: vendor.completedProjects,
  contact: { phone: vendor.phone, email: vendor.email },
  verified: vendor.verified,
  priceRange: vendor.priceRange,
  portfolio: vendor.portfolio,
  certifications: vendor.certifications,
  specialties: vendor.specialties,
  experience: vendor.experience,
});

// GET /api/marketplace/vendors
router.get('/vendors', async (req, res) => {
  const { location, service, verified, rating, priceRange, sort, page = 1, limit = 20 } = req.query;

  try {
    // Try to get vendors from database
    let vendors;
    try {
      const query = {};
      
      if (location) {
        query.$or = [
          { 'location.city': { $regex: location, $options: 'i' } },
          { 'location.state': { $regex: location, $options: 'i' } },
        ];
      }
      
      if (service) {
        query.services = { $in: [new RegExp(service, 'i')] };
      }
      
      if (verified === 'true') {
        query.verified = true;
      }
      
      if (priceRange) {
        query.priceRange = priceRange;
      }
      
      if (rating) {
        query.rating = { $gte: parseFloat(rating) };
      }

      let sortObj = { rating: -1 };
      if (sort === 'projects') sortObj = { completedProjects: -1 };
      if (sort === 'newest') sortObj = { createdAt: -1 };

      vendors = await Vendor.find(query)
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      if (vendors.length > 0) {
        return res.json({
          success: true,
          data: vendors.map(vendorToObj),
          count: vendors.length,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
          },
        });
      }
    } catch (dbError) {
      console.log('Using mock vendors:', dbError.message);
    }

    // Fallback to mock vendors
    let filtered = [...mockVendors];
    
    if (location) {
      filtered = filtered.filter(v => 
        v.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (service) {
      filtered = filtered.filter(v => 
        v.services.some(s => s.toLowerCase().includes(service.toLowerCase()))
      );
    }
    
    if (verified === 'true') {
      filtered = filtered.filter(v => v.verified);
    }

    if (rating) {
      filtered = filtered.filter(v => v.rating >= parseFloat(rating));
    }

    if (priceRange) {
      filtered = filtered.filter(v => v.priceRange === priceRange);
    }

    if (sort === 'projects') {
      filtered.sort((a, b) => b.completedProjects - a.completedProjects);
    }

    res.json({
      success: true,
      data: filtered,
      count: filtered.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/marketplace/vendors/:id
router.get('/vendors/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (vendor) {
      const reviews = await Review.find({ vendorId: vendor._id, status: 'approved' })
        .populate('userId', 'name avatar')
        .sort({ createdAt: -1 })
        .limit(10);

      return res.json({
        success: true,
        data: {
          ...vendorToObj(vendor),
          reviews: reviews.map(r => ({
            _id: r._id,
            rating: r.rating,
            title: r.title,
            comment: r.comment,
            userId: r.userId,
            createdAt: r.createdAt,
          })),
        },
      });
    }
  } catch (dbError) {
    console.log('Trying mock vendor');
  }

  const vendor = mockVendors.find(v => v.id === req.params.id);
  if (!vendor) {
    return res.status(404).json({ success: false, error: 'Vendor not found' });
  }

  res.json({
    success: true,
    data: vendor
  });
});

// GET /api/marketplace/vendors/compare
router.get('/vendors/compare', async (req, res) => {
  try {
    const { ids } = req.query;
    
    if (!ids) {
      return res.status(400).json({
        success: false,
        error: 'Vendor IDs required'
      });
    }

    const vendorIds = ids.split(',');
    const vendors = [];

    for (const id of vendorIds) {
      try {
        const vendor = await Vendor.findById(id.trim());
        if (vendor) {
          vendors.push(vendorToObj(vendor));
        }
      } catch {
        const mockVendor = mockVendors.find(v => v.id === id.trim());
        if (mockVendor) {
          vendors.push(mockVendor);
        }
      }
    }

    // Create comparison object
    const comparison = {
      vendors,
      comparison: vendors.map(v => ({
        id: v.id,
        name: v.name,
        rating: v.rating,
        completedProjects: v.completedProjects,
        priceRange: v.priceRange,
        verified: v.verified,
        services: v.services,
        location: v.location,
      })),
    };

    res.json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/marketplace/vendors/:id/reviews
router.post('/vendors/:id/reviews', authMiddleware.auth, async (req, res) => {
  try {
    const { rating, title, comment, aspects, project } = req.body;

    const vendorId = req.params.id;
    
    // Find vendor (mock or real)
    let vendor;
    try {
      vendor = await Vendor.findById(vendorId);
    } catch {
      vendor = mockVendors.find(v => v.id === vendorId);
    }

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    // Create review in DB if vendor exists
    if (vendor._id) {
      const review = new Review({
        vendorId: vendor._id,
        userId: req.user.id,
        rating,
        title,
        comment,
        aspects,
        project,
        status: 'approved', // Auto-approve for now
      });

      await review.save();
      
      // Update vendor rating
      const avgRating = await Review.getAverageRating(vendor._id);
      await Vendor.findByIdAndUpdate(vendor._id, {
        rating: avgRating.averageRating,
        reviewCount: avgRating.count,
      });

      res.status(201).json({
        success: true,
        data: review,
      });
    } else {
      res.status(201).json({
        success: true,
        data: {
          message: 'Review submitted (mock vendor)',
          rating,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/marketplace/products
router.get('/products', (req, res) => {
  const { category } = req.query;
  
  let filtered = [...products];
  
  if (category) {
    filtered = filtered.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  res.json({
    success: true,
    data: filtered,
    categories: [...new Set(products.map(p => p.category))]
  });
});

// POST /api/marketplace/estimate
router.post('/estimate', (req, res) => {
  try {
    const { roofArea, storageRequired, structureType } = req.body;
    
    const estimate = {
      materials: [],
      labor: 0,
      total: 0
    };
    
    // Calculate material requirements
    if (structureType === 'storage' || structureType === 'combined') {
      const tankCapacity = Math.ceil(storageRequired / 1000) * 1000;
      const tankProduct = products.find(p => 
        p.category === 'Tanks' && p.name.includes(tankCapacity.toString())
      ) || products.find(p => p.name.includes('5000L'));
      
      const tanksNeeded = Math.ceil(storageRequired / tankCapacity);
      estimate.materials.push({
        product: tankProduct,
        quantity: tanksNeeded,
        cost: tankProduct.price * tanksNeeded
      });
      
      // Pipes (estimated based on roof perimeter)
      const perimeter = Math.sqrt(roofArea) * 4;
      const pipeProduct = products.find(p => p.name.includes('PVC Pipes'));
      estimate.materials.push({
        product: pipeProduct,
        quantity: Math.ceil(perimeter),
        cost: pipeProduct.price * Math.ceil(perimeter)
      });
      
      // Filter
      const filterProduct = products.find(p => p.name.includes('Advanced'));
      estimate.materials.push({
        product: filterProduct,
        quantity: 1,
        cost: filterProduct.price
      });
      
      // Gutter
      const gutterProduct = products.find(p => p.category === 'Gutters');
      estimate.materials.push({
        product: gutterProduct,
        quantity: Math.ceil(perimeter),
        cost: gutterProduct.price * Math.ceil(perimeter)
      });
    }
    
    // Labor cost (roughly 30% of material cost)
    const materialCost = estimate.materials.reduce((sum, m) => sum + m.cost, 0);
    estimate.labor = Math.round(materialCost * 0.3);
    estimate.total = materialCost + estimate.labor;
    
    res.json({
      success: true,
      data: estimate
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/marketplace/quote-request (authenticated)
router.post('/quote-request', authMiddleware.auth, async (req, res) => {
  try {
    const { vendorId, requirements, assessmentData } = req.body;

    // Find vendor
    let vendor;
    try {
      vendor = await Vendor.findById(vendorId);
    } catch {
      vendor = mockVendors.find(v => v.id === vendorId);
    }

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    // Create quote request
    const quoteRequest = new QuoteRequest({
      userId: req.user.id,
      vendorId: vendor._id || vendorId,
      requirements,
      assessmentData,
      status: 'pending',
    });

    await quoteRequest.save();

    // Update vendor stats
    if (vendor._id) {
      await Vendor.findByIdAndUpdate(vendor._id, {
        $inc: { 'stats.quotesSent': 1 },
      });
    }

    res.status(201).json({
      success: true,
      data: {
        requestId: quoteRequest._id,
        vendorId: vendorId,
        status: 'Submitted',
        estimatedResponse: '24-48 hours',
        message: 'Quote request submitted successfully. The vendor will contact you soon.'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/marketplace/request-quote (unauthenticated fallback)
router.post('/request-quote', (req, res) => {
  try {
    const { vendorId, requirements, contactInfo } = req.body;
    
    res.json({
      success: true,
      data: {
        requestId: `REQ-${Date.now()}`,
        vendorId,
        status: 'Submitted',
        estimatedResponse: '24-48 hours',
        message: 'Quote request submitted successfully. The vendor will contact you soon.'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/marketplace/quote-requests
router.get('/quote-requests', authMiddleware.auth, async (req, res) => {
  try {
    const { status } = req.query;
    
    const quoteRequests = await QuoteRequest.getUserQuotes(req.user.id, status);

    res.json({
      success: true,
      data: quoteRequests,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/marketplace/services
router.get('/services', (req, res) => {
  const services = [
    'RTRWH Installation',
    'Recharge Pit Construction',
    'Maintenance',
    'Consulting',
    'Filter Systems',
    'Tank Cleaning',
    'Government Projects',
    'Community RWH',
    'Smart Monitoring',
    'Commercial Systems',
    'Residential RWH',
    'Recharge Wells',
  ];

  res.json({
    success: true,
    data: services,
  });
});

module.exports = router;
