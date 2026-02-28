const mongoose = require('mongoose');

const materialPriceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Filters',
      'Tanks',
      'Pipes',
      'Gutters',
      'Diverters',
      'Pumps',
      'IoT',
      'Fittings',
      'Materials',
      'Tools',
    ],
  },
  unit: {
    type: String,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  statePrices: {
    type: Map,
    of: {
      price: Number,
      lastUpdated: Date,
      source: String,
    },
  },
  priceHistory: [{
    date: Date,
    price: Number,
    source: String,
  }],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  source: {
    type: String,
    enum: ['manufacturer', 'wholesale', 'retail', 'market-survey'],
    default: 'market-survey',
  },
  seasonality: {
    peak: [Number],
    offPeak: [Number],
    priceVariation: Number,
  },
  quality: {
    type: String,
    enum: ['basic', 'standard', 'premium'],
    default: 'standard',
  },
  brand: String,
  model: String,
  specifications: mongoose.Schema.Types.Mixed,
  alternatives: [{
    name: String,
    price: Number,
    quality: String,
  }],
  notes: String,
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
materialPriceSchema.index({ category: 1 });
materialPriceSchema.index({ name: 'text' });
materialPriceSchema.index({ active: 1 });

// Method to get price for a state
materialPriceSchema.methods.getPriceForState = function(state) {
  if (!this.statePrices) return this.basePrice;
  
  const statePrice = this.statePrices.get(state.toLowerCase());
  if (statePrice) {
    return statePrice.price;
  }
  return this.basePrice;
};

// Method to update price
materialPriceSchema.methods.updatePrice = function(state, newPrice, source) {
  if (!this.statePrices) {
    this.statePrices = new Map();
  }
  
  this.statePrices.set(state.toLowerCase(), {
    price: newPrice,
    lastUpdated: new Date(),
    source,
  });
  
  this.lastUpdated = new Date();
  this.priceHistory.push({
    date: new Date(),
    price: newPrice,
    source,
  });
  
  return this.save();
};

// Static method to get all prices for a state
materialPriceSchema.statics.getPricesForState = function(state) {
  return this.find({ active: true }).then(materials => {
    return materials.map(m => ({
      name: m.name,
      category: m.category,
      unit: m.unit,
      price: m.getPriceForState(state),
      basePrice: m.basePrice,
      lastUpdated: m.lastUpdated,
    }));
  });
};

// Static method to get price trends
materialPriceSchema.statics.getPriceTrends = function(materialName, months = 6) {
  return this.findOne({ name: materialName }).then(material => {
    if (!material) return null;
    
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);
    
    const history = material.priceHistory.filter(p => p.date >= cutoffDate);
    
    return {
      material: material.name,
      currentPrice: material.basePrice,
      trend: history,
      average: history.length > 0 
        ? history.reduce((sum, p) => sum + p.price, 0) / history.length 
        : material.basePrice,
      min: history.length > 0 
        ? Math.min(...history.map(p => p.price)) 
        : material.basePrice,
      max: history.length > 0 
        ? Math.max(...history.map(p => p.price)) 
        : material.basePrice,
    };
  });
};

module.exports = mongoose.model('MaterialPrice', materialPriceSchema);
