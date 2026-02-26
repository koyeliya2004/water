import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Droplets, Download, FileText, TrendingUp, MapPin, 
  CheckCircle, AlertCircle, Home, Users, ArrowRight,
  Share2, Printer, ChevronRight
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts'
import axios from 'axios'

const COLORS = ['#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444']

export default function Results() {
  const navigate = useNavigate()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('assessmentResults')
    if (stored) {
      setResults(JSON.parse(stored))
    } else {
      navigate('/assessment')
    }
  }, [navigate])

  const generatePDF = async (type) => {
    setLoading(true)
    try {
      const endpoint = type === 'blueprint' ? '/api/report/blueprint' : '/api/report/generate-pdf'
      const response = await axios.post(endpoint, {
        assessmentData: results,
        userInfo: results.userInfo
      })
      
      // Open PDF in new tab
      window.open(response.data.data.downloadUrl, '_blank')
    } catch (error) {
      console.error('PDF generation failed:', error)
      alert('Failed to generate PDF. Please try again.')
    }
    setLoading(false)
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading results...</div>
      </div>
    )
  }

  // Prepare chart data
  const monthlyData = [
    { month: 'Jan', rainfall: 20, harvest: results.runoff.potential * 0.02 },
    { month: 'Feb', rainfall: 15, harvest: results.runoff.potential * 0.015 },
    { month: 'Mar', rainfall: 25, harvest: results.runoff.potential * 0.025 },
    { month: 'Apr', rainfall: 40, harvest: results.runoff.potential * 0.04 },
    { month: 'May', rainfall: 80, harvest: results.runoff.potential * 0.08 },
    { month: 'Jun', rainfall: 200, harvest: results.runoff.potential * 0.18 },
    { month: 'Jul', rainfall: 350, harvest: results.runoff.potential * 0.25 },
    { month: 'Aug', rainfall: 300, harvest: results.runoff.potential * 0.22 },
    { month: 'Sep', rainfall: 180, harvest: results.runoff.potential * 0.12 },
    { month: 'Oct', rainfall: 100, harvest: results.runoff.potential * 0.07 },
    { month: 'Nov', rainfall: 30, harvest: results.runoff.potential * 0.03 },
    { month: 'Dec', rainfall: 15, harvest: results.runoff.potential * 0.015 },
  ]

  const waterUsageData = [
    { name: 'Rainwater Used', value: results.benefits.annualWaterSavings },
    { name: 'Municipal Water', value: results.waterDemand.annual - results.benefits.annualWaterSavings },
  ]

  const costData = [
    { name: 'Structure', value: results.costs.structure },
    { name: 'Storage Tank', value: results.costs.storage },
    { name: 'Maintenance', value: results.costs.maintenance },
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
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <CheckCircle className="w-4 h-4" />
            <span>Assessment Complete</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Your Rainwater Harvesting <span className="gradient-text">Potential</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Based on your inputs, here's a comprehensive analysis of your rooftop rainwater harvesting feasibility.
          </p>
        </motion.div>

        {/* Feasibility Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-primary-600 to-water-600 rounded-2xl p-8 text-white mb-8"
        >
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="text-center md:text-left">
              <p className="text-primary-100 mb-1">Feasibility Score</p>
              <div className="flex items-baseline justify-center md:justify-start space-x-2">
                <span className="text-5xl font-bold">{results.feasibility.score}</span>
                <span className="text-2xl">/100</span>
              </div>
              <p className="text-primary-100 mt-2">
                Rating: <span className="font-semibold">{results.feasibility.rating}</span>
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="white"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${results.feasibility.score * 3.52} 351.86`}
                    className="transition-all duration-1000"
                  />
                </svg>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-primary-100 mb-1">Annual Runoff Potential</p>
              <p className="text-4xl font-bold">{results.runoff.potential.toLocaleString()}</p>
              <p className="text-primary-100">Liters/Year</p>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: Droplets, label: 'Storage Required', value: `${(results.storage.required / 1000).toFixed(1)}k L`, color: 'blue' },
            { icon: TrendingUp, label: 'Groundwater Recharge', value: `${(results.benefits.groundwaterRecharge / 1000).toFixed(1)}k L/yr`, color: 'green' },
            { icon: Home, label: 'Payback Period', value: `${results.benefits.paybackPeriod} Years`, color: 'purple' },
            { icon: Users, label: 'Annual Savings', value: `₹${results.benefits.annualCostSavings.toLocaleString()}`, color: 'orange' },
          ].map((metric, index) => {
            const Icon = metric.icon
            return (
              <div key={metric.label} className="metric-card card-hover">
                <div className={`w-10 h-10 bg-${metric.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 text-${metric.color}-600`} />
                </div>
                <p className="metric-value">{metric.value}</p>
                <p className="metric-label">{metric.label}</p>
              </div>
            )
          })}
        </motion.div>

        {/* Structure Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid lg:grid-cols-2 gap-8 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Structure</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="text-lg font-semibold text-primary-700">{results.structure.type}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {results.structure.type === 'Recharge Shaft' ? (
                  <>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-800">{results.structure.diameter}m</p>
                      <p className="text-xs text-gray-500">Diameter</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-800">{results.structure.depth}m</p>
                      <p className="text-xs text-gray-500">Depth</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-800">{results.structure.length}m</p>
                      <p className="text-xs text-gray-500">Length</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-800">{results.structure.width}m</p>
                      <p className="text-xs text-gray-500">Width</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-800">{results.structure.depth}m</p>
                      <p className="text-xs text-gray-500">Depth</p>
                    </div>
                  </>
                )}
                <div className="text-center p-3 bg-water-50 rounded-lg col-span-1">
                  <p className="text-2xl font-bold text-water-700">{(results.structure.volume / 1000).toFixed(1)}k</p>
                  <p className="text-xs text-water-600">Liters</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-700 mb-2">Soil Information</p>
                <p className="text-sm text-gray-600">{results.soil.structure}</p>
                <p className="text-sm text-gray-500 mt-1">Infiltration: {results.soil.infiltrationRate}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cost Breakdown</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {costData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">Total Investment</p>
              <p className="text-3xl font-bold text-gray-900">₹{results.costs.total.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid lg:grid-cols-2 gap-8 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Harvest Potential</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${Math.round(value).toLocaleString()} L`} />
                  <Area type="monotone" dataKey="harvest" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Water Usage Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterUsageData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip formatter={(value) => `${Math.round(value).toLocaleString()} L`} />
                  <Bar dataKey="value" fill="#14b8a6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recommendations</h2>
          <div className="space-y-3">
            {results.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={() => generatePDF('report')}
            disabled={loading}
            className="btn-primary flex items-center space-x-2"
          >
            <FileText className="w-5 h-5" />
            <span>Download Report</span>
          </button>
          
          <button
            onClick={() => generatePDF('blueprint')}
            disabled={loading}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>DIY Blueprint</span>
          </button>
          
          <Link to="/marketplace" className="btn-secondary flex items-center space-x-2">
            <span>Find Vendors</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <Link to="/subsidies" className="btn-secondary flex items-center space-x-2">
            <span>Check Subsidies</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
