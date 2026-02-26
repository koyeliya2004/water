const express = require('express');
const router = express.Router();

// Mock vendor database
const vendors = [
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

// GET /api/marketplace/vendors
router.get('/vendors', (req, res) => {
  const { location, service, verified } = req.query;
  
  let filtered = [...vendors];
  
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
  
  res.json({
    success: true,
    data: filtered,
    count: filtered.length
  });
});

// GET /api/marketplace/vendors/:id
router.get('/vendors/:id', (req, res) => {
  const vendor = vendors.find(v => v.id === req.params.id);
  if (!vendor) {
    return res.status(404).json({ success: false, error: 'Vendor not found' });
  }
  
  res.json({
    success: true,
    data: vendor
  });
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

// POST /api/marketplace/request-quote
router.post('/request-quote', (req, res) => {
  try {
    const { vendorId, requirements, contactInfo } = req.body;
    
    // In production, this would send an email/SMS to the vendor
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

module.exports = router;
