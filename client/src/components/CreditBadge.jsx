import { motion } from 'framer-motion';

const tierColors = {
  bronze: {
    bg: 'bg-amber-100',
    border: 'border-amber-300',
    text: 'text-amber-700',
    gradient: 'from-amber-400 to-amber-600',
    icon: '🥉',
  },
  silver: {
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    text: 'text-gray-700',
    gradient: 'from-gray-300 to-gray-500',
    icon: '🥈',
  },
  gold: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-400',
    text: 'text-yellow-700',
    gradient: 'from-yellow-400 to-amber-500',
    icon: '🥇',
  },
  platinum: {
    bg: 'bg-cyan-100',
    border: 'border-cyan-400',
    text: 'text-cyan-700',
    gradient: 'from-cyan-300 to-blue-500',
    icon: '💎',
  },
};

export default function CreditBadge({ tier = 'bronze', size = 'md', showLabel = true }) {
  const colors = tierColors[tier] || tierColors.bronze;
  
  const sizes = {
    sm: { badge: 'w-8 h-8', icon: 'text-sm', label: 'text-xs' },
    md: { badge: 'w-12 h-12', icon: 'text-lg', label: 'text-sm' },
    lg: { badge: 'w-16 h-16', icon: 'text-2xl', label: 'text-base' },
  };
  
  const sizeStyles = sizes[size] || sizes.md;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`inline-flex items-center gap-2 ${colors.bg} ${colors.border} border-2 rounded-full px-3 py-1`}
    >
      <div className={`${sizeStyles.badge} rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
        <span className={sizeStyles.icon}>{colors.icon}</span>
      </div>
      {showLabel && (
        <span className={`${colors.text} ${sizeStyles.label} font-semibold capitalize`}>
          {tier}
        </span>
      )}
    </motion.div>
  );
}
