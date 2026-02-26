const express = require('express');
const router = express.Router();

// Government subsidy schemes by state
const subsidySchemes = {
  'delhi': [
    {
      scheme: 'Mukhyamantri Jal Swavalamban Yojana',
      department: 'Delhi Jal Board',
      subsidyAmount: 'Up to ₹50,000 or 50% of cost',
      eligibility: 'All residential properties',
      documents: ['Property ID', 'Aadhaar Card', 'Estimate from vendor'],
      deadline: 'Ongoing',
      website: 'https://www.delhijalboard.nic.in'
    },
    {
      scheme: 'Rainwater Harvesting Rebate',
      department: 'MCD/DJB',
      subsidyAmount: '10% rebate on water bills',
      eligibility: 'Properties with functional RWH',
      documents: ['Installation certificate', 'Photographs', 'Bill receipts'],
      deadline: 'Annual application',
      website: 'https://mcdonline.nic.in'
    }
  ],
  'tamil-nadu': [
    {
      scheme: 'Mandatory RWH - Chennai',
      department: 'Chennai Metropolitan Water Supply',
      subsidyAmount: '₹10,000 for households',
      eligibility: 'All buildings in Chennai',
      documents: ['Building plan', 'RWH design', 'Completion certificate'],
      deadline: 'Before construction completion',
      website: 'https://www.chennaimetrowater.tn.gov.in'
    },
    {
      scheme: 'Rainwater Harvesting Incentive',
      department: 'TWAD Board',
      subsidyAmount: '50% subsidy up to ₹25,000',
      eligibility: 'Rural households',
      documents: ['Ration card', 'Land records', 'Bank account details'],
      deadline: 'March 31, 2025',
      website: 'https://www.twadboard.gov.in'
    }
  ],
  'karnataka': [
    {
      scheme: 'Sujala-III',
      department: 'Watershed Development Department',
      subsidyAmount: '75% subsidy for farmers',
      eligibility: 'Agricultural land owners',
      documents: ['RTC (Khata)', 'Aadhaar', 'Soil test report'],
      deadline: 'Ongoing',
      website: 'https://watershed.karnataka.gov.in'
    },
    {
      scheme: 'Bengaluru RWH Incentive',
      department: 'BWSSB',
      subsidyAmount: '₹5,000 for apartments, ₹2,000 for individual houses',
      eligibility: 'BWSSB consumers',
      documents: ['RR Number', 'Installation photos', 'Invoice'],
      deadline: 'Ongoing',
      website: 'https://www.bwssb.gov.in'
    }
  ],
  'maharashtra': [
    {
      scheme: 'Jalyukt Shivar Abhiyan',
      department: 'Water Conservation Department',
      subsidyAmount: 'Full cost for community structures',
      eligibility: 'Village communities',
      documents: ['Gram Sabha resolution', 'Village map', 'Estimate'],
      deadline: 'Pre-monsoon period',
      website: 'https://jalyuktshivar.gov.in'
    },
    {
      scheme: 'Mumbai RWH Rebate',
      department: 'BMC',
      subsidyAmount: '5-10% property tax rebate',
      eligibility: 'Properties with certified RWH',
      documents: ['RWH certificate', 'Property tax receipt'],
      deadline: 'Annual',
      website: 'https://www.mcgm.gov.in'
    }
  ],
  'gujarat': [
    {
      scheme: 'Sujalam Sufalam Jal Sanchay Abhiyan',
      department: 'Water Resources Department',
      subsidyAmount: 'Up to ₹1,00,000 for community projects',
      eligibility: 'Villages and communities',
      documents: ['Village resolution', 'Technical report', 'NOCs'],
      deadline: 'Pre-monsoon',
      website: 'https://gujarat.gov.in'
    },
    {
      scheme: 'Household RWH Support',
      department: 'Gujarat Water Supply',
      subsidyAmount: '50% up to ₹30,000',
      eligibility: 'Urban households',
      documents: ['Property documents', 'Income certificate', 'Vendor estimate'],
      deadline: 'Ongoing',
      website: 'https://gws.gujarat.gov.in'
    }
  ],
  'rajasthan': [
    {
      scheme: 'Mukhya Mantri Jal Swavlamban Abhiyan',
      department: 'Rural Development',
      subsidyAmount: 'Full cost for village structures',
      eligibility: 'Rural communities',
      documents: ['Village proposal', 'Watershed map', 'Gram Panchayat resolution'],
      deadline: 'Pre-monsoon',
      website: 'https://mjsa.rajasthan.gov.in'
    },
    {
      scheme: 'Jaipur RWH Mandate',
      department: 'JDA/JMC',
      subsidyAmount: 'Rebate on building plan approval',
      eligibility: 'New constructions >300 sqm',
      documents: ['Building plan', 'RWH design', 'Completion certificate'],
      deadline: 'At building approval',
      website: 'https://jda.urban.rajasthan.gov.in'
    }
  ],
  'kerala': [
    {
      scheme: 'Jalasamrudhi',
      department: 'Kerala Water Authority',
      subsidyAmount: '₹25,000 for households',
      eligibility: 'All residential buildings',
      documents: ['Ownership proof', 'RWH plan', 'Municipality NOC'],
      deadline: 'Ongoing',
      website: 'https://kwa.kerala.gov.in'
    },
    {
      scheme: 'Harita Keralam',
      department: 'Local Self Government',
      subsidyAmount: '75% for institutions',
      eligibility: 'Schools, colleges, government buildings',
      documents: ['Institution registration', 'Project proposal', 'Estimates'],
      deadline: 'Financial year end',
      website: 'https://lsgd.kerala.gov.in'
    }
  ],
  'telangana': [
    {
      scheme: 'Mission Kakatiya',
      department: 'Irrigation Department',
      subsidyAmount: 'Full restoration cost',
      eligibility: 'Tank-based communities',
      documents: ['Tank details', 'Village resolution', 'Survey maps'],
      deadline: 'Project-based',
      website: 'https://missionkakatiya.cgg.gov.in'
    },
    {
      scheme: 'GHMC RWH Incentive',
      department: 'GHMC',
      subsidyAmount: 'Cash award for best implementation',
      eligibility: 'Hyderabad residents',
      documents: ['Property tax ID', 'RWH photos', 'Water bill savings proof'],
      deadline: 'Annual competition',
      website: 'https://www.ghmc.gov.in'
    }
  ],
  'andhra-pradesh': [
    {
      scheme: 'Neeru-Chettu',
      department: 'Rural Development',
      subsidyAmount: 'Full cost for water conservation',
      eligibility: 'Rural households and communities',
      documents: ['Village mapping', 'Household list', 'Work estimates'],
      deadline: 'Continuous',
      website: 'https://rdpr.ap.gov.in'
    }
  ]
};

