const mongoose = require('mongoose');

const implementationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assessmentId: String,
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['DIY', 'vendor'],
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
  },
  quoteRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuoteRequest',
  },
  status: {
    type: String,
    enum: [
      'planning',
      'materials-procurement',
      'in-progress',
      'completed',
      'verified',
      'maintenance',
      'abandoned',
    ],
    default: 'planning',
  },
  checklist: [{
    id: String,
    title: String,
    description: String,
    completed: { type: Boolean, default: false },
    completedAt: Date,
    order: Number,
    category: {
      type: String,
      enum: ['preparation', 'installation', 'testing', 'documentation', 'maintenance'],
    },
  }],
  photos: [{
    url: String,
    caption: String,
    uploadedAt: { type: Date, default: Date.now },
    stage: String,
  }],
  videos: [{
    url: String,
    description: String,
    uploadedAt: { type: Date, default: Date.now },
  }],
  startDate: Date,
  estimatedCompletion: Date,
  actualCompletion: Date,
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
  },
  specifications: {
    structureType: String,
    storageCapacity: Number,
    rechargeCapacity: Number,
    roofArea: Number,
    components: [String],
  },
  costs: {
    materials: Number,
    labor: Number,
    total: Number,
    vendorPaid: { type: Boolean, default: false },
  },
  notes: [{
    text: String,
    addedAt: { type: Date, default: Date.now },
  }],
  credits: {
    awarded: { type: Boolean, default: false },
    amount: Number,
    awardedAt: Date,
  },
  verification: {
    verified: { type: Boolean, default: false },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: Date,
    method: {
      type: String,
      enum: ['photo', 'video', 'inspection', 'vendor-certification'],
    },
    notes: String,
  },
  maintenance: {
    lastServiceDate: Date,
    nextServiceDate: Date,
    serviceHistory: [{
      date: Date,
      type: String,
      notes: String,
      cost: Number,
    }],
  },
  issues: [{
    description: String,
    reportedAt: Date,
    resolved: { type: Boolean, default: false },
    resolution: String,
  }],
  sharing: {
    isPublic: { type: Boolean, default: false },
    showOnLeaderboard: { type: Boolean, default: true },
  },
}, {
  timestamps: true,
});

// Indexes
implementationSchema.index({ userId: 1, status: 1 });
implementationSchema.index({ status: 1 });
implementationSchema.index({ 'credits.awarded': 1 });
implementationSchema.index({ createdAt: -1 });

// Static method to get user's implementations
implementationSchema.statics.getUserImplementations = function(userId) {
  return this.find({ userId })
    .populate('vendorId', 'name rating location')
    .sort({ createdAt: -1 });
};

// Static method to get public implementations
implementationSchema.statics.getPublicImplementations = function(limit = 20, skip = 0) {
  return this.find({ 'sharing.isPublic': true, status: { $in: ['completed', 'verified'] } })
    .populate('userId', 'name avatar')
    .populate('vendorId', 'name rating')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Method to add checklist item
implementationSchema.methods.addChecklistItem = function(item) {
  const id = `item-${Date.now()}`;
  this.checklist.push({
    id,
    ...item,
    order: this.checklist.length + 1,
  });
  return this.save();
};

// Method to update checklist item
implementationSchema.methods.updateChecklistItem = function(itemId, updates) {
  const item = this.checklist.id(itemId);
  if (item) {
    Object.assign(item, updates);
    if (updates.completed) {
      item.completedAt = new Date();
    }
  }
  return this.save();
};

// Method to add photo
implementationSchema.methods.addPhoto = function(url, caption, stage) {
  this.photos.push({ url, caption, stage });
  return this.save();
};

// Method to mark as complete
implementationSchema.methods.markComplete = function(verificationData = {}) {
  this.status = 'completed';
  this.actualCompletion = new Date();
  this.verification = {
    verified: verificationData.verified || false,
    method: verificationData.method,
    notes: verificationData.notes,
  };
  return this.save();
};

// Method to award credits
implementationSchema.methods.awardCredits = async function(amount) {
  if (!this.credits.awarded) {
    const User = mongoose.model('User');
    await User.findByIdAndUpdate(this.userId, {
      $inc: {
        'credits.total': amount,
        'credits.lifetime': amount,
        'credits.allTime': amount,
        'stats.structuresImplemented': 1,
      },
    });

    this.credits = {
      awarded: true,
      amount,
      awardedAt: new Date(),
    };

    return this.save();
  }
  return this;
};

// Virtual for completion percentage
implementationSchema.virtual('completionPercentage').get(function() {
  if (this.checklist.length === 0) return 0;
  const completed = this.checklist.filter(item => item.completed).length;
  return Math.round((completed / this.checklist.length) * 100);
});

// Default checklist template
implementationSchema.statics.getDefaultChecklist = function(type) {
  const diyChecklist = [
    { title: 'Site Assessment', description: 'Verify roof area and structure', category: 'preparation', order: 1 },
    { title: 'Design Finalization', description: 'Finalize system design and specifications', category: 'preparation', order: 2 },
    { title: 'Material Procurement', description: 'Purchase all required materials', category: 'materials-procurement', order: 3 },
    { title: 'Gutter Installation', description: 'Install gutters along roof edges', category: 'installation', order: 4 },
    { title: 'Downpipe Setup', description: 'Connect downpipes to gutters', category: 'installation', order: 5 },
    { title: 'Filter Installation', description: 'Install first flush diverter and filter', category: 'installation', order: 6 },
    { title: 'Storage Tank Setup', description: 'Position and connect storage tank', category: 'installation', order: 7 },
    { title: 'Recharge Structure', description: 'Excavate and construct recharge pit/trench', category: 'installation', order: 8 },
    { title: 'Overflow Management', description: 'Connect overflow to recharge structure', category: 'installation', order: 9 },
    { title: 'System Testing', description: 'Test the complete system with water', category: 'testing', order: 10 },
    { title: 'Documentation', description: 'Take photos and document the installation', category: 'documentation', order: 11 },
    { title: 'Initial Maintenance', description: 'Set up maintenance schedule', category: 'maintenance', order: 12 },
  ];

  const vendorChecklist = [
    { title: 'Vendor Selection', description: 'Choose and hire a vendor', category: 'preparation', order: 1 },
    { title: 'Site Assessment', description: 'Vendor conducts site visit', category: 'preparation', order: 2 },
    { title: 'Contract Signing', description: 'Sign agreement with vendor', category: 'preparation', order: 3 },
    { title: 'Material Procurement', description: 'Vendor procures materials', category: 'materials-procurement', order: 4 },
    { title: 'Installation', description: 'Vendor installs the system', category: 'installation', order: 5 },
    { title: 'Testing', description: 'Test the system', category: 'testing', order: 6 },
    { title: 'Inspection', description: 'Inspect completed installation', category: 'testing', order: 7 },
    { title: 'Documentation', description: 'Collect all documents and photos', category: 'documentation', order: 8 },
    { title: 'Maintenance Setup', description: 'Set up maintenance schedule', category: 'maintenance', order: 9 },
  ];

  return type === 'vendor' ? vendorChecklist : diyChecklist;
};

module.exports = mongoose.model('Implementation', implementationSchema);
