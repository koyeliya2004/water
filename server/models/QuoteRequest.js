const mongoose = require('mongoose');

const quoteRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'viewed', 'quoted', 'accepted', 'rejected', 'expired', 'cancelled'],
    default: 'pending',
  },
  requirements: {
    structureType: {
      type: String,
      enum: ['storage', 'recharge', 'combined'],
    },
    roofArea: Number,
    storageRequired: Number,
    propertyType: {
      type: String,
      enum: ['residential', 'commercial', 'industrial', 'institutional'],
    },
    location: {
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
    preferredTimeline: String,
    budget: Number,
    description: String,
  },
  assessmentData: {
    type: mongoose.Schema.Types.Mixed,
  },
  quote: {
    materials: [{
      item: String,
      quantity: Number,
      unit: String,
      rate: Number,
      amount: Number,
    }],
    labor: {
      skilled: { days: Number, rate: Number, amount: Number },
      unskilled: { days: Number, rate: Number, amount: Number },
    },
    total: Number,
    validUntil: Date,
    notes: String,
    timeline: String,
  },
  timeline: {
    respondedAt: Date,
    quotedAt: Date,
    acceptedAt: Date,
    rejectedAt: Date,
    completedAt: Date,
  },
  messages: [{
    from: {
      type: String,
      enum: ['user', 'vendor'],
    },
    message: String,
    sentAt: { type: Date, default: Date.now },
  }],
  notifications: {
    vendorNotified: { type: Boolean, default: false },
    userNotified: { type: Boolean, default: false },
  },
  userRating: Number,
  userFeedback: String,
}, {
  timestamps: true,
});

// Index for efficient queries
quoteRequestSchema.index({ userId: 1, createdAt: -1 });
quoteRequestSchema.index({ vendorId: 1, status: 1 });
quoteRequestSchema.index({ status: 1 });
quoteRequestSchema.index({ createdAt: -1 });

// Static method to get user's quote requests
quoteRequestSchema.statics.getUserQuotes = function(userId, status) {
  const query = { userId };
  if (status) query.status = status;
  return this.find(query)
    .populate('vendorId', 'name location rating services')
    .sort({ createdAt: -1 });
};

// Static method to get vendor's quote requests
quoteRequestSchema.statics.getVendorQuotes = function(vendorId, status) {
  const query = { vendorId };
  if (status) query.status = status;
  return this.find(query)
    .populate('userId', 'name location')
    .sort({ createdAt: -1 });
};

// Method to add message
quoteRequestSchema.methods.addMessage = function(from, message) {
  this.messages.push({ from, message });
  return this.save();
};

// Method to submit quote
quoteRequestSchema.methods.submitQuote = function(quoteData) {
  this.quote = quoteData;
  this.status = 'quoted';
  this.timeline.quotedAt = new Date();
  return this.save();
};

// Method to accept quote
quoteRequestSchema.methods.accept = function() {
  this.status = 'accepted';
  this.timeline.acceptedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('QuoteRequest', quoteRequestSchema);
