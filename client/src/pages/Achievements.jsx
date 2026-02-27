import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Lock, Star, Sparkles, Crown, Gem } from 'lucide-react';
import axios from 'axios';
import AchievementCard from '../components/AchievementCard';

const categoryIcons = {
  harvest: '💧',
  community: '🏘️',
  streak: '🔥',
  referral: '⭐',
  milestone: '🏆',
  special: '✨',
};

const categoryLabels = {
  harvest: 'Harvest',
  community: 'Community',
  streak: 'Streak',
  referral: 'Referral',
  milestone: 'Milestone',
  special: 'Special',
};

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await axios.get('/api/achievements/user');
      setAchievements(response.data.data.achievements);
      setGrouped(response.data.data.grouped);
    } catch (error) {
      // Mock data for fallback
      const mockAchievements = [
        { id: 'first_harvest', name: 'First Harvest', description: 'Complete your first assessment', icon: '🌱', category: 'harvest', creditReward: 50, rarity: 'common', unlocked: true, unlockedAt: new Date().toISOString() },
        { id: 'droplet_collector', name: 'Droplet Collector', description: 'Harvest 1,000 liters', icon: '💧', category: 'harvest', creditReward: 100, rarity: 'common', unlocked: true, unlockedAt: new Date().toISOString() },
        { id: 'stream_starter', name: 'Stream Starter', description: 'Harvest 10,000 liters', icon: '🌊', category: 'harvest', creditReward: 500, rarity: 'common', unlocked: false },
        { id: 'river_ranger', name: 'River Ranger', description: 'Harvest 100,000 liters', icon: '🏞️', category: 'harvest', creditReward: 2000, rarity: 'rare', unlocked: false },
        { id: 'streak_starter', name: 'Streak Starter', description: '7-day streak', icon: '🔥', category: 'streak', creditReward: 100, rarity: 'common', unlocked: true, unlockedAt: new Date().toISOString() },
        { id: 'referral_star', name: 'Referral Star', description: '5 referrals', icon: '⭐', category: 'referral', creditReward: 500, rarity: 'rare', unlocked: false },
        { id: 'credit_collector_1k', name: 'Credit Collector', description: 'Earn 1,000 credits', icon: '🪙', category: 'milestone', creditReward: 100, rarity: 'common', unlocked: true, unlockedAt: new Date().toISOString() },
        { id: 'platinum_elite', name: 'Platinum Elite', description: 'Reach Platinum tier', icon: '💎', category: 'milestone', creditReward: 5000, rarity: 'legendary', unlocked: false },
      ];
      
      setAchievements(mockAchievements);
      setGrouped({
        harvest: mockAchievements.filter(a => a.category === 'harvest'),
        community: [],
        streak: mockAchievements.filter(a => a.category === 'streak'),
        referral: mockAchievements.filter(a => a.category === 'referral'),
        milestone: mockAchievements.filter(a => a.category === 'milestone'),
        special: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All', icon: '🎯' },
    { value: 'harvest', label: 'Harvest', icon: '💧' },
    { value: 'community', label: 'Community', icon: '🏘️' },
    { value: 'streak', label: 'Streak', icon: '🔥' },
    { value: 'referral', label: 'Referral', icon: '⭐' },
    { value: 'milestone', label: 'Milestone', icon: '🏆' },
    { value: 'special', label: 'Special', icon: '✨' },
  ];

  const displayAchievements = selectedCategory === 'all' 
    ? achievements 
    : grouped[selectedCategory] || [];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  const getRarityStats = () => {
    const stats = { common: 0, rare: 0, epic: 0, legendary: 0 };
    achievements.filter(a => a.unlocked).forEach(a => {
      stats[a.rarity] = (stats[a.rarity] || 0) + 1;
    });
    return stats;
  };

  const rarityStats = getRarityStats();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Trophy className="w-4 h-4" />
            <span>Achievements</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Unlock <span className="gradient-text">Achievements</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Earn badges and credits by completing challenges and milestones throughout your water conservation journey.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="metric-card text-center">
            <p className="metric-value text-primary-600">{unlockedCount}/{totalCount}</p>
            <p className="metric-label">Unlocked</p>
          </div>
          <div className="metric-card text-center">
            <p className="metric-value text-yellow-600">{rarityStats.legendary}</p>
            <p className="metric-label">Legendary</p>
          </div>
          <div className="metric-card text-center">
            <p className="metric-value text-purple-600">{rarityStats.epic}</p>
            <p className="metric-label">Epic</p>
          </div>
          <div className="metric-card text-center">
            <p className="metric-value text-blue-600">{rarityStats.rare}</p>
            <p className="metric-label">Rare</p>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8 justify-center"
        >
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                selectedCategory === cat.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="font-medium">{cat.label}</span>
              {cat.value !== 'all' && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedCategory === cat.value ? 'bg-primary-400' : 'bg-gray-200'
                }`}>
                  {grouped[cat.value]?.filter(a => a.unlocked).length || 0}/{grouped[cat.value]?.length || 0}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Achievements Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <div className="animate-pulse">Loading achievements...</div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {displayAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AchievementCard 
                  achievement={achievement}
                  onClick={setSelectedAchievement}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && displayAchievements.length === 0 && (
          <div className="text-center py-12">
            <Lock className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No achievements in this category yet</p>
          </div>
        )}

        {/* Achievement Detail Modal */}
        <AnimatePresence>
          {selectedAchievement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedAchievement(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
                onClick={e => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{selectedAchievement.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {selectedAchievement.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedAchievement.description}
                  </p>
                  <div className="flex justify-center gap-4 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedAchievement.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700' :
                      selectedAchievement.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                      selectedAchievement.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedAchievement.rarity}
                    </span>
                    <span className="text-sm text-gray-500">
                      +{selectedAchievement.creditReward} credits
                    </span>
                  </div>
                  {selectedAchievement.unlocked ? (
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                      ✓ Unlocked on {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedAchievement(null)}
                      className="btn-primary"
                    >
                      Start Working on It
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
