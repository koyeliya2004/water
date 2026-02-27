import { motion } from 'framer-motion';
import { Users, Droplets, MapPin, ArrowRight } from 'lucide-react';

export default function CommunityCard({ community, onClick, variant = 'default' }) {
  const {
    id,
    name,
    description,
    location,
    memberCount = 0,
    totalRecharged = 0,
    image,
  } = community;

  const formatLiters = (liters) => {
    if (liters >= 1000000) return `${(liters / 1000000).toFixed(1)}M`;
    if (liters >= 1000) return `${(liters / 1000).toFixed(0)}K`;
    return liters;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(community)}
      className={`
        group relative rounded-2xl overflow-hidden cursor-pointer
        ${variant === 'featured' 
          ? 'col-span-2 row-span-2 bg-gradient-to-br from-primary-600 to-water-600 text-white' 
          : 'bg-white border border-gray-100 hover:border-primary-200 hover:shadow-lg'
        }
      `}
    >
      {/* Background Image */}
      {image && (
        <div className="absolute inset-0">
          <img src={image} alt={name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      {/* Content */}
      <div className={`relative p-5 ${variant === 'featured' ? 'h-full flex flex-col justify-end' : ''}`}>
        {/* Featured Badge */}
        {variant === 'featured' && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
            Featured
          </div>
        )}

        {/* Header */}
        <div className="mb-3">
          <h3 className={`font-bold text-xl mb-1 ${variant === 'featured' ? 'text-white' : 'text-gray-900'}`}>
            {name}
          </h3>
          {location && (
            <p className={`text-sm flex items-center gap-1 ${variant === 'featured' ? 'text-primary-100' : 'text-gray-500'}`}>
              <MapPin className="w-3 h-3" />
              {location.city}, {location.state}
            </p>
          )}
        </div>

        {/* Description */}
        {description && variant !== 'compact' && (
          <p className={`text-sm mb-4 line-clamp-2 ${variant === 'featured' ? 'text-primary-50' : 'text-gray-600'}`}>
            {description}
          </p>
        )}

        {/* Stats */}
        <div className={`flex items-center gap-4 ${variant === 'featured' ? 'text-primary-50' : 'text-gray-500'}`}>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">{memberCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Droplets className="w-4 h-4" />
            <span className="text-sm font-medium">{formatLiters(totalRecharged)}L</span>
          </div>
        </div>

        {/* Arrow Indicator */}
        <div className={`
          absolute top-1/2 right-4 transform -translate-y-1/2
          opacity-0 group-hover:opacity-100 transition-opacity
          ${variant === 'featured' ? 'text-white' : 'text-primary-500'}
        `}>
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
