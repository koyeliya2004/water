const express = require('express');
const router = express.Router();

// CGWB-inspired aquifer data by region
const aquiferData = {
  'alluvial-plain': {
    name: 'Alluvial Aquifer',
    type: 'Unconfined to Semi-confined',
    lithology: 'Sand, Silt, Clay layers',
    thickness: '50-300 meters',
    transmissivity: 'High (1000-5000 m²/day)',
    specificYield: '10-20%',
    waterQuality: 'Fresh to slightly saline',
    depthToWater: '3-15 meters',
    principalAquifer: true
  },
  'hard-rock': {
    name: 'Weathered & Fractured Rock Aquifer',
    type: 'Unconfined',
    lithology: 'Granite, Gneiss, Basalt',
    thickness: '10-50 meters',
    transmissivity: 'Low to Medium (10-500 m²/day)',
    specificYield: '1-5%',
    waterQuality: 'Fresh',
    depthToWater: '5-25 meters',
    principalAquifer: true
  },
  'sedimentary': {
    name: 'Sedimentary Basin Aquifer',
    type: 'Confined to Unconfined',
    lithology: 'Sandstone, Limestone, Shale',
    thickness: '100-500 meters',
    transmissivity: 'Medium to High (100-2000 m²/day)',
    specificYield: '5-15%',
    waterQuality: 'Fresh to saline at depth',
    depthToWater: '10-40 meters',
    principalAquifer: true
  },
  'coastal': {
    name: 'Coastal Aquifer',
    type: 'Unconfined to Confined',
    lithology: 'Sand, Gravel with clay lenses',
    thickness: '20-100 meters',
    transmissivity: 'Medium (100-1000 m²/day)',
    specificYield: '8-18%',
    waterQuality: 'Fresh to saline intrusion risk',
    depthToWater: '2-10 meters',
    principalAquifer: true
  },
  'island': {
    name: 'Island Aquifer',
    type: 'Lens-shaped freshwater',
    lithology: 'Coral sand, Limestone',
    thickness: '10-30 meters',
    transmissivity: 'Medium (50-500 m²/day)',
    specificYield: '5-12%',
    waterQuality: 'Fresh lens over saline',
    depthToWater: '1-5 meters',
    principalAquifer: true
  }
};

// State to aquifer mapping (simplified)
const stateAquiferMap = {
  'punjab': 'alluvial-plain',
  'haryana': 'alluvial-plain',
  'uttar-pradesh': 'alluvial-plain',
  'bihar': 'alluvial-plain',
  'west-bengal': 'alluvial-plain',
  'assam': 'alluvial-plain',
  'rajasthan-west': 'sedimentary',
  'rajasthan-east': 'alluvial-plain',
  'gujarat': 'alluvial-plain',
  'maharashtra': 'hard-rock',
  'karnataka': 'hard-rock',
  'andhra-pradesh': 'hard-rock',
  'telangana': 'hard-rock',
  'tamil-nadu': 'hard-rock',
  'kerala': 'hard-rock',
  'odisha': 'hard-rock',
  'chhattisgarh': 'hard-rock',
  'jharkhand': 'hard-rock',
  'madhya-pradesh': 'hard-rock',
  'goa': 'coastal',
  'karnataka-coast': 'coastal',
  'kerala-coast': 'coastal',
  'tamil-nadu-coast': 'coastal',
  'andhra-coast': 'coastal',
  'gujarat-coast': 'coastal',
  'west-bengal-coast': 'coastal',
  'andaman': 'island',
  'nicobar': 'island',
  'lakshadweep': 'island',
  'himachal-pradesh': 'hard-rock',
  'uttarakhand': 'hard-rock',
  'jammu-kashmir': 'hard-rock',
  'ladakh': 'hard-rock',
  'north-east': 'hard-rock'
};

// POST /api/aquifer/info
router.post('/info', (req, res) => {
  try {
    const { latitude, longitude, state } = req.body;
    
    // Determine aquifer type based on state
    const stateKey = state.toLowerCase().replace(/\s+/g, '-');
    const aquiferKey = stateAquiferMap[stateKey] || 'hard-rock';
    const aquifer = aquiferData[aquiferKey];
    
    // Generate 3D visualization data
    const visualization3D = {
      surface: {
        elevation: Math.round(50 + Math.random() * 200),
        terrain: 'Plain to undulating'
      },
      layers: [
        { name: 'Top Soil', thickness: 1.5, material: 'Soil' },
        { name: 'Weathered Zone', thickness: aquiferKey === 'hard-rock' ? 15 : 8, material: 'Weathered Rock/Alluvium' },
        { name: 'Saturated Zone', thickness: parseInt(aquifer.thickness.split('-')[0]), material: 'Aquifer' },
        { name: 'Bedrock', thickness: 100, material: 'Fresh Rock' }
      ],
      waterTable: {
        depth: parseInt(aquifer.depthToWater.split('-')[0]) + Math.random() * 5,
        seasonalVariation: '2-5 meters'
      }
    };

    res.json({
      success: true,
      data: {
        location: { latitude, longitude, state },
        aquifer: {
          ...aquifer,
          category: aquiferKey
        },
        visualization3D,
        groundwaterTrend: {
          status: Math.random() > 0.5 ? 'Declining' : 'Stable',
          rate: Math.round(Math.random() * 30) / 10, // m/year
          period: '2010-2023'
        },
        recommendations: [
          `Aquifer type: ${aquifer.type}`,
          `Suitable recharge method: ${aquiferKey === 'hard-rock' ? 'Recharge shafts or percolation tanks' : 'Recharge trenches or pits'}`,
          `Expected recharge rate: ${aquifer.specificYield}`,
          `Water table depth: ${aquifer.depthToWater}`
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/aquifer/types
router.get('/types', (req, res) => {
  res.json({
    success: true,
    data: Object.entries(aquiferData).map(([key, value]) => ({
      id: key,
      name: value.name,
      description: `${value.type} - ${value.lithology}`
    }))
  });
});

// POST /api/aquifer/depth
router.post('/depth', (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    // Simulate depth data based on coordinates
    const baseDepth = 5 + Math.random() * 20;
    
    res.json({
      success: true,
      data: {
        location: { latitude, longitude },
        currentDepth: Math.round(baseDepth * 10) / 10,
        unit: 'meters below ground level',
        historical: {
          '2010': Math.round((baseDepth - 3) * 10) / 10,
          '2015': Math.round((baseDepth - 1.5) * 10) / 10,
          '2020': Math.round((baseDepth - 0.5) * 10) / 10,
          '2024': Math.round(baseDepth * 10) / 10
        },
        seasonal: {
          preMonsoon: Math.round((baseDepth + 2) * 10) / 10,
          postMonsoon: Math.round((baseDepth - 2) * 10) / 10
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
