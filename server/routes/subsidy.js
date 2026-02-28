const express = require('express');
const router = express.Router();
const GovernmentScheme = require('../models/GovernmentScheme');
const SubsidyApplication = require('../models/SubsidyApplication');
const auth = require('../middleware/auth');

// Seed initial government schemes
const seedGovernmentSchemes = async () => {
  const schemes = [
    {
      name: 'Mukhyamantri Jal Swavalamban Yojana',
      type: 'state',
      department: 'Delhi Jal Board',
      state: 'Delhi',
      subsidyType: 'percentage',
      amount: { percentage: 50, max: 50000, description: 'Up to ₹50,000 or 50% of cost' },
      eligibilityCriteria: [
        { propertyType: ['residential'], otherConditions: ['All residential properties'] },
      ],
      documents: [
        { name: 'Property ID', required: true },
        { name: 'Aadhaar Card', required: true },
        { name: 'Estimate from vendor', required: true },
      ],
      deadline: 'ongoing',
      website: 'https://www.delhijalboard.nic.in',
      category: ['residential'],
      keywords: ['delhi', 'residential', 'j борд'],
      benefits: ['50% cost reimbursement', 'Water bill rebate'],
      status: 'active',
    },
    {
      name: 'Rainwater Harvesting Rebate',
      type: 'municipal',
      department: 'MCD/DJB',
      state: 'Delhi',
      subsidyType: 'rebate',
      amount: { percentage: 10, description: '10% rebate on water bills' },
      eligibilityCriteria: [
        { propertyType: ['residential', 'commercial'], otherConditions: ['Properties with functional RWH'] },
      ],
      documents: [
        { name: 'Installation certificate', required: true },
        { name: 'Photographs', required: true },
        { name: 'Bill receipts', required: true },
      ],
      deadline: 'annual',
      website: 'https://mcdonline.nic.in',
      category: ['residential', 'commercial'],
      keywords: ['rebate', 'water bill'],
      status: 'active',
    },
    {
      name: 'Mandatory RWH - Chennai',
      type: 'state',
      department: 'Chennai Metropolitan Water Supply',
      state: 'Tamil Nadu',
      subsidyType: 'fixed',
      amount: { fixed: 10000, description: '₹10,000 for households' },
      eligibilityCriteria: [
        { propertyType: ['residential'], otherConditions: ['All buildings in Chennai'] },
      ],
      documents: [
        { name: 'Building plan', required: true },
        { name: 'RWH design', required: true },
        { name: 'Completion certificate', required: true },
      ],
      deadline: 'specific-date',
      website: 'https://www.chennaimetrowater.tn.gov.in',
      category: ['residential'],
      keywords: ['chennai', 'mandatory', 'households'],
      status: 'active',
    },
    {
      name: 'Rainwater Harvesting Incentive',
      type: 'state',
      department: 'TWAD Board',
      state: 'Tamil Nadu',
      subsidyType: 'percentage',
      amount: { percentage: 50, max: 25000, description: '50% subsidy up to ₹25,000' },
      eligibilityCriteria: [
        { propertyType: ['residential'], incomeGroup: ['BPL', 'APL'], otherConditions: ['Rural households'] },
      ],
      documents: [
        { name: 'Ration card', required: true },
        { name: 'Land records', required: true },
        { name: 'Bank account details', required: true },
      ],
      deadline: 'specific-date',
      specificDate: new Date('2025-03-31'),
      website: 'https://www.twadboard.gov.in',
      category: ['residential'],
      keywords: ['rural', 'subsidy', 'incentive'],
      status: 'active',
    },
    {
      name: 'Sujala-III',
      type: 'state',
      department: 'Watershed Development Department',
      state: 'Karnataka',
      subsidyType: 'percentage',
      amount: { percentage: 75, description: '75% subsidy for farmers' },
      eligibilityCriteria: [
        { propertyType: ['agricultural'], otherConditions: ['Agricultural land owners'] },
      ],
      documents: [
        { name: 'RTC (Khata)', required: true },
        { name: 'Aadhaar', required: true },
        { name: 'Soil test report', required: true },
      ],
      deadline: 'ongoing',
      website: 'https://watershed.karnataka.gov.in',
      category: ['agricultural'],
      keywords: ['farmer', 'watershed', 'agricultural'],
      status: 'active',
    },
    {
      name: 'Bengaluru RWH Incentive',
      type: 'municipal',
      department: 'BWSSB',
      state: 'Karnataka',
      subsidyType: 'fixed',
      amount: { min: 2000, max: 5000, description: '₹5,000 for apartments, ₹2,000 for individual houses' },
      eligibilityCriteria: [
        { propertyType: ['residential', 'commercial'], otherConditions: ['BWSSB consumers'] },
      ],
      documents: [
        { name: 'RR Number', required: true },
        { name: 'Installation photos', required: true },
        { name: 'Invoice', required: true },
      ],
      deadline: 'ongoing',
      website: 'https://www.bwssb.gov.in',
      category: ['residential', 'commercial'],
      keywords: ['bengaluru', 'bangalore', 'apartment', 'incentive'],
      status: 'active',
    },
    {
      name: 'Jalyukt Shivar Abhiyan',
      type: 'state',
      department: 'Water Conservation Department',
      state: 'Maharashtra',
      subsidyType: 'grant',
      amount: { description: 'Full cost for community structures' },
      eligibilityCriteria: [
        { propertyType: ['community'], otherConditions: ['Village communities'] },
      ],
      documents: [
        { name: 'Gram Sabha resolution', required: true },
        { name: 'Village map', required: true },
        { name: 'Estimate', required: true },
      ],
      deadline: 'quarterly',
      website: 'https://jalyuktshivar.gov.in',
      category: ['community'],
      keywords: ['community', 'village', 'maharashtra'],
      status: 'active',
    },
    {
      name: 'Mumbai RWH Rebate',
      type: 'municipal',
      department: 'BMC',
      state: 'Maharashtra',
      subsidyType: 'rebate',
      amount: { percentage: 10, description: '5-10% property tax rebate' },
      eligibilityCriteria: [
        { propertyType: ['residential', 'commercial'], otherConditions: ['Properties with certified RWH'] },
      ],
      documents: [
        { name: 'RWH certificate', required: true },
        { name: 'Property tax receipt', required: true },
      ],
      deadline: 'annual',
      website: 'https://www.mcgm.gov.in',
      category: ['residential', 'commercial'],
      keywords: ['mumbai', 'property tax', 'rebate'],
      status: 'active',
    },
    {
      name: 'Sujalam Sufalam Jal Sanchay Abhiyan',
      type: 'state',
      department: 'Water Resources Department',
      state: 'Gujarat',
      subsidyType: 'grant',
      amount: { max: 100000, description: 'Up to ₹1,00,000 for community projects' },
      eligibilityCriteria: [
        { propertyType: ['community'], otherConditions: ['Villages and communities'] },
      ],
      documents: [
        { name: 'Village resolution', required: true },
        { name: 'Technical report', required: true },
        { name: 'NOCs', required: true },
      ],
      deadline: 'quarterly',
      website: 'https://gujarat.gov.in',
      category: ['community'],
      keywords: ['gujarat', 'community', 'village'],
      status: 'active',
    },
    {
      name: 'Household RWH Support',
      type: 'state',
      department: 'Gujarat Water Supply',
      state: 'Gujarat',
      subsidyType: 'percentage',
      amount: { percentage: 50, max: 30000, description: '50% up to ₹30,000' },
      eligibilityCriteria: [
        { propertyType: ['residential'], otherConditions: ['Urban households'] },
      ],
      documents: [
        { name: 'Property documents', required: true },
        { name: 'Income certificate', required: true },
        { name: 'Vendor estimate', required: true },
      ],
      deadline: 'ongoing',
      website: 'https://gws.gujarat.gov.in',
      category: ['residential'],
      keywords: ['gujarat', 'urban', 'household'],
      status: 'active',
    },
    {
      name: 'Jal Jeevan Mission',
      type: 'central',
      ministry: 'Ministry of Jal Shakti',
      state: 'All',
      subsidyType: 'grant',
      amount: { description: 'Variable based on project' },
      eligibilityCriteria: [
        { propertyType: ['residential', 'community'], otherConditions: ['Rural households for tap water'] },
      ],
      documents: [
        { name: 'Village action plan', required: true },
        { name: 'DPR', required: true },
        { name: 'Gram Sabha resolution', required: true },
      ],
      deadline: 'ongoing',
      website: 'https://jaljeevanmission.gov.in',
      category: ['residential', 'community'],
      keywords: ['central', 'rural', 'tap water', 'mission'],
      status: 'active',
    },
    {
      name: 'Atal Bhujal Yojana',
      type: 'central',
      ministry: 'Ministry of Jal Shakti',
      state: 'All',
      subsidyType: 'grant',
      amount: { description: 'Community-based incentives' },
      eligibilityCriteria: [
        { propertyType: ['community'], otherConditions: ['Water-stressed blocks'] },
      ],
      documents: [
        { name: 'Block-level water security plan', required: true },
        { name: 'DPR', required: true },
      ],
      deadline: 'ongoing',
      website: 'https://jalshakti.gov.in/atal-bhujal-yojana',
      category: ['community'],
      keywords: ['central', 'community', 'groundwater'],
      status: 'active',
    },
  ];

  for (const scheme of schemes) {
    await GovernmentScheme.findOneAndUpdate(
      { name: scheme.name, state: scheme.state },
      scheme,
      { upsert: true, new: true }
    );
  }
};

