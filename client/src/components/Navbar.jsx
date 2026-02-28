import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Droplets, Menu, X, Trophy, Store, Map, Home, FileText, 
  BarChart3, User, Award, Target, Users, View, Wrench, BookOpen 
} from 'lucide-react'
import NotificationCenter from './NotificationCenter'

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/assessment', label: 'Assessment', icon: FileText },
  { path: '/implementation', label: 'Implementation', icon: Wrench },
  { path: '/blueprint', label: 'Blueprint', icon: BookOpen },
]

const discoveryItems = [
  { path: '/marketplace', label: 'Marketplace', icon: Store },
  { path: '/subsidies', label: 'Subsidies', icon: FileText },
  { path: '/aquifer', label: 'Aquifer', icon: Map },
]

const communityItems = [
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/impact', label: 'Impact', icon: BarChart3 },
]

const gamificationItems = [
  { path: '/challenges', label: 'Challenges', icon: Target },
  { path: '/achievements', label: 'Achievements', icon: Award },
  { path: '/ar', label: 'AR View', icon: View },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [showMobileSubmenu, setShowMobileSubmenu] = useState(null)
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-gradient-to-br from-primary-500 to-water-500 rounded-full flex items-center justify-center"
            >
              <Droplets className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold gradient-text">JalDhar</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Main Nav */}
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 text-sm ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}

            {/* Discovery Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMore('discovery')}
                className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                  discoveryItems.some(i => location.pathname === i.path)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="font-medium text-sm">Discover</span>
                <svg className={`w-4 h-4 transition-transform ${showMore === 'discovery' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {showMore === 'discovery' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2"
                  >
                    {discoveryItems.map((item) => {
                      const Icon = item.icon
                      const isActive = location.pathname === item.path
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setShowMore(false)}
                          className={`block px-4 py-2 flex items-center space-x-2 ${
                            isActive
                              ? 'bg-primary-100 text-primary-700'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Community Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMore('community')}
                className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                  communityItems.some(i => location.pathname === i.path)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="font-medium text-sm">Community</span>
                <svg className={`w-4 h-4 transition-transform ${showMore === 'community' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {showMore === 'community' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2"
                  >
                    {communityItems.map((item) => {
                      const Icon = item.icon
                      const isActive = location.pathname === item.path
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setShowMore(false)}
                          className={`block px-4 py-2 flex items-center space-x-2 ${
                            isActive
                              ? 'bg-primary-100 text-primary-700'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMore('more')}
                className="px-3 py-2 rounded-lg flex items-center space-x-2 text-gray-600 hover:bg-gray-100 transition-all"
              >
                <span className="font-medium text-sm">More</span>
                <svg className={`w-4 h-4 transition-transform ${showMore === 'more' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {showMore === 'more' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2"
                  >
                    {gamificationItems.map((item) => {
                      const Icon = item.icon
                      const isActive = location.pathname === item.path
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setShowMore(false)}
                          className={`block px-4 py-2 flex items-center space-x-2 ${
                            isActive
                              ? 'bg-primary-100 text-primary-700'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Close dropdown when clicking outside */}
            {showMore && (
              <div 
                className="fixed inset-0 z-0" 
                onClick={() => setShowMore(false)}
              />
            )}
          </div>

          {/* Right Side - Notifications & Profile */}
          <div className="hidden lg:flex items-center space-x-2">
            <NotificationCenter />
            <Link
              to="/profile"
              className={`p-2 rounded-lg transition-colors ${
                location.pathname === '/profile'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-gray-200"
          >
            <div className="px-4 py-2 space-y-1 max-h-[80vh] overflow-y-auto">
              {/* Main Nav */}
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
              
              {/* Discovery Section */}
              <div className="pt-2 border-t border-gray-200">
                <button
                  onClick={() => setShowMobileSubmenu(showMobileSubmenu === 'discovery' ? null : 'discovery')}
                  className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide"
                >
                  <span>Discover</span>
                  <svg className={`w-4 h-4 transition-transform ${showMobileSubmenu === 'discovery' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showMobileSubmenu === 'discovery' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {discoveryItems.map((item) => {
                      const Icon = item.icon
                      const isActive = location.pathname === item.path
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center space-x-3 px-6 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-primary-100 text-primary-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </div>

              {/* Community Section */}
              <div className="pt-2 border-t border-gray-200">
                <button
                  onClick={() => setShowMobileSubmenu(showMobileSubmenu === 'community' ? null : 'community')}
                  className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide"
                >
                  <span>Community</span>
                  <svg className={`w-4 h-4 transition-transform ${showMobileSubmenu === 'community' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showMobileSubmenu === 'community' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {communityItems.map((item) => {
                      const Icon = item.icon
                      const isActive = location.pathname === item.path
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center space-x-3 px-6 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-primary-100 text-primary-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </div>

              {/* Gamification Section */}
              <div className="pt-2 border-t border-gray-200">
                <button
                  onClick={() => setShowMobileSubmenu(showMobileSubmenu === 'gamification' ? null : 'gamification')}
                  className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide"
                >
                  <span>More</span>
                  <svg className={`w-4 h-4 transition-transform ${showMobileSubmenu === 'gamification' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showMobileSubmenu === 'gamification' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {gamificationItems.map((item) => {
                      const Icon = item.icon
                      const isActive = location.pathname === item.path
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center space-x-3 px-6 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-primary-100 text-primary-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </div>

              {/* Profile */}
              <div className="pt-2 border-t border-gray-200">
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    location.pathname === '/profile'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
