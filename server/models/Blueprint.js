const mongoose = require('mongoose');

const blueprintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['storage', 'recharge', 'combined', 'smart'],
    required: true,
  },
  structureType: {
    type: String,
    enum: ['tank', 'pit', 'trench', 'well', 'combined'],
  },
  description: String,
  language: {
    type: String,
    enum: ['en', 'hi', 'te', 'kn', 'ta', 'mr', 'gu', 'ml'],
    default: 'en',
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium',
  },
  estimatedTime: {
    value: Number,
    unit: {
      type: String,
      enum: ['hours', 'days'],
      default: 'days',
    },
  },
  steps: [{
    order: Number,
    title: String,
    description: String,
    tips: [String],
    warnings: [String],
    images: [String],
    videoUrl: String,
    duration: Number,
  }],
  materials: [{
    item: String,
    quantity: Number,
    unit: String,
    alternatives: [{
      name: String,
      quantity: Number,
      notes: String,
    }],
    optional: { type: Boolean, default: false },
  }],
  tools: [{
    name: String,
    required: { type: Boolean, default: true },
    rental: { type: Boolean, default: false },
    rentalLocations: [{
      name: String,
      address: String,
      phone: String,
      rentPerDay: Number,
    }],
  }],
  diagrams: [{
    title: String,
    type: {
      type: String,
      enum: ['overview', 'cross-section', 'detail', 'wiring', 'plumbing'],
    },
    url: String,
    description: String,
  }],
  safetyGuidelines: [{
    title: String,
    description: String,
    icon: String,
    mandatory: { type: Boolean, default: true },
  }],
  cost: {
    estimated: Number,
    range: {
      min: Number,
      max: Number,
    },
    breakdown: [{
      category: String,
      amount: Number,
    }],
  },
  capacity: {
    minRoofArea: Number,
    maxRoofArea: Number,
    minStorage: Number,
    maxStorage: Number,
  },
  prerequisites: [String],
  certifications: [String],
  weatherConsiderations: {
    optimal: [String],
    avoid: [String],
  },
  regional: {
    suitableFor: [String],
    modifications: mongoose.Schema.Types.Mixed,
  },
  popularity: {
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  tags: [String],
  author: {
    name: String,
    organization: String,
  },
  version: String,
  verified: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
blueprintSchema.index({ type: 1, active: 1 });
blueprintSchema.index({ language: 1 });
blueprintSchema.index({ difficulty: 1 });
blueprintSchema.index({ tags: 1 });

// Method to increment view count
blueprintSchema.methods.incrementViews = function() {
  this.popularity.views += 1;
  return this.save();
};

// Method to increment download count
blueprintSchema.methods.incrementDownloads = function() {
  this.popularity.downloads += 1;
  return this.save();
};

// Method to add rating
blueprintSchema.methods.addRating = function(rating) {
  const currentTotal = this.popularity.ratings.average * this.popularity.ratings.count;
  this.popularity.ratings.count += 1;
  this.popularity.ratings.average = (currentTotal + rating) / this.popularity.ratings.count;
  return this.save();
};

// Static method to get blueprints by type
blueprintSchema.statics.getByType = function(type, language = 'en') {
  return this.find({ type, language, active: true })
    .sort({ 'popularity.downloads': -1 });
};

// Static method to search blueprints
blueprintSchema.statics.search = function(query, filters = {}) {
  const searchQuery = { active: true };
  
  if (filters.type) searchQuery.type = filters.type;
  if (filters.difficulty) searchQuery.difficulty = filters.difficulty;
  if (filters.language) searchQuery.language = filters.language;
  
  if (query) {
    searchQuery.$or = [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } },
    ];
  }
  
  return this.find(searchQuery)
    .sort({ 'popularity.downloads': -1 });
};

module.exports = mongoose.model('Blueprint', blueprintSchema);
