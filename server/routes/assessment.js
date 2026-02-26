const express = require('express');
const router = express.Router();

// Rainfall data by state/region (mm/year)
const rainfallData = {
  'andhra-pradesh': 1094,
  'arunachal-pradesh': 2782,
  'assam': 2818,
  'bihar': 1200,
  'chhattisgarh': 1400,
  'goa': 3055,
  'gujarat': 800,
  'haryana': 617,
  'himachal-pradesh': 1251,
  'jharkhand': 1326,
  'karnataka': 1248,
  'kerala': 3055,
  'madhya-pradesh': 1178,
  'maharashtra': 1181,
  'manipur': 1881,
  'meghalaya': 2818,
  'mizoram': 2543,
  'nagaland': 1881,
  'odisha': 1482,
  'punjab': 649,
  'rajasthan': 313,
  'sikkim': 2739,
  'tamil-nadu': 998,
  'telangana': 961,
  'tripura': 2200,
  'uttar-pradesh': 1025,
  'uttarakhand': 1733,
  'west-bengal': 1750,
  'delhi': 797,
  'chandigarh': 1059,
  'puducherry': 1200
};

// Runoff coefficients by roof type
const runoffCoefficients = {
  'concrete': 0.85,
  'metal': 0.90,
  'tiles': 0.75,
  'asbestos': 0.80,
  'flat': 0.80
};

// Soil type recommendations
const soilRecommendations = {
  'sandy': {
    structure: 'Recharge Pit',
    infiltrationRate: 'High (>25 cm/hr)',
    depthRecommendation: '3-5 meters',
    materials: ['Coarse sand', 'Gravel', 'Boulders']
  },
  'loamy': {
    structure: 'Recharge Trench',
    infiltrationRate: 'Medium (6-25 cm/hr)',
    depthRecommendation: '2-3 meters',
    materials: ['Sand', 'Gravel', 'Bricks']
  },
  'clay': {
    structure: 'Recharge Shaft with Borewell',
    infiltrationRate: 'Low (<6 cm/hr)',
    depthRecommendation: '10-15 meters',
    materials: ['Perforated pipes', 'Gravel pack', 'Sand']
  },
  'rocky': {
    structure: 'Recharge Shaft with Fracture Connection',
    infiltrationRate: 'Variable',
    depthRecommendation: '5-10 meters',
    materials: ['Explosive fracturing', 'High-pressure injection']
  }
};

// Cost estimation data (in INR)
const costData = {
  'recharge-pit': {
    baseCost: 15000,
    perCubicMeter: 2500,
    maintenance: 2000
  },
  'recharge-trench': {
    baseCost: 12000,
    perCubicMeter: 1800,
    maintenance: 1500
  },
  'recharge-shaft': {
    baseCost: 35000,
    perMeter: 2500,
    maintenance: 3000
  },
  'storage-tank': {
    perLiter: 8,
    installation: 5000
  }
};

