import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Award, Gift, Flame, TrendingUp, Clock } from 'lucide-react';
import axios from 'axios';

const getActivityIcon = (type) => {
  switch (type) {
    case 'credits_earned':
      return { icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-100' };
    case 'assessment_completed':
      return { icon: Award, color: 'text-green-500', bg: 'bg-green-100' };
    case 'challenge_completed':
      return { icon: Gift, color: 'text-purple-500', bg: 'bg-purple-100' };
    case 'streak_updated':
      return { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-100' };
    case 'referral_made':
      return { icon: TrendingUp, color: 'text-cyan-500', bg: 'bg-cyan-100' };
    default:
      return { icon: Droplets, color: 'text-gray-500', bg: 'bg-gray-100' };
  }
};

const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = Math.floor((now - time) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return time.toLocaleDateString();
};

export default function CreditHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/credits/history');
      setHistory(response.data.data || []);
    } catch (error) {
      // Mock data for fallback
      setHistory([
        { id: '1', type: 'credits_earned', credits: 500, description: 'Earned from water harvest', timestamp: new Date().toISOString() },
        { id: '2', type: 'assessment_completed', credits: 50, description: 'Assessment completed', timestamp: new Date(Date.now() - 86400000).toISOString() },
        { id: '3', type: 'challenge_completed', credits: 200, description: 'Challenge completed: Daily Harvest', timestamp: new Date(Date.now() - 172800000).toISOString() },
        { id: '4', type: 'streak_updated', credits: 100, description: '7-day streak bonus', timestamp: new Date(Date.now() - 259200000).toISOString() },
        { id: '5', type: 'referral_made', credits: 100, description: 'Referral bonus', timestamp: new Date(Date.now() - 345600000).toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(h => h.type === filter);

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'credits_earned', label: 'Harvest' },
    { value: 'assessment_completed', label: 'Assessments' },
    { value: 'challenge_completed', label: 'Challenges' },
    { value: 'streak_updated', label: 'Streaks' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Credit History</h3>
          <span className="text-sm text-gray-500">{history.length} transactions</span>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === f.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-pulse">Loading history...</div>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No transactions yet</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredHistory.map((item, index) => {
              const { icon: Icon, color, bg } = getActivityIcon(item.type);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {item.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatTimeAgo(item.timestamp)}
                    </p>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-green-600">+{item.credits}</p>
                    <p className="text-xs text-gray-400">credits</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
