import { motion } from 'framer-motion';
import { Trophy, Clock, CheckCircle2, Lock, Flame } from 'lucide-react';

const difficultyColors = {
  easy: { bg: 'bg-green-100', text: 'text-green-700', badge: 'bg-green-500' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', badge: 'bg-yellow-500' },
  hard: { bg: 'bg-orange-100', text: 'text-orange-700', badge: 'bg-orange-500' },
  expert: { bg: 'bg-red-100', text: 'text-red-700', badge: 'bg-red-500' },
};

export default function ChallengeCard({ challenge, onJoin, onProgress }) {
  const {
    title,
    description,
    type,
    category,
    requirement,
    unit,
    creditReward,
    badge,
    difficulty = 'medium',
    endDate,
    progress = 0,
    completed = false,
  } = challenge;

  const colors = difficultyColors[difficulty] || difficultyColors.medium;
  const progressPercent = Math.min((progress / requirement) * 100, 100);
  const isExpired = new Date(endDate) < new Date();

  const formatTimeLeft = (dateStr) => {
    const end = new Date(dateStr);
    const now = new Date();
    const diff = end - now;
    
    if (diff < 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`
        relative rounded-2xl p-5 border-2 transition-all
        ${completed 
          ? 'border-green-300 bg-gradient-to-br from-green-50 to-white' 
          : isExpired
            ? 'border-gray-200 bg-gray-50 opacity-60'
            : 'border-gray-100 bg-white hover:border-primary-200 hover:shadow-lg'
        }
      `}
    >
      {/* Completed Badge */}
      {completed && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {badge?.icon && (
            <span className="text-2xl">{badge.icon}</span>
          )}
          <div>
            <h4 className="font-bold text-gray-900">{title}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full text-white ${colors.badge} capitalize`}>
              {difficulty}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-primary-600">+{creditReward}</p>
          <p className="text-xs text-gray-500">credits</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4">
        {description}
      </p>

      {/* Progress Bar */}
      {!completed && !isExpired && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">
              {progress.toLocaleString()} / {requirement.toLocaleString()} {unit}
            </span>
            <span className="font-medium text-primary-600">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-water-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <span className={`text-xs px-2 py-1 rounded-full ${colors.bg} ${colors.text} capitalize`}>
            {type}
          </span>
          {type !== 'milestone' && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {formatTimeLeft(endDate)}
            </span>
          )}
        </div>
        
        {!completed && !isExpired && progress === 0 && (
          <button
            onClick={() => onJoin?.(challenge)}
            className="px-4 py-1.5 bg-primary-500 text-white text-sm font-medium rounded-full hover:bg-primary-600 transition-colors"
          >
            Join
          </button>
        )}
      </div>
    </motion.div>
  );
}
