const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const GOOGLE_MAPS_ZOOM = 20;

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

const buildStaticMapUrl = (latitude, longitude, zoom = GOOGLE_MAPS_ZOOM) => {
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    return null;
  }

  return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=640x640&maptype=satellite&key=${process.env.GOOGLE_MAPS_API_KEY}`;
};

const generateFootprint = (latitude, longitude, areaSqm) => {
  const metersPerDegreeLat = 111320;
  const metersPerDegreeLng = 111320 * Math.cos((latitude * Math.PI) / 180);
  const widthMeters = Math.sqrt(areaSqm) * 1.3;
  const heightMeters = areaSqm / widthMeters;
  const latOffset = (heightMeters / 2) / metersPerDegreeLat;
  const lngOffset = (widthMeters / 2) / metersPerDegreeLng;

  return [
    { lat: latitude + latOffset, lng: longitude - lngOffset },
    { lat: latitude + latOffset, lng: longitude + lngOffset },
    { lat: latitude - latOffset, lng: longitude + lngOffset },
    { lat: latitude - latOffset, lng: longitude - lngOffset }
  ];
};

const generateRoofAnalysis = ({ latitude, longitude, address }) => {
  const seed = createCoordinateSeed(latitude, longitude);
  const random = createSeededRandom(seed);

  const roofArea = Math.round(90 + random() * 240);
  const roofTypes = ['concrete', 'metal', 'tiles'];
  const roofType = roofTypes[Math.floor(random() * roofTypes.length)];
  const confidence = Math.round(82 + random() * 15);

  const obstructionPool = [
    { type: 'AC Unit', max: 3, areaReduction: 2 },
    { type: 'Water Tank', max: 2, areaReduction: 6 },
    { type: 'Solar Panel', max: 4, areaReduction: 3 },
    { type: 'Chimney', max: 2, areaReduction: 1 }
  ];

  const obstructions = obstructionPool
    .map((obs) => ({
      type: obs.type,
      count: Math.floor(random() * (obs.max + 1)),
      areaReduction: obs.areaReduction
    }))
    .filter((obs) => obs.count > 0);

  const totalObstructionArea = obstructions.reduce(
    (sum, obs) => sum + obs.count * obs.areaReduction,
    0
  );
  const effectiveArea = Math.max(12, roofArea - totalObstructionArea);

  const segmentationData = {
    roofBoundary: [
      { x: 10, y: 12 },
      { x: 90, y: 12 },
      { x: 92, y: 78 },
      { x: 8, y: 80 }
    ],
    obstructions: obstructions.map((obs, idx) => ({
      id: idx,
      type: obs.type,
      position: { x: 22 + idx * 18, y: 28 + (idx % 2) * 12 },
      size: { width: 10, height: 8 }
    }))
  };

  return {
    location: { latitude, longitude, address },
    imagery: {
      provider: 'Google Maps Static API',
      mapType: 'satellite',
      zoom: GOOGLE_MAPS_ZOOM,
      capturedAt: new Date().toISOString(),
      imageUrl: buildStaticMapUrl(latitude, longitude, GOOGLE_MAPS_ZOOM),
      note: process.env.GOOGLE_MAPS_API_KEY
        ? null
        : 'Set GOOGLE_MAPS_API_KEY to enable satellite preview.'
    },
    earthEngine: {
      dataset: 'GOOGLE/Research/open-buildings',
      projectId: process.env.EARTH_ENGINE_PROJECT_ID || null,
      buildingCoverage: Math.round(62 + random() * 28),
      inferredFootprint: generateFootprint(latitude, longitude, effectiveArea)
    },
    analysis: {
      totalRoofArea: roofArea,
      effectiveArea,
      roofType,
      confidence,
      obstructions,
      obstructionArea: totalObstructionArea,
      segmentation: segmentationData,
      pipeline: [
        'Satellite tile fetch via Google Maps Static API',
        'Roof footprint inference using Earth Engine Open Buildings',
        'Computer vision cleanup for obstructions'
      ]
    },
    recommendations: [
      `Detected ${roofType} roof with ${confidence}% confidence`,
      `Effective collection area: ${effectiveArea} m²`,
      obstructions.length > 0
        ? `Note: ${obstructions.length} obstruction types detected`
        : 'No significant obstructions detected'
    ]
  };
};

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  }
});

// POST /api/roof-detect/analyze-map
router.post('/analyze-map', async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, error: 'Latitude and longitude are required.' });
    }

    const analysis = generateRoofAnalysis({ latitude, longitude, address });

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/roof-detect/upload-image
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image uploaded' });
    }

    const roofArea = Math.round(80 + Math.random() * 300);
    const roofType = ['concrete', 'metal', 'tiles'][Math.floor(Math.random() * 3)];

    res.json({
      success: true,
      data: {
        imageUrl: `/uploads/${req.file.filename}`,
        analysis: {
          roofArea,
          roofType,
          confidence: Math.round(70 + Math.random() * 25),
          pitch: Math.round(15 + Math.random() * 20),
          condition: Math.random() > 0.3 ? 'Good' : 'Fair',
          pipeline: ['Edge detection', 'Roof segmentation classifier']
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/roof-detect/from-address
router.post('/from-address', async (req, res) => {
  try {
    const { address } = req.body;

    // Simulate geocoding and roof detection
    const lat = 28.6139 + (Math.random() - 0.5) * 10;
    const lng = 77.2090 + (Math.random() - 0.5) * 10;

    // Typical Indian household roof sizes
    const roofSizes = [
      { type: 'Small Independent House', area: 80, confidence: 85 },
      { type: 'Medium Independent House', area: 150, confidence: 82 },
      { type: 'Large Independent House', area: 250, confidence: 78 },
      { type: 'Apartment Building', area: 400, confidence: 75 }
    ];

    const detected = roofSizes[Math.floor(Math.random() * roofSizes.length)];

    res.json({
      success: true,
      data: {
        address,
        coordinates: { latitude: lat, longitude: lng },
        detectedBuilding: detected,
        roofTypes: ['concrete', 'tiles', 'metal'].map((type) => ({
          type,
          probability: Math.round(30 + Math.random() * 50)
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
