import { motion } from 'framer-motion';
import { Flame, Trophy, Calendar, Zap } from 'lucide-react';

export default function StreakCounter({ current = 0, longest = 0, size = 'md' }) {
  const getStreakStatus = (days) => {
    if (days >= 100) return { level: 'legendary', icon: '🔥', color: 'text-red-500', bg: 'bg-red-100' };
    if (days >= 30) return { level: 'master', icon: '⭐', color: 'text-yellow-500', bg: 'bg-yellow-100' };
    if (days >= 7) return { level: 'active', icon: '✨', color: 'text-primary-500', bg: 'bg-primary-100' };
    return { level: 'starter', icon: '🌱', color: 'text-green-500', bg: 'bg-green-100' };
  };

  const status = getStreakStatus(current);
  
  const sizes = {
    sm: { icon: 'text-2xl', text: 'text-2xl', label: 'text-xs' },
    md: { icon: 'text-4xl', text: 'text-3xl', label: 'text-sm' },
    lg: { icon: 'text-5xl', text: 'text-4xl', label: 'text-base' },
  };
  
  const sizeStyles = sizes[size] || sizes.md;

  const milestones = [
    { days: 7, label: 'Week', reward: 50 },
    { days: 14, label: 'Two Weeks', reward: 100 },
    { days: 30, label: 'Month', reward: 200 },
    { days: 60, label: 'Two Months', reward: 500 },
    { days: 100, label: 'Century', reward: 1000 },
  ];

  const nextMilestone = milestones.find(m => m.days > current) || milestones[milestones.length - 1];
  const progressToNext = Math.min((current / nextMilestone.days) * 100, 100);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Activity Streak
        </h3>
        {longest > 0 && (
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            Best: {longest} days
          </span>
        )}
      </div>

      {/* Main Streak Display */}
      <div className="flex items-center justify-center mb-6">
        <motion.div
          key={current}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className={`relative`}
        >
          <div className={`${sizeStyles.icon} w-24 h-24 rounded-full ${status.bg} flex items-center justify-center`}>
            <span>{status.icon}</span>
          </div>
          
          {/* Pulse Animation for Active Streaks */}
          {current >= 7 && (
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-orange-400"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>
      </div>

      {/* Current Streak */}
      <div className="text-center mb-6">
        <p className={`${sizeStyles.text} font-bold ${status.color}`}>
          {current}
        </p>
        <p className={`${sizeStyles.label} text-gray-500`}>
          day streak
        </p>
      </div>

      {/* Progress to Next Milestone */}
      {current < 100 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">
              Next: {nextMilestone.label} ({nextMilestone.days} days)
            </span>
            <span className="font-medium text-primary-600">+{nextMilestone.reward} credits</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-400 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressToNext}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Milestones Grid */}
      <div className="grid grid-cols-5 gap-2">
        {milestones.map((milestone) => {
          const isAchieved = current >= milestone.days;
          return (
            <motion.div
              key={milestone.days}
              whileHover={{ scale: 1.1 }}
              className={`
                text-center p-2 rounded-lg
                ${isAchieved 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-50 text-gray-400'
                }
              `}
            >
              <Zap className={`w-4 h-4 mx-auto mb-1 ${isAchieved ? 'text-green-500' : 'text-gray-300'}`} />
              <p className="text-xs font-medium">{milestone.days}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Streak Tips */}
      {current === 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 Complete daily activities to start your streak and earn bonus credits!
          </p>
        </div>
      )}
    </div>
  );
}