// POST /api/assessment/calculate
router.post('/calculate', (req, res) => {
  try {
    const {
      name,
      location,
      state,
      roofArea,
      roofType,
      openSpace,
      soilType,
      numDwellers,
      waterUsage
    } = req.body;

    // Get rainfall data
    const annualRainfall = rainfallData[state.toLowerCase().replace(/\s+/g, '-')] || 1200;
    const runoffCoefficient = runoffCoefficients[roofType] || 0.80;

    // Calculate runoff potential
    const runoffPotential = Math.round(roofArea * annualRainfall * runoffCoefficient / 1000);

    // Get soil recommendations
    const soilRec = soilRecommendations[soilType] || soilRecommendations['loamy'];

    // Calculate water demand
    const dailyDemand = numDwellers * (waterUsage || 135); // Default 135 LPCD
    const annualDemand = dailyDemand * 365;

    // Calculate storage requirement (3 months supply)
    const storageRequired = Math.round(dailyDemand * 90);

    // Calculate recharge structure dimensions
    const rechargeVolume = Math.round(runoffPotential * 0.7); // 70% for recharge, 30% storage
    let structureDimensions = {};

    if (soilRec.structure === 'Recharge Pit') {
      const depth = 4; // meters
      const area = Math.ceil(rechargeVolume / (depth * 1000)); // m²
      const sideLength = Math.ceil(Math.sqrt(area));
      structureDimensions = {
        type: 'Recharge Pit',
        length: sideLength,
        width: sideLength,
        depth: depth,
        volume: rechargeVolume
      };
    } else if (soilRec.structure === 'Recharge Trench') {
      const width = 1.5;
      const depth = 2.5;
      const length = Math.ceil(rechargeVolume / (width * depth * 1000));
      structureDimensions = {
        type: 'Recharge Trench',
        length: length,
        width: width,
        depth: depth,
        volume: rechargeVolume
      };
    } else {
      const diameter = 1.2;
      const depth = Math.ceil(rechargeVolume / (Math.PI * (diameter/2)**2 * 1000));
      structureDimensions = {
        type: 'Recharge Shaft',
        diameter: diameter,
        depth: depth,
        volume: rechargeVolume
      };
    }

    // Calculate costs
    let costEstimate = {};
    if (structureDimensions.type === 'Recharge Pit') {
      const volume = structureDimensions.length * structureDimensions.width * structureDimensions.depth;
      costEstimate = {
        structure: costData['recharge-pit'].baseCost + (volume * costData['recharge-pit'].perCubicMeter),
        storage: storageRequired * costData['storage-tank'].perLiter + costData['storage-tank'].installation,
        maintenance: costData['recharge-pit'].maintenance,
        total: 0
      };
    } else if (structureDimensions.type === 'Recharge Trench') {
      const volume = structureDimensions.length * structureDimensions.width * structureDimensions.depth;
      costEstimate = {
        structure: costData['recharge-trench'].baseCost + (volume * costData['recharge-trench'].perCubicMeter),
        storage: storageRequired * costData['storage-tank'].perLiter + costData['storage-tank'].installation,
        maintenance: costData['recharge-trench'].maintenance,
        total: 0
      };
    } else {
      costEstimate = {
        structure: costData['recharge-shaft'].baseCost + (structureDimensions.depth * costData['recharge-shaft'].perMeter),
        storage: storageRequired * costData['storage-tank'].perLiter + costData['storage-tank'].installation,
        maintenance: costData['recharge-shaft'].maintenance,
        total: 0
      };
    }
    costEstimate.total = costEstimate.structure + costEstimate.storage + costEstimate.maintenance;

    // Calculate payback period
    const waterSavings = Math.min(runoffPotential * 0.3, annualDemand * 0.25); // 30% storage utilization
    const waterCostPer1000L = 50; // Average municipal water cost
    const annualSavings = (waterSavings * waterCostPer1000L) / 1000;
    const paybackPeriod = Math.ceil(costEstimate.total / annualSavings);

    // Feasibility score
    const feasibilityScore = Math.min(100, Math.round(
      (runoffPotential / annualDemand * 40) +
      (openSpace > 50 ? 20 : 10) +
      (annualRainfall > 1000 ? 20 : 15) +
      (soilType !== 'clay' && soilType !== 'rocky' ? 20 : 10)
    ));

    // Generate recommendations
    const recommendations = [];
    if (feasibilityScore > 70) {
      recommendations.push('Excellent potential for rainwater harvesting');
      recommendations.push('Recommended to implement both storage and recharge systems');
    } else if (feasibilityScore > 50) {
      recommendations.push('Good potential for rainwater harvesting');
      recommendations.push('Focus on recharge structures for groundwater replenishment');
    } else {
      recommendations.push('Moderate potential - consider water conservation measures');
      recommendations.push('Implement storage tanks for direct use');
    }

    if (runoffPotential > annualDemand * 0.5) {
      recommendations.push('Surplus water available - consider community sharing');
    }

    res.json({
      success: true,
      data: {
        userInfo: { name, location, state },
        rainfall: { annual: annualRainfall, unit: 'mm/year' },
        runoff: { potential: runoffPotential, unit: 'liters/year', coefficient: runoffCoefficient },
        waterDemand: { daily: dailyDemand, annual: annualDemand, unit: 'liters' },
        storage: { required: storageRequired, unit: 'liters' },
        soil: soilRec,
        structure: structureDimensions,
        costs: {
          structure: Math.round(costEstimate.structure),
          storage: Math.round(costEstimate.storage),
          maintenance: costEstimate.maintenance,
          total: Math.round(costEstimate.total)
        },
        benefits: {
          annualWaterSavings: Math.round(waterSavings),
          annualCostSavings: Math.round(annualSavings),
          paybackPeriod: paybackPeriod,
          groundwaterRecharge: Math.round(rechargeVolume)
        },
        feasibility: {
          score: feasibilityScore,
          rating: feasibilityScore > 70 ? 'High' : feasibilityScore > 50 ? 'Medium' : 'Low'
        },
        recommendations
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/assessment/states
router.get('/states', (req, res) => {
  const states = Object.keys(rainfallData).map(key => ({
    id: key,
    name: key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    annualRainfall: rainfallData[key]
  }));
  res.json({ success: true, data: states });
});

module.exports = router;
