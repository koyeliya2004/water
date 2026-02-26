const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
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
    
    // Simulate CV analysis of satellite imagery
    // In production, this would integrate with Google Maps Static API and a CV model
    
    // Simulate roof detection results
    const roofArea = Math.round(50 + Math.random() * 200); // sq meters
    const roofType = ['concrete', 'metal', 'tiles'][Math.floor(Math.random() * 3)];
    const confidence = Math.round(75 + Math.random() * 20);
    
    // Detect obstructions
    const obstructions = [
      { type: 'AC Unit', count: Math.floor(Math.random() * 3), areaReduction: 2 },
      { type: 'Water Tank', count: Math.floor(Math.random() * 2), areaReduction: 5 },
      { type: 'Chimney', count: Math.floor(Math.random() * 2), areaReduction: 1 }
    ].filter(o => o.count > 0);
    
    const totalObstructionArea = obstructions.reduce((sum, o) => sum + (o.count * o.areaReduction), 0);
    const effectiveArea = Math.max(10, roofArea - totalObstructionArea);
    
    // Generate segmentation mask (simplified)
    const segmentationData = {
      roofBoundary: [
        { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 80 }, { x: 0, y: 80 }
      ],
      obstructions: obstructions.map((obs, idx) => ({
        id: idx,
        type: obs.type,
        position: { x: 20 + idx * 25, y: 20 },
        size: { width: 10, height: 10 }
      }))
    };

    res.json({
      success: true,
      data: {
        location: { latitude, longitude, address },
        analysis: {
          totalRoofArea: roofArea,
          effectiveArea: effectiveArea,
          roofType: roofType,
          confidence: confidence,
          obstructions: obstructions,
          obstructionArea: totalObstructionArea,
          segmentation: segmentationData
        },
        recommendations: [
          `Detected ${roofType} roof with ${confidence}% confidence`,
          `Effective collection area: ${effectiveArea} m²`,
          obstructions.length > 0 
            ? `Note: ${obstructions.length} types of obstructions detected`
            : 'No significant obstructions detected'
        ]
      }
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
    
    // Simulate CV analysis on uploaded image
    const roofArea = Math.round(80 + Math.random() * 300);
    const roofType = ['concrete', 'metal', 'tiles'][Math.floor(Math.random() * 3)];
    
    res.json({
      success: true,
      data: {
        imageUrl: `/uploads/${req.file.filename}`,
        analysis: {
          roofArea: roofArea,
          roofType: roofType,
          confidence: Math.round(70 + Math.random() * 25),
          pitch: Math.round(15 + Math.random() * 20),
          condition: Math.random() > 0.3 ? 'Good' : 'Fair'
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
        roofTypes: ['concrete', 'tiles', 'metal'].map(type => ({
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
