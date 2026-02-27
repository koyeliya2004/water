import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Flame, Gift, Calendar, Trophy, Zap } from 'lucide-react';
import axios from 'axios';
import ChallengeCard from '../components/ChallengeCard';

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [userChallenges, setUserChallenges] = useState(null);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const [allRes, userRes] = await Promise.all([
        axios.get('/api/challenges'),
        axios.get('/api/challenges/user'),
      ]);
      
      setChallenges(allRes.data.data);
      setUserChallenges(userRes.data.data);
    } catch (error) {
      // Mock data
      const mockChallenges = [
        {
          id: '1',
          title: 'Daily Assessment',
          description: 'Complete one water harvesting assessment today',
          type: 'daily',
          category: 'assessment',
          requirement: 1,
          unit: 'assessment',
          creditReward: 50,
          badge: { icon: '📋', name: 'Daily Assessor' },
          endDate: new Date(new Date().setHours(23, 59, 59, 999)),
          difficulty: 'easy',
          progress: 1,
          completed: true,
        },
        {
          id: '2',
          title: 'Weekly Referral',
          description: 'Refer one friend to join the community',
          type: 'weekly',
          category: 'referral',
          requirement: 1,
          unit: 'referral',
          creditReward: 100,
          badge: { icon: '👥', name: 'Friend Maker' },
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          difficulty: 'medium',
          progress: 0,
          completed: false,
        },
        {
          id: '3',
          title: 'Monsoon Harvest',
          description: 'Harvest 10,000 liters during monsoon season',
          type: 'seasonal',
          category: 'harvest',
          requirement: 10000,
          unit: 'liters',
          creditReward: 500,
          badge: { icon: '🌧️', name: 'Monsoon Master' },
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          difficulty: 'hard',
          progress: 6500,
          completed: false,
        },
        {
          id: '4',
          title: 'Streak Champion',
          description: 'Maintain a 7-day activity streak',
          type: 'daily',
          category: 'streak',
          requirement: 7,
          unit: 'days',
          creditReward: 150,
          badge: { icon: '🔥', name: 'On Fire' },
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          difficulty: 'medium',
          progress: 5,
          completed: false,
        },
        {
          id: '5',
          title: '100K Challenge',
          description: 'Reach 100,000 liters total harvest',
          type: 'milestone',
          category: 'harvest',
          requirement: 100000,
          unit: 'liters',
          creditReward: 2000,
          badge: { icon: '🏆', name: 'Century Hero' },
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          difficulty: 'expert',
          progress: 45000,
          completed: false,
        },
      ];
      
      setChallenges(mockChallenges);
      setUserChallenges({
        daily: mockChallenges.filter(c => c.type === 'daily'),
        weekly: mockChallenges.filter(c => c.type === 'weekly'),
        seasonal: mockChallenges.filter(c => c.type === 'seasonal'),
        milestone: mockChallenges.filter(c => c.type === 'milestone'),
        completedCount: 1,
        totalCount: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (challenge) => {
    try {
      await axios.post(`/api/challenges/${challenge.id}/join`);
      fetchChallenges();
    } catch (error) {
      console.error('Failed to join challenge:', error);
    }
  };

  const tabs = [
    { value: 'all', label: 'All', icon: Target },
    { value: 'daily', label: 'Daily', icon: Calendar },
    { value: 'weekly', label: 'Weekly', icon: Flame },
    { value: 'seasonal', label: 'Seasonal', icon: Gift },
    { value: 'milestone', label: 'Milestones', icon: Trophy },
  ];

  const displayChallenges = activeTab === 'all' 
    ? challenges 
    : userChallenges?.[activeTab] || challenges.filter(c => c.type === activeTab);

  const completedCount = challenges.filter(c => c.completed).length;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Target className="w-4 h-4" />
            <span>Challenges</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Complete <span className="gradient-text">Challenges</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete daily, weekly, and seasonal challenges to earn bonus credits and exclusive badges.
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
            <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
            <p className="metric-value text-primary-600">{completedCount}/{challenges.length}</p>
            <p className="metric-label">Completed</p>
          </div>
          <div className="metric-card text-center">
            <p className="metric-value text-green-600">
              +{challenges.filter(c => c.completed).reduce((sum, c) => sum + c.creditReward, 0)}
            </p>
            <p className="metric-label">Credits Earned</p>
          </div>
          <div className="metric-card text-center">
            <p className="metric-value text-purple-600">
              {challenges.filter(c => c.type === 'daily').length}
            </p>
            <p className="metric-label">Daily</p>
          </div>
          <div className="metric-card text-center">
            <p className="metric-value text-orange-600">
              {challenges.filter(c => c.type === 'weekly').length}
            </p>
            <p className="metric-label">Weekly</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex overflow-x-auto gap-2 mb-8 pb-2"
        >
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === tab.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Challenges Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <div className="animate-pulse">Loading challenges...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ChallengeCard
                  challenge={challenge}
                  onJoin={handleJoin}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && displayChallenges.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No challenges available in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
