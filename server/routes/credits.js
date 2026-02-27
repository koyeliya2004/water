const express = require('express');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Credit calculation rules
const CREDIT_RATES = {
  perLiter: 0.1, // 1 credit per 10 liters
  verifiedMultiplier: 2, // 2x for verified installations
  streakBonus: {
    7: 50,
    14: 100,
    30: 200,
    60: 500,
    100: 1000,
  },
  referralBonus: 100,
  assessmentBonus: 50,
  challengeBonus: 200,
};

// GET /api/credits/balance - Get user's credit balance
router.get('/balance', auth, async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      success: true,
      data: {
        credits: user.credits,
        tier: user.tier,
        tierProgress: calculateTierProgress(user.credits.lifetime),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper function to calculate tier progress
function calculateTierProgress(lifetime) {
  const tiers = [
    { name: 'bronze', min: 0, max: 4999 },
    { name: 'silver', min: 5000, max: 19999 },
    { name: 'gold', min: 20000, max: 49999 },
    { name: 'platinum', min: 50000, max: Infinity },
  ];

  const currentTier = tiers.find(t => lifetime >= t.min && lifetime <= t.max);
  const nextTier = tiers[tiers.indexOf(currentTier) + 1];
  
  if (!nextTier) {
    return {
      current: currentTier.name,
      next: null,
      progress: 100,
      remaining: 0,
    };
  }

  const progress = Math.round(((lifetime - currentTier.min) / (nextTier.min - currentTier.min)) * 100);
  const remaining = nextTier.min - lifetime;

  return {
    current: currentTier.name,
    next: nextTier.name,
    progress: Math.min(progress, 100),
    remaining: Math.max(remaining, 0),
    nextTierMin: nextTier.min,
  };
}

// GET /api/credits/history - Get credit transaction history
router.get('/history', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ 
      user: req.user._id,
      type: { $in: ['credits_earned', 'assessment_completed', 'challenge_completed', 'referral_made', 'streak_updated'] }
    })
    .sort({ createdAt: -1 })
    .limit(50);

    const history = activities.map(activity => ({
      id: activity._id,
      type: activity.type,
      credits: activity.data?.creditsEarned || 0,
      description: getCreditDescription(activity),
      timestamp: activity.createdAt,
    }));

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

function getCreditDescription(activity) {
  switch (activity.type) {
    case 'credits_earned':
      return `Earned from water harvest`;
    case 'assessment_completed':
      return `Assessment completed`;
    case 'challenge_completed':
      return `Challenge completed: ${activity.data?.challengeId || 'Bonus'}`;
    case 'referral_made':
      return `Referral bonus`;
    case 'streak_updated':
      return `${activity.data?.streakDays} day streak bonus`;
    default:
      return 'Credit adjustment';
  }
}

// POST /api/credits/earn - Earn credits from actions
router.post('/earn', auth, async (req, res) => {
  try {
    const { type, amount, litrage, verified, description } = req.body;
    const user = req.user;

    let creditsEarned = 0;

    switch (type) {
      case 'harvest':
        // Calculate based on liters
        const baseCredits = Math.floor((litrage || 0) / 10);
        const multiplier = verified ? CREDIT_RATES.verifiedMultiplier : 1;
        creditsEarned = baseCredits * multiplier;
        
        user.credits.total += creditsEarned;
        user.credits.lifetime += creditsEarned;
        user.credits.monthly += creditsEarned;
        user.stats.litersRecharged += litrage || 0;
        break;

      case 'assessment':
        creditsEarned = CREDIT_RATES.assessmentBonus;
        user.credits.total += creditsEarned;
        user.credits.lifetime += creditsEarned;
        user.credits.monthly += creditsEarned;
        user.stats.assessmentsCompleted += 1;
        break;

      case 'referral':
        creditsEarned = CREDIT_RATES.referralBonus;
        user.credits.total += creditsEarned;
        user.credits.lifetime += creditsEarned;
        user.credits.monthly += creditsEarned;
        user.stats.referrals += 1;
        break;

      case 'streak':
        const streakDays = req.body.streakDays || 0;
        creditsEarned = CREDIT_RATES.streakBonus[streakDays] || 0;
        if (creditsEarned > 0) {
          user.credits.total += creditsEarned;
          user.credits.lifetime += creditsEarned;
          user.credits.monthly += creditsEarned;
        }
        break;

      case 'challenge':
        creditsEarned = amount || CREDIT_RATES.challengeBonus;
        user.credits.total += creditsEarned;
        user.credits.lifetime += creditsEarned;
        user.credits.monthly += creditsEarned;
        break;

      default:
        if (amount) {
          creditsEarned = amount;
          user.credits.total += creditsEarned;
          user.credits.lifetime += creditsEarned;
          user.credits.monthly += creditsEarned;
        }
    }

    // Update tier
    user.tier = user.calculateTier();

    // Update streak
    const today = new Date();
    const lastActivity = user.streaks.lastActivityDate ? new Date(user.streaks.lastActivityDate) : null;
    
    if (!lastActivity) {
      user.streaks.current = 1;
    } else {
      const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) {
        user.streaks.current += 1;
      } else if (daysDiff > 1) {
        user.streaks.current = 1;
      }
    }
    
    user.streaks.lastActivityDate = today;
    if (user.streaks.current > user.streaks.longest) {
      user.streaks.longest = user.streaks.current;
    }

    await user.save();

    // Log activity
    await Activity.create({
      user: user._id,
      type: 'credits_earned',
      data: {
        creditsEarned,
        litrage: litrage || 0,
        description: description || `${type} activity`,
      },
    });

    res.json({
      success: true,
      data: {
        creditsEarned,
        totalCredits: user.credits.total,
        tier: user.tier,
        streak: user.streaks.current,
        message: `You earned ${creditsEarned} water credits!`,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/credits/tier-progress - Get tier progression info
router.get('/tier-progress', auth, async (req, res) => {
  try {
    const user = req.user;
    const progress = calculateTierProgress(user.credits.lifetime);

    const tierBenefits = {
      bronze: [
        'Basic leaderboard access',
        'Earn water credits',
        'Complete assessments',
      ],
      silver: [
        'All Bronze benefits',
        'Silver badge on profile',
        '2x credit multiplier on referrals',
        'Priority support',
      ],
      gold: [
        'All Silver benefits',
        'Gold badge on profile',
        'Featured in community highlights',
        'Exclusive challenges',
        'Early access to new features',
      ],
      platinum: [
        'All Gold benefits',
        'Platinum badge on profile',
        'VIP support',
        'Monthly bonus credits',
        'Community leadership features',
      ],
    };

    res.json({
      success: true,
      data: {
        ...progress,
        benefits: tierBenefits[progress.current],
        nextBenefits: progress.next ? tierBenefits[progress.next] : null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/credits/referral - Process referral
router.post('/referral', auth, async (req, res) => {
  try {
    const { referralCode } = req.body;
    const user = req.user;

    if (!referralCode) {
      return res.status(400).json({ success: false, error: 'Referral code required' });
    }

    const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
    
    if (!referrer) {
      return res.status(404).json({ success: false, error: 'Invalid referral code' });
    }

    if (referrer._id.toString() === user._id.toString()) {
      return res.status(400).json({ success: false, error: 'Cannot refer yourself' });
    }

    // Check if already referred
    if (user.referredBy) {
      return res.status(400).json({ success: false, error: 'Already used a referral code' });
    }

    // Update referrer
    referrer.credits.total += CREDIT_RATES.referralBonus;
    referrer.credits.lifetime += CREDIT_RATES.referralBonus;
    referrer.stats.referrals += 1;
    await referrer.save();

    // Update referred user
    user.referredBy = referrer._id;
    user.credits.total += CREDIT_RATES.referralBonus;
    user.credits.lifetime += CREDIT_RATES.referralBonus;
    await user.save();

    res.json({
      success: true,
      data: {
        bonusCredits: CREDIT_RATING.referralBonus,
        referrerName: referrer.name,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