// Central government schemes
const centralSchemes = [
  {
    scheme: 'Jal Jeevan Mission',
    ministry: 'Ministry of Jal Shakti',
    subsidyAmount: 'Variable based on project',
    eligibility: 'Rural households for tap water',
    documents: ['Village action plan', 'DPR', 'Gram Sabha resolution'],
    website: 'https://jaljeevanmission.gov.in'
  },
  {
    scheme: 'Atal Bhujal Yojana',
    ministry: 'Ministry of Jal Shakti',
    subsidyAmount: 'Community-based incentives',
    eligibility: 'Water-stressed blocks',
    documents: ['Block-level water security plan', 'DPR'],
    website: 'https://jalshakti.gov.in/atal-bhujal-yojana'
  },
  {
    scheme: 'PMKSY - Watershed Development',
    ministry: 'Ministry of Agriculture',
    subsidyAmount: 'Full project cost',
    eligibility: 'Watershed communities',
    documents: ['Watershed project proposal', 'DPR'],
    website: 'https://pmksy.gov.in'
  }
];

// POST /api/subsidy/check
router.post('/check', (req, res) => {
  try {
    const { state, city, propertyType, area } = req.body;
    
    const stateKey = state.toLowerCase().replace(/\s+/g, '-');
    const stateSchemes = subsidySchemes[stateKey] || [];
    
    // Filter applicable schemes
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
        centralSchemes: centralSchemes,
        estimatedSubsidy: applicableSchemes.length > 0 
          ? '₹5,000 - ₹50,000' 
          : 'Contact local authority'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/subsidy/states
router.get('/states', (req, res) => {
  const states = Object.keys(subsidySchemes).map(key => ({
    id: key,
    name: key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    schemeCount: subsidySchemes[key].length
  }));
  
  res.json({
    success: true,
    data: states
  });
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

module.exports = router;
