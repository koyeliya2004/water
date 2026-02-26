import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, Droplets, Users, Leaf, Globe, TrendingUp, 
  Award, Target, Zap, Share2, Heart, ArrowUpRight 
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts'
import axios from 'axios'

const COLORS = ['#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6']

export default function ImpactDashboard() {
  const [impactData, setImpactData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchImpactData()
  }, [])

  const fetchImpactData = async () => {
    try {
      const response = await axios.get('/api/leaderboard/impact')
      setImpactData(response.data.data)
    } catch (error) {
      console.error('Failed to fetch impact data:', error)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading impact data...</div>
      </div>
    )
  }

  const community = impactData?.community || {
    totalParticipants: 15247,
    totalRecharged: 4528000000,
    totalWaterCredits: 12500000,
    thisMonthRecharge: 125000000,
    impactMetrics: {
      olympicPools: 1811,
      householdsSupplied: 91800,
      co2Offset: 1358400
    }
  }

  // Mock data for charts
  const monthlyImpactData = [
    { month: 'Jan', recharge: 85, participants: 120 },
    { month: 'Feb', recharge: 78, participants: 125 },
    { month: 'Mar', recharge: 95, participants: 132 },
    { month: 'Apr', recharge: 110, participants: 145 },
    { month: 'May', recharge: 145, participants: 158 },
    { month: 'Jun', recharge: 280, participants: 185 },
    { month: 'Jul', recharge: 420, participants: 210 },
    { month: 'Aug', recharge: 380, participants: 225 },
    { month: 'Sep', recharge: 220, participants: 235 },
    { month: 'Oct', recharge: 165, participants: 242 },
    { month: 'Nov', recharge: 120, participants: 248 },
    { month: 'Dec', recharge: 92, participants: 255 },
  ]

  const stateDistribution = [
    { name: 'Maharashtra', value: 2850 },
    { name: 'Karnataka', value: 2420 },
    { name: 'Tamil Nadu', value: 2180 },
    { name: 'Telangana', value: 1950 },
    { name: 'Gujarat', value: 1680 },
  ]

  const impactMetrics = [
    {
      icon: Droplets,
      value: `${(community.totalRecharged / 1000000000).toFixed(2)}B`,
      label: 'Liters Recharged',
      color: 'blue',
      description: 'Total groundwater replenished'
    },
    {
      icon: Users,
      value: community.impactMetrics.householdsSupplied.toLocaleString(),
      label: 'Households Supported',
      color: 'green',
      description: 'Annual water requirement met'
    },
    {
      icon: Globe,
      value: community.impactMetrics.olympicPools.toLocaleString(),
      label: 'Olympic Pools',
      color: 'purple',
      description: 'Equivalent water volume'
    },
    {
      icon: Leaf,
      value: `${(community.impactMetrics.co2Offset / 1000).toFixed(1)}k`,
      label: 'Tons CO₂ Offset',
      color: 'emerald',
      description: 'Environmental impact'
    }
  ]

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BarChart3 className="w-4 h-4" />
            <span>Community Impact Dashboard</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Our Collective <span className="gradient-text">Impact</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Together, we're making a measurable difference in water conservation across India.
            Every drop counts towards a sustainable future.
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {impactMetrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="metric-card card-hover text-center"
              >
                <div className={`w-14 h-14 bg-${metric.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-7 h-7 text-${metric.color}-600`} />
                </div>
                <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm font-medium text-gray-600 mt-1">{metric.label}</p>
                <p className="text-xs text-gray-400 mt-1">{metric.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Charts Row 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-8 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Recharge Trend</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyImpactData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value}M L`} />
                  <Area 
                    type="monotone" 
                    dataKey="recharge" 
                    stroke="#0ea5e9" 
                    fill="#0ea5e9" 
                    fillOpacity={0.3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Participation by State</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stateDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {stateDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} participants`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Growth Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-primary-600 to-water-600 rounded-2xl p-8 text-white mb-8"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <p className="text-4xl font-bold">+47%</p>
              <p className="text-primary-100 mt-2">YoY Growth in Participants</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <p className="text-4xl font-bold">156</p>
              <p className="text-primary-100 mt-2">Cities Covered</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8" />
              </div>
              <p className="text-4xl font-bold">2.4M</p>
              <p className="text-primary-100 mt-2">Liters Avg per Household</p>
            </div>
          </div>
        </motion.div>

        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Our Milestones</h2>
          <div className="space-y-6">
            {impactData?.milestones.map((milestone, index) => {
              const progress = Math.min(100, (milestone.current / milestone.target) * 100)
              return (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">{milestone.label}</span>
                    <span className="text-sm text-gray-500">
                      {milestone.current.toLocaleString()} / {milestone.target.toLocaleString()}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-bar-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {impactData?.recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-500">{activity.action}</p>
                  </div>
                  <span className="text-water-600 font-semibold">
                    {(activity.amount / 1000).toFixed(1)}k L
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
            <h2 className="text-xl font-bold mb-6">Join the Movement</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Heart className="w-5 h-5 mt-0.5 text-red-300" />
                <p>Every liter you recharge helps secure water for future generations</p>
              </div>
              <div className="flex items-start space-x-3">
                <Share2 className="w-5 h-5 mt-0.5" />
                <p>Share your impact and inspire others in your community</p>
              </div>
              <div className="flex items-start space-x-3">
                <Award className="w-5 h-5 mt-0.5 text-yellow-300" />
                <p>Earn water credits and climb the leaderboard</p>
              </div>
            </div>
            <a 
              href="/assessment"
              className="inline-flex items-center space-x-2 mt-6 px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              <span>Start Contributing</span>
              <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
