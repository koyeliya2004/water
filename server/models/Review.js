const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    maxlength: 100,
  },
  comment: {
    type: String,
    maxlength: 1000,
  },
  aspects: {
    quality: { type: Number, min: 1, max: 5 },
    professionalism: { type: Number, min: 1, max: 5 },
    timeliness: { type: Number, min: 1, max: 5 },
    valueForMoney: { type: Number, min: 1, max: 5 },
  },
  project: {
    type: {
      type: String,
      enum: ['RTRWH Installation', 'Maintenance', 'Consulting', 'Recharge Pit', 'Other'],
    },
    location: String,
    completedDate: Date,
    cost: Number,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: Date,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: 'pending',
  },
  helpful: {
    type: Number,
    default: 0,
  },
  images: [String],
  response: {
    message: String,
    respondedAt: Date,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
reviewSchema.index({ vendorId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ rating: -1 });

// Static method to get average rating for a vendor
reviewSchema.statics.getAverageRating = async function(vendorId) {
  const result = await this.aggregate([
    { $match: { vendorId: new mongoose.Types.ObjectId(vendorId), status: 'approved' } },
    {
      $group: {
        _id: '$vendorId',
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 },
        avgQuality: { $avg: '$aspects.quality' },
        avgProfessionalism: { $avg: '$aspects.professionalism' },
        avgTimeliness: { $avg: '$aspects.timeliness' },
        avgValueForMoney: { $avg: '$aspects.valueForMoney' },
      },
    },
  ]);
  
  return result[0] || { averageRating: 0, count: 0 };
};

// Method to mark as helpful
reviewSchema.methods.markHelpful = function() {
  this.helpful += 1;
  return this.save();
};

module.exports = mongoose.model('Review', reviewSchema);