// Initialize seed data
seedGovernmentSchemes().catch(console.error);

// POST /api/subsidy/check
router.post('/check', async (req, res) => {
  try {
    const { state, city, propertyType, area, incomeGroup } = req.body;

    // Try database first
    let schemes;
    try {
      schemes = await GovernmentScheme.findByState(state, propertyType);
    } catch {
      schemes = null;
    }

    if (schemes && schemes.length > 0) {
      // Filter by property type
      const applicableSchemes = schemes.filter(scheme => {
        if (propertyType && scheme.category) {
          return scheme.category.includes(propertyType) || scheme.category.includes('residential');
        }
        return true;
      });

      return res.json({
        success: true,
        data: {
          location: { state, city },
          property: { type: propertyType, area },
          schemes: applicableSchemes.map(s => ({
            name: s.name,
            department: s.department,
            type: s.type,
            subsidyType: s.subsidyType,
            amount: s.formattedAmount,
            eligibility: s.eligibilityCriteria.map(e => e.propertyType?.join(', ') || e.otherConditions?.join(', ')),
            documents: s.documents.map(d => d.name),
            deadline: s.deadline,
            website: s.website,
            category: s.category,
          })),
          estimatedSubsidy: applicableSchemes.length > 0 
            ? `₹5,000 - ₹${Math.max(...applicableSchemes.map(s => s.amount.max || 0), 50000)}` 
            : 'Contact local authority'
        }
      });
    }

    // Fallback to static data
    const stateKey = state.toLowerCase().replace(/\s+/g, '-');
    const stateSchemes = require('./subsidy').subsidySchemes[stateKey] || [];
    
    const applicableSchemes = stateSchemes.filter(scheme => {
      if (propertyType === 'residential') {
        return scheme.eligibility.toLowerCase().includes('household') || 
               scheme.eligibility.toLowerCase().includes('residential') ||
               scheme.eligibility.toLowerCase().includes('property');
      }
      if (propertyType === 'commercial') {
        return scheme.eligibility.toLowerCase().includes('building') ||
               scheme.eligibility.toLowerCase().includes('commercial');
      }
      return true;
    });
    
    res.json({
      success: true,
      data: {
        location: { state, city },
        property: { type: propertyType, area },
        schemes: applicableSchemes,
        centralSchemes: require('./subsidy').centralSchemes,
        estimatedSubsidy: applicableSchemes.length > 0 
          ? '₹5,000 - ₹50,000' 
          : 'Contact local authority'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/subsidy/calculate
router.post('/calculate', async (req, res) => {
  try {
    const { schemeId, installationCost, propertyType, area } = req.body;

    let scheme;
    try {
      scheme = await GovernmentScheme.findById(schemeId);
    } catch {
      scheme = null;
    }

    if (!scheme) {
      return res.status(404).json({
        success: false,
        error: 'Scheme not found'
      });
    }

    let subsidyAmount = 0;
    let breakdown = [];

    switch (scheme.subsidyType) {
      case 'fixed':
        subsidyAmount = scheme.amount.fixed || scheme.amount.min || 0;
        breakdown.push({ item: 'Fixed Amount', amount: subsidyAmount });
        break;
      case 'percentage':
        subsidyAmount = (installationCost * (scheme.amount.percentage || 0)) / 100;
        if (scheme.amount.max && subsidyAmount > scheme.amount.max) {
          subsidyAmount = scheme.amount.max;
        }
        breakdown.push({ 
          item: `${scheme.amount.percentage}% of ₹${installationCost.toLocaleString()}`, 
          amount: subsidyAmount 
        });
        break;
      case 'rebate':
        subsidyAmount = (installationCost * (scheme.amount.percentage || 10)) / 100;
        breakdown.push({ 
          item: `${scheme.amount.percentage || 10}% rebate`, 
          amount: subsidyAmount 
        });
        break;
      default:
        subsidyAmount = scheme.amount.min || 0;
        breakdown.push({ item: 'Base amount', amount: subsidyAmount });
    }

    const userContribution = installationCost - subsidyAmount;

    res.json({
      success: true,
      data: {
        scheme: scheme.name,
        installationCost,
        subsidyAmount,
        userContribution,
        breakdown,
        savings: `${Math.round((subsidyAmount / installationCost) * 100)}%`,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/subsidy/schemes
router.get('/schemes', async (req, res) => {
  try {
    const { state, type, category, search, limit = 20, page = 1 } = req.query;

    let schemes;
    try {
      const query = { status: 'active' };
      
      if (state) query.state = state;
      if (type) query.type = type;
      if (category) query.category = category;
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { keywords: { $in: [new RegExp(search, 'i')] } },
        ];
      }

      schemes = await GovernmentScheme.find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ popularity: -1 });
    } catch {
      // Return static data
      return res.json({
        success: true,
        data: Object.entries(require('./subsidy').subsidySchemes).flatMap(([state, stateSchemes]) => 
          stateSchemes.map(s => ({ ...s, state: state.replace('-', ' ') }))
        ),
      });
    }

    res.json({
      success: true,
      data: schemes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/subsidy/schemes/:id
router.get('/schemes/:id', async (req, res) => {
  try {
    let scheme;
    try {
      scheme = await GovernmentScheme.findById(req.params.id);
    } catch {
      scheme = null;
    }

    if (!scheme) {
      // Try to find in static data
      const allSchemes = Object.entries(require('./subsidy').subsidySchemes).flatMap(
        ([state, stateSchemes]) => stateSchemes.map(s => ({ ...s, state: state.replace('-', ' ') }))
      );
      scheme = allSchemes.find(s => s.scheme === req.params.id);
      
      if (!scheme) {
        return res.status(404).json({
          success: false,
          error: 'Scheme not found'
        });
      }
    }

    res.json({
      success: true,
      data: {
        name: scheme.name,
        department: scheme.department,
        type: scheme.type,
        ministry: scheme.ministry,
        state: scheme.state,
        subsidyType: scheme.subsidyType,
        amount: scheme.formattedAmount || scheme.subsidyAmount,
        eligibilityCriteria: scheme.eligibilityCriteria,
        documents: scheme.documents,
        deadline: scheme.deadline,
        website: scheme.website,
        helpline: scheme.helpline,
        email: scheme.email,
        category: scheme.category,
        benefits: scheme.benefits,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/subsidy/states
router.get('/states', async (req, res) => {
  try {
    let states;
    try {
      states = await GovernmentScheme.distinct('state');
    } catch {
      states = Object.keys(require('./subsidy').subsidySchemes);
    }

    const stateList = states.map(state => ({
      id: state.toLowerCase().replace(/\s+/g, '-'),
      name: state,
    }));

    res.json({
      success: true,
      data: stateList
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/subsidy/apply
router.post('/apply', auth, async (req, res) => {
  try {
    const { schemeId, documents, formData } = req.body;

    let scheme;
    try {
      scheme = await GovernmentScheme.findById(schemeId);
    } catch {
      scheme = null;
    }

    if (!scheme) {
      return res.status(404).json({
        success: false,
        error: 'Scheme not found'
      });
    }

    const application = new SubsidyApplication({
      userId: req.user.id,
      schemeId: scheme._id,
      documents,
      formData,
      status: 'submitted',
    });

    await application.save();

    // Update scheme popularity
    await GovernmentScheme.findByIdAndUpdate(schemeId, {
      $inc: { 'popularity.applications': 1 },
    });

    res.status(201).json({
      success: true,
      data: {
        applicationId: application.applicationId,
        status: application.status,
        message: 'Application submitted successfully',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/subsidy/applications
router.get('/applications', auth, async (req, res) => {
  try {
    const { status } = req.query;
    
    const applications = await SubsidyApplication.getUserApplications(req.user.id, status);

    res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/subsidy/applications/:id
router.get('/applications/:id', auth, async (req, res) => {
  try {
    const application = await SubsidyApplication.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate('schemeId');

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/subsidy/application-guide
router.post('/application-guide', (req, res) => {
  try {
    const { schemeName, state } = req.body;
    
    const guide = {
      steps: [
        'Visit the official department website',
        'Download and fill the application form',
        'Attach all required documents',
        'Submit to local office or online portal',
        'Wait for inspection/verification',
        'Receive approval and subsidy disbursement'
      ],
      timeline: '4-8 weeks',
      contact: 'Visit your local municipality/water board office',
      tips: [
        'Ensure all documents are attested',
        'Take clear photos of installation',
        'Keep vendor invoices safe',
        'Follow up regularly on application status'
      ]
    };
    
    res.json({
      success: true,
      data: guide
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/subsidy/track-application
router.get('/track/:applicationId', auth, async (req, res) => {
  try {
    const application = await SubsidyApplication.findOne({
      applicationId: req.params.applicationId,
      userId: req.user.id,
    }).populate('schemeId');

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: {
        applicationId: application.applicationId,
        schemeName: application.schemeId?.name,
        status: application.status,
        progress: application.progress,
        timeline: application.timeline,
        notes: application.notes,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
