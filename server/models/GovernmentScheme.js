const mongoose = require('mongoose');

const governmentSchemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['central', 'state', 'municipal', 'corporation'],
    required: true,
  },
  ministry: String,
  department: String,
  state: String,
  district: String,
  subsidyType: {
    type: String,
    enum: ['fixed', 'percentage', 'rebate', 'loan', 'grant'],
    required: true,
  },
  amount: {
    min: Number,
    max: Number,
    percentage: Number,
    description: String,
  },
  eligibilityCriteria: [{
    propertyType: [String],
    incomeGroup: [String],
    area: { min: Number, max: Number },
    location: [String],
    previousScheme: Boolean,
    otherConditions: [String],
  }],
  documents: [{
    name: String,
    required: { type: Boolean, default: true },
    description: String,
  }],
  deadline: {
    type: String,
    enum: ['ongoing', 'annual', 'quarterly', 'specific-date'],
  },
  specificDate: Date,
  website: String,
  helpline: String,
  email: String,
  applicationProcess: {
    mode: ['online', 'offline', 'both'],
    portal: String,
    office: String,
    steps: [String],
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'suspended', 'discontinued'],
    default: 'active',
  },
  category: [{
    type: String,
    enum: [
      'residential',
      'commercial',
      'agricultural',
      'industrial',
      'institutional',
      'community',
      'government',
    ],
  }],
  keywords: [String],
  benefits: [String],
  restrictions: [String],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  source: String,
  popularity: {
    applications: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
  },
  region: {
    coverage: {
      type: String,
      enum: ['national', 'state-wide', 'district-specific', 'city-specific'],
    },
    cities: [String],
  },
  implementation: {
    implementingAgency: String,
    disbursementMode: String,
    timeline: String,
  },
}, {
  timestamps: true,
});

// Indexes for efficient queries
governmentSchemeSchema.index({ state: 1, status: 1 });
governmentSchemeSchema.index({ type: 1, status: 1 });
governmentSchemeSchema.index({ category: 1 });
governmentSchemeSchema.index({ 'eligibilityCriteria.propertyType': 1 });
governmentSchemeSchema.index({ keywords: 1 });

// Virtual for formatted amount
governmentSchemeSchema.virtual('formattedAmount').get(function() {
  if (this.amount.percentage) {
    return `Up to ${this.amount.percentage}%`;
  }
  if (this.amount.min && this.amount.max) {
    return `₹${this.amount.min.toLocaleString()} - ₹${this.amount.max.toLocaleString()}`;
  }
  if (this.amount.min) {
    return `₹${this.amount.min.toLocaleString()} minimum`;
  }
  return this.amount.description || 'Variable';
});

// Method to check eligibility
governmentSchemeSchema.methods.checkEligibility = function(userProfile) {
  const results = {
    eligible: true,
    reasons: [],
    missingDocuments: [],
  };

  for (const criteria of this.eligibilityCriteria) {
    // Check property type
    if (criteria.propertyType && criteria.propertyType.length > 0) {
      if (!criteria.propertyType.includes(userProfile.propertyType)) {
        results.eligible = false;
        results.reasons.push(`Property type '${userProfile.propertyType}' not eligible`);
      }
    }

    // Check income group
    if (criteria.incomeGroup && criteria.incomeGroup.length > 0) {
      if (!criteria.incomeGroup.includes(userProfile.incomeGroup)) {
        results.eligible = false;
        results.reasons.push(`Income group not eligible`);
      }
    }

    // Check area
    if (criteria.area) {
      if (userProfile.area < criteria.area.min) {
        results.eligible = false;
        results.reasons.push(`Area below minimum requirement of ${criteria.area.min} sq ft`);
      }
    }
  }

  // Check required documents
  for (const doc of this.documents) {
    if (doc.required && !userProfile.documents.includes(doc.name)) {
      results.missingDocuments.push(doc.name);
    }
  }

  return results;
};

// Static method to find schemes by state
governmentSchemeSchema.statics.findByState = function(state, category) {
  const query = {
    $or: [
      { state: { $regex: new RegExp(`^${state}$`, 'i') } },
      { 'region.coverage': 'national' },
    ],
    status: 'active',
  };

  if (category) {
    query.category = category;
  }

  return this.find(query);
};

// Static method to search schemes
governmentSchemeSchema.statics.search = function(searchText) {
  return this.find({
    $or: [
      { name: { $regex: searchText, $options: 'i' } },
      { keywords: { $in: [new RegExp(searchText, 'i')] } },
      { description: { $regex: searchText, $options: 'i' } },
    ],
    status: 'active',
  });
};

module.exports = mongoose.model('GovernmentScheme', governmentSchemeSchema);
