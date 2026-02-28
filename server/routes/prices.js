const express = require('express');
const router = express.Router();
const MaterialPrice = require('../models/MaterialPrice');

// Seed initial material prices
const seedMaterialPrices = async () => {
  const defaultMaterials = [
    { name: 'Rainwater Filter (Basic)', category: 'Filters', unit: 'piece', basePrice: 3500, quality: 'basic' },
    { name: 'Rainwater Filter (Advanced)', category: 'Filters', unit: 'piece', basePrice: 8500, quality: 'premium' },
    { name: 'Storage Tank (1000L)', category: 'Tanks', unit: 'piece', basePrice: 4500, quality: 'standard' },
    { name: 'Storage Tank (2000L)', category: 'Tanks', unit: 'piece', basePrice: 8000, quality: 'standard' },
    { name: 'Storage Tank (5000L)', category: 'Tanks', unit: 'piece', basePrice: 18000, quality: 'standard' },
    { name: 'PVC Pipes (3 inch)', category: 'Pipes', unit: 'meter', basePrice: 180, quality: 'standard' },
    { name: 'PVC Pipes (4 inch)', category: 'Pipes', unit: 'meter', basePrice: 250, quality: 'standard' },
    { name: 'Gutter System', category: 'Gutters', unit: 'meter', basePrice: 250, quality: 'standard' },
    { name: 'First Flush Diverter', category: 'Diverters', unit: 'piece', basePrice: 2200, quality: 'standard' },
    { name: 'Smart Water Level Monitor', category: 'IoT', unit: 'piece', basePrice: 4500, quality: 'premium' },
    { name: 'Submersible Pump (0.5HP)', category: 'Pumps', unit: 'piece', basePrice: 6500, quality: 'standard' },
    { name: 'Submersible Pump (1HP)', category: 'Pumps', unit: 'piece', basePrice: 9500, quality: 'standard' },
    { name: 'Ball Valve', category: 'Fittings', unit: 'piece', basePrice: 150, quality: 'basic' },
    { name: 'Elbow (3 inch)', category: 'Fittings', unit: 'piece', basePrice: 45, quality: 'basic' },
    { name: 'T-Joint (3 inch)', category: 'Fittings', unit: 'piece', basePrice: 55, quality: 'basic' },
    { name: 'Gravel (for recharge)', category: 'Materials', unit: 'cubic meter', basePrice: 1500, quality: 'standard' },
    { name: 'Sand', category: 'Materials', unit: 'cubic meter', basePrice: 800, quality: 'basic' },
    { name: 'Cement', category: 'Materials', unit: 'bag', basePrice: 400, quality: 'standard' },
    { name: 'Bricks', category: 'Materials', unit: 'piece', basePrice: 8, quality: 'basic' },
    { name: 'PVC Tank (10000L)', category: 'Tanks', unit: 'piece', basePrice: 35000, quality: 'standard' },
    { name: 'Stainless Steel Mesh Filter', category: 'Filters', unit: 'piece', basePrice: 5500, quality: 'premium' },
    { name: 'RO Membrane', category: 'Filters', unit: 'piece', basePrice: 3000, quality: 'premium' },
    { name: 'Charcoal Filter', category: 'Filters', unit: 'piece', basePrice: 1200, quality: 'standard' },
    { name: 'UV Filter', category: 'Filters', unit: 'piece', basePrice: 7500, quality: 'premium' },
    { name: 'Floating Suction Device', category: 'Fittings', unit: 'piece', basePrice: 350, quality: 'standard' },
  ];

  for (const material of defaultMaterials) {
    await MaterialPrice.findOneAndUpdate(
      { name: material.name },
      material,
      { upsert: true, new: true }
    );
  }
};

// Initialize seed data
seedMaterialPrices().catch(console.error);

