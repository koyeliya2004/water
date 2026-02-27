import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const rarityColors = {
  common: {
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    badge: 'bg-gray-500',
    text: 'text-gray-700',
  },
  rare: {
    bg: 'bg-blue-100',
    border: 'border-blue-300',
    badge: 'bg-blue-500',
    text: 'text-blue-700',
  },
  epic: {
    bg: 'bg-purple-100',
    border: 'border-purple-400',
    badge: 'bg-purple-500',
    text: 'text-purple-700',
  },
  legendary: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-400',
    badge: 'bg-yellow-500',
    text: 'text-yellow-700',
  },
};

export default function AchievementCard({ achievement, onClick }) {
  const { 
    icon, 
    name, 
    description, 
    category, 
    creditReward, 
    rarity = 'common',
    unlocked = false,
    unlockedAt 
  } = achievement;
  
  const colors = rarityColors[rarity] || rarityColors.common;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(achievement)}
      className={`
        relative rounded-2xl p-4 border-2 transition-all cursor-pointer
        ${unlocked 
          ? `${colors.bg} ${colors.border} shadow-md` 
          : 'bg-gray-50 border-gray-200 opacity-60'
        }
      `}
    >
      {/* Locked Overlay */}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 rounded-2xl z-10">
          <Lock className="w-6 h-6 text-gray-400" />
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`
          w-14 h-14 rounded-xl flex items-center justify-center text-2xl
          ${unlocked ? 'bg-white shadow-sm' : 'bg-gray-200'}
        `}>
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title & Rarity Badge */}
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-bold ${unlocked ? colors.text : 'text-gray-600'} truncate`}>
              {name}
            </h4>
            {unlocked && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${colors.badge}`}>
                {rarity}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {creditReward > 0 && (
              <span className="text-sm font-medium text-green-600">
                +{creditReward} credits
              </span>
            )}
            {unlockedAt && (
              <span className="text-xs text-gray-500 ml-auto">
                {formatDate(unlockedAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Category Tag */}
      <div className="absolute top-2 right-2">
        <span className="text-xs px-2 py-1 rounded-full bg-white/80 text-gray-500 capitalize">
          {category}
        </span>
      </div>
    </motion.div>
  );
}
