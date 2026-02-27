import { motion } from 'framer-motion';
import { Lock, Check, Crown } from 'lucide-react';

const tiers = [
  { name: 'bronze', min: 0, color: 'bg-amber-500', icon: '🥉' },
  { name: 'silver', min: 5000, color: 'bg-gray-400', icon: '🥈' },
  { name: 'gold', min: 20000, color: 'bg-yellow-500', icon: '🥇' },
  { name: 'platinum', min: 50000, color: 'bg-cyan-500', icon: '💎' },
];

export default function TierProgress({ currentTier, progress, nextTier, remaining, credits }) {
  const currentIndex = tiers.findIndex(t => t.name === currentTier);
  const progressPercent = Math.min(progress || 0, 100);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          Tier Progress
        </h3>
        <span className="text-2xl font-bold text-primary-600">
          {credits?.toLocaleString() || 0} credits
        </span>
      </div>

      {/* Tier Progress Bar */}
      <div className="relative mb-8">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-water-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        {/* Tier Markers */}
        <div className="absolute top-0 left-0 w-full h-3">
          {tiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`absolute top-0 w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                index <= currentIndex ? tier.color : 'bg-gray-300'
              }`}
              style={{ left: `${(index / (tiers.length - 1)) * 100}%` }}
            >
              {index < currentIndex && (
                <Check className="w-2 h-2 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tier Labels */}
      <div className="flex justify-between mb-6">
        {tiers.map((tier) => {
          const isActive = tier.name === currentTier;
          const isCompleted = tiers.findIndex(t => t.name === currentTier) > tiers.findIndex(t => t.name === tier.name);
          
          return (
            <div key={tier.name} className="text-center">
              <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                isActive ? 'bg-primary-100 ring-2 ring-primary-500' : isCompleted ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <span className="text-lg">{tier.icon}</span>
              </div>
              <p className={`text-xs mt-1 font-medium ${isActive ? 'text-primary-600' : 'text-gray-500'}`}>
                {tier.name.charAt(0).toUpperCase() + tier.name.slice(1)}
              </p>
              <p className="text-xs text-gray-400">{tier.min.toLocaleString()}+</p>
            </div>
          );
        })}
      </div>

      {/* Next Tier Info */}
      {nextTier && remaining > 0 && (
        <div className="bg-gradient-to-r from-primary-50 to-water-50 rounded-xl p-4 border border-primary-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Next tier: <span className="font-semibold text-primary-600 capitalize">{nextTier}</span></p>
              <p className="text-xs text-gray-500">{remaining.toLocaleString()} credits needed</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary-600">{progressPercent}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Max Tier Achieved */}
      {!nextTier && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200 text-center">
          <span className="text-2xl">🏆</span>
          <p className="font-semibold text-yellow-700 mt-1">Maximum Tier Achieved!</p>
          <p className="text-sm text-yellow-600">You're a Platinum Water Warrior!</p>
        </div>
      )}
    </div>
  );
}