// GET /api/prices/materials
router.get('/materials', async (req, res) => {
  try {
    const { category, state } = req.query;
    
    const query = { active: true };
    if (category) query.category = category;

    const materials = await MaterialPrice.find(query);

    const data = materials.map(m => ({
      name: m.name,
      category: m.category,
      unit: m.unit,
      basePrice: m.basePrice,
      statePrice: state ? m.getPriceForState(state) : m.basePrice,
      quality: m.quality,
      brand: m.brand,
      lastUpdated: m.lastUpdated,
      alternatives: m.alternatives,
    }));

    const categories = await MaterialPrice.distinct('category', { active: true });

    res.json({
      success: true,
      data,
      categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/prices/materials/:state
router.get('/materials/:state', async (req, res) => {
  try {
    const { state } = req.params;
    const materials = await MaterialPrice.getPricesForState(state);

    res.json({
      success: true,
      data: materials,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/prices/trends/:material
router.get('/trends/:material', async (req, res) => {
  try {
    const { material } = req.params;
    const { months = 6 } = req.query;

    const result = await MaterialPrice.getPriceTrends(material, parseInt(months));

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Material not found'
      });
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/prices/compare
router.post('/compare', async (req, res) => {
  try {
    const { materials, state } = req.body;

    if (!materials || !Array.isArray(materials)) {
      return res.status(400).json({
        success: false,
        error: 'Materials array is required'
      });
    }

    const result = await Promise.all(
      materials.map(async (item) => {
        const material = await MaterialPrice.findOne({ name: item.name });
        if (!material) return null;

        return {
          name: material.name,
          category: material.category,
          unit: material.unit,
          basePrice: material.basePrice,
          statePrice: state ? material.getPriceForState(state) : material.basePrice,
          alternatives: material.alternatives,
        };
      })
    );

    const filtered = result.filter(Boolean);

    const total = filtered.reduce((sum, item) => sum + (item.statePrice * (item.quantity || 1)), 0);

    res.json({
      success: true,
      data: {
        items: filtered,
        total,
        savings: filtered.reduce((sum, item) => {
          const alternativeSaving = item.alternatives?.reduce((altSum, alt) => {
            return altSum + (alt.price - item.statePrice);
          }, 0) || 0;
          return sum + alternativeSaving;
        }, 0),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/prices/recommendations
router.get('/recommendations', async (req, res) => {
  try {
    const { roofArea, state, budget } = req.query;

    const recommendations = {
      essential: [],
      recommended: [],
      optional: [],
    };

    // Essential materials for basic RTRWH
    const essentialMaterials = [
      'Rainwater Filter (Basic)',
      'Storage Tank (1000L)',
      'PVC Pipes (3 inch)',
      'Gutter System',
      'First Flush Diverter',
    ];

    // Recommended materials
    const recommendedMaterials = [
      'Ball Valve',
      'Elbow (3 inch)',
      'T-Joint (3 inch)',
    ];

    // Optional materials
    const optionalMaterials = [
      'Smart Water Level Monitor',
      'UV Filter',
      'Stainless Steel Mesh Filter',
    ];

    const getMaterialPrices = async (materialNames) => {
      return Promise.all(
        materialNames.map(async (name) => {
          const material = await MaterialPrice.findOne({ name });
          if (!material) return null;
          return {
            name: material.name,
            category: material.category,
            unit: material.unit,
            price: state ? material.getPriceForState(state) : material.basePrice,
            quality: material.quality,
          };
        })
      );
    };

    recommendations.essential = await getMaterialPrices(essentialMaterials);
    recommendations.recommended = await getMaterialPrices(recommendedMaterials);
    recommendations.optional = await getMaterialPrices(optionalMaterials);

    // Calculate totals
    const essentialTotal = recommendations.essential.reduce((sum, m) => sum + (m?.price || 0), 0);
    const recommendedTotal = recommendations.recommended.reduce((sum, m) => sum + (m?.price || 0), 0);
    const optionalTotal = recommendations.optional.reduce((sum, m) => sum + (m?.price || 0), 0);

    res.json({
      success: true,
      data: {
        recommendations,
        totals: {
          essential: essentialTotal,
          recommended: essentialTotal + recommendedTotal,
          full: essentialTotal + recommendedTotal + optionalTotal,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/prices/update
router.post('/update', async (req, res) => {
  try {
    const { materialName, state, price, source } = req.body;

    const material = await MaterialPrice.findOne({ name: materialName });

    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found'
      });
    }

    await material.updatePrice(state, price, source);

    res.json({
      success: true,
      data: {
        name: material.name,
        price: material.getPriceForState(state),
        lastUpdated: material.lastUpdated,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
