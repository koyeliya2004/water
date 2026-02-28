const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  services: [{
    type: String,
    enum: [
      'RTRWH Installation',
      'Recharge Pit Construction',
      'Maintenance',
      'Consulting',
      'Filter Systems',
      'Tank Cleaning',
      'Government Projects',
      'Community RWH',
      'Smart Monitoring'
    ],
  }],
  certifications: [{
    name: String,
    issuedBy: String,
    validUntil: Date,
    documentUrl: String,
  }],
  verified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  completedProjects: {
    type: Number,
    default: 0,
  },
  priceRange: {
    type: String,
    enum: ['Budget', 'Medium', 'Premium'],
    default: 'Medium',
  },
  portfolio: [{
    title: String,
    description: String,
    images: [String],
    location: String,
    completedDate: Date,
    capacity: Number,
  }],
  workingAreas: [{
    city: String,
    state: String,
    radius: Number,
  }],
  businessHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String },
  },
  documents: {
    gstCertificate: String,
    idProof: String,
    addressProof: String,
    workSamples: [String],
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolderName: String,
  },
  workingRadius: {
    type: Number,
    default: 50,
  },
  experience: {
    type: Number,
    default: 0,
  },
  specialties: [String],
  equipment: [String],
  teamSize: {
    type: Number,
    default: 1,
  },
  insurance: {
    covered: { type: Boolean, default: false },
    provider: String,
    validUntil: Date,
  },
  warranty: {
    offered: { type: Boolean, default: true },
    period: Number,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  },
  stats: {
    quotesSent: { type: Number, default: 0 },
    quotesAccepted: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    responseTime: { type: Number, default: 24 },
  },
}, {
  timestamps: true,
});

// Index for geospatial queries
vendorSchema.index({ 'location.coordinates': '2dsphere' });
vendorSchema.index({ 'location.state': 1 });
vendorSchema.index({ 'location.city': 1 });
vendorSchema.index({ verified: 1 });
vendorSchema.index({ rating: -1 });

// Virtual for average response time display
vendorSchema.virtual('averageResponseTime').get(function() {
  return `${this.stats.responseTime} hours`;
});

// Method to calculate rating
vendorSchema.methods.calculateRating = async function() {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ vendorId: this._id });
  
  if (reviews.length === 0) return 0;
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating = totalRating / reviews.length;
  this.reviewCount = reviews.length;
  return this.save();
};

// Method to check if available for location
vendorSchema.methods.isAvailableForLocation = function(city, state) {
  if (this.location.state.toLowerCase() !== state.toLowerCase()) {
    return false;
  }
  
  const area = this.workingAreas.find(
    a => a.city.toLowerCase() === city.toLowerCase() && a.state.toLowerCase() === state.toLowerCase()
  );
  
  return area !== undefined || this.workingAreas.length === 0;
};

// Method to update stats
vendorSchema.methods.updateStats = async function(quoteAccepted = false) {
  if (quoteAccepted) {
    this.stats.quotesAccepted += 1;
    this.completedProjects += 1;
  }
  return this.save();
};

// Static method to find nearby vendors
vendorSchema.statics.findNearby = function(lat, lng, radiusKm = 50) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        $maxDistance: radiusKm * 1000,
      },
    },
    verified: true,
    status: 'active',
  });
};

module.exports = mongoose.model('Vendor', vendorSchema);
