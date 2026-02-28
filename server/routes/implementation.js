const express = require('express');
const router = express.Router();
const Implementation = require('../models/Implementation');
const auth = require('../middleware/auth');
const User = require('../models/User');

// POST /api/implementation/start
router.post('/start', auth, async (req, res) => {
  try {
    const {
      title,
      type,
      vendorId,
      quoteRequestId,
      assessmentId,
      assessmentData,
      startDate,
      estimatedCompletion,
      location,
      specifications,
    } = req.body;

    const implementation = new Implementation({
      userId: req.user.id,
      title,
      type,
      vendorId,
      quoteRequestId,
      assessmentId,
      specifications,
      location,
      startDate: startDate || new Date(),
      estimatedCompletion,
    });

    // Add default checklist based on type
    const defaultChecklist = Implementation.getDefaultChecklist(type);
    defaultChecklist.forEach(item => {
      implementation.checklist.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...item,
      });
    });

    await implementation.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'stats.assessmentsCompleted': 1 },
    });

    res.status(201).json({
      success: true,
      data: implementation,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/implementation/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const implementation = await Implementation.findOne({
      _id: req.params.id,
      userId: req.user.id,
    })
      .populate('vendorId', 'name rating location services phone email')
      .populate('userId', 'name avatar');

    if (!implementation) {
      return res.status(404).json({
        success: false,
        error: 'Implementation not found'
      });
    }

    res.json({
      success: true,
      data: implementation,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/implementation/user
router.get('/user/all', auth, async (req, res) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;
    
    const query = { userId: req.user.id };
    if (status) query.status = status;

    const implementations = await Implementation.find(query)
      .populate('vendorId', 'name rating location')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Implementation.countDocuments(query);

    res.json({
      success: true,
      data: {
        implementations,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/implementation/user/current
router.get('/user/current', auth, async (req, res) => {
  try {
    const implementation = await Implementation.findOne({
      userId: req.user.id,
      status: { $nin: ['completed', 'verified', 'abandoned'] },
    })
      .populate('vendorId', 'name rating location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: implementation,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/implementation/:id/checklist
router.put('/:id/checklist', auth, async (req, res) => {
  try {
    const { itemId, completed } = req.body;

    const implementation = await Implementation.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!implementation) {
      return res.status(404).json({
        success: false,
        error: 'Implementation not found'
      });
    }

    const item = implementation.checklist.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Checklist item not found'
      });
    }

    item.completed = completed;
    if (completed) {
      item.completedAt = new Date();
    }

    await implementation.save();

    res.json({
      success: true,
      data: {
        item,
        completionPercentage: implementation.completionPercentage,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/implementation/:id/photo
router.post('/:id/photo', auth, async (req, res) => {
  try {
    const { url, caption, stage } = req.body;

    const implementation = await Implementation.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!implementation) {
      return res.status(404).json({
        success: false,
        error: 'Implementation not found'
      });
    }

    implementation.photos.push({ url, caption, stage });
    await implementation.save();

    res.json({
      success: true,
      data: implementation.photos,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/implementation/:id/note
router.post('/:id/note', auth, async (req, res) => {
  try {
    const { text } = req.body;

    const implementation = await Implementation.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!implementation) {
      return res.status(404).json({
        success: false,
        error: 'Implementation not found'
      });
    }

    implementation.notes.push({ text });
    await implementation.save();

    res.json({
      success: true,
      data: implementation.notes,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/implementation/:id/status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    const implementation = await Implementation.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!implementation) {
      return res.status(404).json({
        success: false,
        error: 'Implementation not found'
      });
    }

    implementation.status = status;
    
    if (status === 'in-progress' && !implementation.startDate) {
      implementation.startDate = new Date();
    }

    await implementation.save();

    res.json({
      success: true,
      data: implementation,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/implementation/:id/complete
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const { verification } = req.body;

    const implementation = await Implementation.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!implementation) {
      return res.status(404).json({
        success: false,
        error: 'Implementation not found'
      });
    }

    implementation.status = 'completed';
    implementation.actualCompletion = new Date();
    
    if (verification) {
      implementation.verification = {
        verified: verification.verified || false,
        method: verification.method,
        notes: verification.notes,
      };
    }

    // Award credits for completion
    const creditsAmount = implementation.type === 'DIY' ? 200 : 100;
    await implementation.awardCredits(creditsAmount);

    res.json({
      success: true,
      data: implementation,
      creditsAwarded: creditsAmount,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/implementation/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const implementation = await Implementation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
      status: { $in: ['planning', 'materials-procurement'] },
    });

    if (!implementation) {
      return res.status(404).json({
        success: false,
        error: 'Implementation not found or cannot be deleted'
      });
    }

    res.json({
      success: true,
      data: { message: 'Implementation deleted successfully' },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/implementation/public
router.get('/public/all', async (req, res) => {
  try {
    const { limit = 20, skip = 0, state } = req.query;
    
    const query = { 
      'sharing.isPublic': true, 
      status: { $in: ['completed', 'verified'] } 
    };
    
    if (state) {
      query['location.state'] = state;
    }

    const implementations = await Implementation.find(query)
      .populate('userId', 'name avatar')
      .populate('vendorId', 'name rating')
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Implementation.countDocuments(query);

    res.json({
      success: true,
      data: {
        implementations,
        total,
        hasMore: parseInt(skip) + implementations.length < total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
