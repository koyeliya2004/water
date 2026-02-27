import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Droplets, Menu, X, Trophy, Store, Map, Home, FileText, BarChart3, User, Award, Target, Users, View } from 'lucide-react'

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/assessment', label: 'Assessment', icon: FileText },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/marketplace', label: 'Marketplace', icon: Store },
  { path: '/aquifer', label: 'Aquifer', icon: Map },
  { path: '/subsidies', label: 'Subsidies', icon: FileText },
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

            {/* More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMore(!showMore)}
                className="px-3 py-2 rounded-lg flex items-center space-x-2 text-gray-600 hover:bg-gray-100 transition-all"
              >
                <span className="font-medium">More</span>
                <svg className={`w-4 h-4 transition-transform ${showMore ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {showMore && (
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
                    <hr className="my-2 border-gray-100" />
                    <Link
                      to="/profile"
                      onClick={() => setShowMore(false)}
                      className={`block px-4 py-2 flex items-center space-x-2 ${
                        location.pathname === '/profile'
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span className="font-medium">Profile</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Profile Link (Desktop) */}
          <div className="hidden lg:flex items-center">
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
            <div className="px-4 py-2 space-y-1 max-h-[70vh] overflow-y-auto">
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
              
              {/* Gamification Section */}
              <div className="pt-2 border-t border-gray-200">
                <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Gamification
                </p>
                {gamificationItems.map((item) => {
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
