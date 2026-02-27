const express = require('express');
const router = express.Router();

const createSeededRandom = (seed) => {
  let value = seed;
  return () => {
    value = Math.sin(value) * 10000;
    return value - Math.floor(value);
  };
};

const createCoordinateSeed = (latitude, longitude) => {
  return Math.abs(Math.sin(latitude * 12.9898 + longitude * 78.233) * 43758.5453);
};

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
  sedimentary: {
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
  coastal: {
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
  island: {
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

const buildVisualizationLayers = (aquiferKey, random) => {
  const weatheredThickness = aquiferKey === 'hard-rock' ? 18 : 10;
  const saturatedThickness = aquiferKey === 'sedimentary' ? 120 : aquiferKey === 'alluvial-plain' ? 70 : 45;

  const layers = [
    {
      name: 'Top Soil',
      thickness: 1.5 + random() * 0.8,
      material: 'Soil',
      color: '#FDE68A'
    },
    {
      name: 'Weathered Zone',
      thickness: weatheredThickness + random() * 6,
      material: 'Weathered Rock/Alluvium',
      color: '#FCD34D'
    },
    {
      name: 'Saturated Zone',
      thickness: saturatedThickness + random() * 20,
      material: 'Aquifer',
      color: '#38BDF8'
    },
    {
      name: 'Bedrock',
      thickness: 80 + random() * 60,
      material: 'Fresh Rock',
      color: '#9CA3AF'
    }
  ];

  let depthCursor = 0;
  return layers.map((layer) => {
    const depthTop = depthCursor;
    const depthBottom = depthCursor + layer.thickness;
    depthCursor = depthBottom;

    return {
      ...layer,
      depthTop: Math.round(depthTop * 10) / 10,
      depthBottom: Math.round(depthBottom * 10) / 10
    };
  });
};

// POST /api/aquifer/info
router.post('/info', (req, res) => {
  try {
    const { latitude, longitude, state } = req.body;

    const stateKey = state?.toLowerCase().replace(/\s+/g, '-') || '';
    const aquiferKey = stateAquiferMap[stateKey] || 'hard-rock';
    const aquifer = aquiferData[aquiferKey];

    const seed = createCoordinateSeed(Number(latitude) || 0, Number(longitude) || 0);
    const random = createSeededRandom(seed);

    const visualizationLayers = buildVisualizationLayers(aquiferKey, random);
    const waterTableDepth = Math.round((parseInt(aquifer.depthToWater.split('-')[0], 10) + random() * 6) * 10) / 10;
    const surfaceElevation = Math.round(60 + random() * 200);

    const preMonsoon = Math.round((waterTableDepth + 1.5 + random() * 1.5) * 10) / 10;
    const postMonsoon = Math.round((waterTableDepth - 1.5 - random() * 1.5) * 10) / 10;

    const decliningRate = Math.round((0.2 + random() * 0.6) * 10) / 10;
    const historical = [
      { year: 2010, depth: Math.round((waterTableDepth - decliningRate * 3) * 10) / 10 },
      { year: 2015, depth: Math.round((waterTableDepth - decliningRate * 1.5) * 10) / 10 },
      { year: 2020, depth: Math.round((waterTableDepth - decliningRate * 0.5) * 10) / 10 },
      { year: 2024, depth: Math.round(waterTableDepth * 10) / 10 }
    ];

    const visualization3D = {
      surface: {
        elevation: surfaceElevation,
        terrain: aquiferKey === 'hard-rock' ? 'Undulating plateau' : 'Alluvial plain'
      },
      layers: visualizationLayers,
      waterTable: {
        depth: waterTableDepth,
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
        groundwaterLevels: {
          preMonsoonDepth: preMonsoon,
          postMonsoonDepth: postMonsoon,
          historical
        },
        groundwaterTrend: {
          status: random() > 0.5 ? 'Declining' : 'Stable',
          rate: decliningRate,
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
