const mongoose = require('mongoose');

const subsidyApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  schemeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GovernmentScheme',
    required: true,
  },
  status: {
    type: String,
    enum: [
      'draft',
      'submitted',
      'under-review',
      'document-verification',
      'inspection-scheduled',
      'inspection-completed',
      'approved',
      'rejected',
      'disbursed',
      'closed',
    ],
    default: 'draft',
  },
  applicationId: {
    type: String,
    unique: true,
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: Date,
    verified: { type: Boolean, default: false },
    notes: String,
  }],
  formData: {
    propertyAddress: String,
    propertyType: String,
    area: Number,
    incomeGroup: String,
    bankAccount: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
    },
    previousRwhInstalled: Boolean,
    previousSchemeBenefited: Boolean,
  },
  timeline: {
    submittedAt: Date,
    documentVerificationAt: Date,
    inspectionScheduledAt: Date,
    inspectionCompletedAt: Date,
    approvedAt: Date,
    rejectedAt: Date,
    disbursedAt: Date,
  },
  inspection: {
    scheduledDate: Date,
    inspectorName: String,
    inspectorContact: String,
    report: String,
    result: {
      type: String,
      enum: ['pending', 'passed', 'failed'],
    },
  },
  approvedAmount: Number,
  disbursedAmount: Number,
  rejectionReason: String,
  notes: [{
    text: String,
    addedBy: {
      type: String,
      enum: ['user', 'admin', 'system'],
    },
    addedAt: { type: Date, default: Date.now },
  }],
  reminders: [{
    message: String,
    dueDate: Date,
    sentAt: Date,
    completed: { type: Boolean, default: false },
  }],
  tracking: {
    lastUpdated: Date,
    lastStatusChange: Date,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
subsidyApplicationSchema.index({ userId: 1, status: 1 });
subsidyApplicationSchema.index({ schemeId: 1, status: 1 });
subsidyApplicationSchema.index({ applicationId: 1 });
subsidyApplicationSchema.index({ createdAt: -1 });

// Generate application ID before saving
subsidyApplicationSchema.pre('save', function(next) {
  if (!this.applicationId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.applicationId = `SUB-${timestamp}-${random}`;
  }
  next();
});

// Static method to get user's applications
subsidyApplicationSchema.statics.getUserApplications = function(userId, status) {
  const query = { userId };
  if (status) query.status = status;
  return this.find(query)
    .populate('schemeId', 'name type amount department website')
    .sort({ createdAt: -1 });
};

// Method to add note
subsidyApplicationSchema.methods.addNote = function(text, addedBy) {
  this.notes.push({ text, addedBy });
  this.tracking.lastUpdated = new Date();
  return this.save();
};

// Method to update status
subsidyApplicationSchema.methods.updateStatus = function(newStatus, additionalData = {}) {
  this.status = newStatus;
  this.tracking.lastStatusChange = new Date();
  this.tracking.lastUpdated = new Date();

  switch (newStatus) {
    case 'submitted':
      this.timeline.submittedAt = new Date();
      break;
    case 'document-verification':
      this.timeline.documentVerificationAt = new Date();
      break;
    case 'inspection-scheduled':
      this.inspection.scheduledDate = additionalData.scheduledDate;
      this.inspection.inspectorName = additionalData.inspectorName;
      this.inspection.inspectorContact = additionalData.inspectorContact;
      this.timeline.inspectionScheduledAt = new Date();
      break;
    case 'inspection-completed':
      this.inspection.result = additionalData.result;
      this.inspection.report = additionalData.report;
      this.timeline.inspectionCompletedAt = new Date();
      break;
    case 'approved':
      this.approvedAmount = additionalData.approvedAmount;
      this.timeline.approvedAt = new Date();
      break;
    case 'rejected':
      this.rejectionReason = additionalData.reason;
      this.timeline.rejectedAt = new Date();
      break;
    case 'disbursed':
      this.disbursedAmount = additionalData.disbursedAmount;
      this.timeline.disbursedAt = new Date();
      break;
  }

  return this.save();
};

// Virtual for status progress
subsidyApplicationSchema.virtual('progress').get(function() {
  const progressMap = {
    'draft': 0,
    'submitted': 10,
    'under-review': 20,
    'document-verification': 30,
    'inspection-scheduled': 50,
    'inspection-completed': 70,
    'approved': 85,
    'disbursed': 100,
    'rejected': 0,
    'closed': 100,
  };
  return progressMap[this.status] || 0;
});

module.exports = mongoose.model('SubsidyApplication', subsidyApplicationSchema);
