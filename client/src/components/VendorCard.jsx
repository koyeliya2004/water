import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, Star, Phone, Mail, CheckCircle, Shield,
  Briefcase, Clock, ArrowRight, Building2
} from 'lucide-react'

export default function VendorCard({ vendor, onSelect, onCompare, isSelected, compact = false }) {
  const [showContact, setShowContact] = useState(false)

  const {
    name,
    location = {},
    services = [],
    rating = 0,
    reviewCount = 0,
    completedProjects = 0,
    contact = {},
    verified = false,
    priceRange = 'Medium',
    portfolio = [],
    specialties = [],
    experience = 0,
  } = vendor

  const getPriceRangeColor = (range) => {
    switch (range) {
      case 'Budget': return 'text-green-600 bg-green-50'
      case 'Premium': return 'text-purple-600 bg-purple-50'
      default: return 'text-blue-600 bg-blue-50'
    }
  }

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all ${
          isSelected ? 'border-primary-500 shadow-md' : 'border-transparent shadow-sm hover:shadow-md'
        }`}
        onClick={() => onSelect?.(vendor)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-semibold text-gray-900">{name}</h3>
              {verified && (
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
              )}
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {location.city || location.state || 'Location N/A'}
            </div>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="ml-1 font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {services.slice(0, 2).map((service, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {service}
            </span>
          ))}
          {services.length > 2 && (
            <span className="text-xs text-gray-500">+{services.length - 2} more</span>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-water-500 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center">
              <h3 className="text-xl font-bold text-white">{name}</h3>
              {verified && (
                <Shield className="w-5 h-5 text-white ml-2" />
              )}
            </div>
            <div className="flex items-center text-primary-100 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {location.city}, {location.state}
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPriceRangeColor(priceRange)}`}>
            {priceRange}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center text-yellow-500 mb-1">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{rating.toFixed(1)}</div>
            <div className="text-xs text-gray-500">{reviewCount} reviews</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-blue-500 mb-1">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{completedProjects}</div>
            <div className="text-xs text-gray-500">Projects</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-green-500 mb-1">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{experience || 5}+</div>
            <div className="text-xs text-gray-500">Years</div>
          </div>
        </div>

        {/* Services */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Services</h4>
          <div className="flex flex-wrap gap-2">
            {services.slice(0, 4).map((service, index) => (
              <span 
                key={index} 
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
              >
                {service}
              </span>
            ))}
            {services.length > 4 && (
              <span className="text-sm text-gray-500 px-2 py-1">
                +{services.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Specialties */}
        {specialties && specialties.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Specialties</h4>
            <div className="flex flex-wrap gap-2">
              {specialties.slice(0, 3).map((specialty, index) => (
                <span 
                  key={index} 
                  className="text-sm bg-primary-50 text-primary-700 px-3 py-1 rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowContact(!showContact)}
            className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            <Phone className="w-4 h-4 mr-2" />
            {showContact ? 'Hide Contact' : 'Contact'}
          </button>
          <button
            onClick={() => onSelect?.(vendor)}
            className="flex-1 flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            Get Quote
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* Contact Info */}
        {showContact && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-gray-50 rounded-xl"
          >
            <div className="space-y-2">
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center text-gray-700 hover:text-primary-600"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {contact.phone}
                </a>
              )}
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center text-gray-700 hover:text-primary-600"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {contact.email}
                </a>
              )}
            </div>
          </motion.div>
        )}

        {/* Compare Checkbox */}
        {onCompare && (
          <label className="flex items-center mt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onCompare(vendor)}
              className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-600">Add to compare</span>
          </label>
        )}
      </div>

      {/* Verified Badge */}
      {verified && (
        <div className="bg-green-50 px-6 py-3 flex items-center text-sm text-green-700">
          <CheckCircle className="w-4 h-4 mr-2" />
          Verified Vendor - Documents Verified
        </div>
      )}
    </motion.div>
  )
}
