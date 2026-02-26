import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Star, Droplets, MapPin, TrendingUp, Award } from 'lucide-react'
import axios from 'axios'

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [communityStats, setCommunityStats] = useState(null)
  const [filter, setFilter] = useState('global')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [filter])

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/leaderboard/${filter}`)
      setLeaderboard(response.data.data.leaderboard)
      setCommunityStats(response.data.data.communityStats)
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    }
    setLoading(false)
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />
    return <span className="w-6 h-6 flex items-center justify-center font-semibold text-gray-500">{rank}</span>
  }

  const getRankStyle = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200'
    if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
    if (rank === 3) return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
    return 'bg-white border-gray-100'
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Trophy className="w-4 h-4" />
            <span>Water Credit Leaderboard</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Top <span className="gradient-text">Water Warriors</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Celebrate the individuals and communities making the biggest impact on groundwater conservation.
            Earn water credits for every liter you recharge!
          </p>
        </motion.div>

        {/* Community Stats */}
        {communityStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <div className="metric-card text-center">
              <p className="metric-value text-primary-600">{communityStats.totalParticipants.toLocaleString()}</p>
              <p className="metric-label">Participants</p>
            </div>
            <div className="metric-card text-center">
              <p className="metric-value text-water-600">{(communityStats.totalRecharged / 1000000000).toFixed(2)}B</p>
              <p className="metric-label">Liters Recharged</p>
            </div>
            <div className="metric-card text-center">
              <p className="metric-value text-purple-600">{(communityStats.totalWaterCredits / 1000000).toFixed(1)}M</p>
              <p className="metric-label">Water Credits</p>
            </div>
            <div className="metric-card text-center">
              <p className="metric-value text-orange-600">{communityStats.impactMetrics.olympicPools}</p>
              <p className="metric-label">Olympic Pools</p>
            </div>
          </motion.div>
        )}

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm p-1 inline-flex">
            <button
              onClick={() => setFilter('global')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                filter === 'global' 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Global
            </button>
            <button
              onClick={() => setFilter('state')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                filter === 'state' 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              By State
            </button>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Top Contributors</h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading leaderboard...</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {leaderboard.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 flex items-center space-x-4 ${getRankStyle(user.rank)}`}
                >
                  <div className="flex-shrink-0 w-12">
                    {getRankIcon(user.rank)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      {user.rank <= 3 && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{user.location}, {user.state}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-water-600">
                      <Droplets className="w-4 h-4" />
                      <span className="font-bold">{(user.rechargedLiters / 1000).toFixed(1)}k L</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.waterCredits.toLocaleString()} credits
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Your Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-primary-600 to-water-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Start Earning Water Credits!</h3>
              <p className="text-primary-100">
                Complete an assessment and implement a rainwater harvesting system to join the leaderboard.
              </p>
            </div>
            <div className="hidden md:block">
              <Award className="w-16 h-16 text-white opacity-50" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
