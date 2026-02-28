import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  CheckCircle, Circle, Clock, Upload, ChevronRight, 
  Tool, Building2, Wrench, ArrowRight, Star, MapPin,
  Calendar, Camera, FileText, AlertCircle
} from 'lucide-react'
import axios from 'axios'

export default function Implementation() {
  const navigate = useNavigate()
  const [implementation, setImplementation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedType, setSelectedType] = useState(null)

  useEffect(() => {
    fetchCurrentImplementation()
  }, [])

  const fetchCurrentImplementation = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/implementation/user/current', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      if (response.data.success && response.data.data) {
        setImplementation(response.data.data)
      }
    } catch (error) {
      console.log('No active implementation found')
    } finally {
      setLoading(false)
    }
  }

  const startImplementation = async (type) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('/api/implementation/start', {
        title: `RTRWH Project - ${new Date().toLocaleDateString()}`,
        type,
        startDate: new Date().toISOString(),
        estimatedCompletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      
      if (response.data.success) {
        setImplementation(response.data.data)
        setShowModal(false)
      }
    } catch (error) {
      console.error('Failed to start implementation:', error)
    }
  }

  const updateChecklist = async (itemId, completed) => {
    if (!implementation) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(`/api/implementation/${implementation._id}/checklist`, {
        itemId,
        completed,
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      
      if (response.data.success) {
        setImplementation(prev => ({
          ...prev,
          checklist: prev.checklist.map(item => 
            item.id === itemId ? { ...item, completed } : item
          ),
          completionPercentage: response.data.data.completionPercentage,
        }))
      }
    } catch (error) {
      console.error('Failed to update checklist:', error)
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'preparation': return Tool
      case 'installation': return Wrench
      case 'testing': return CheckCircle
      case 'documentation': return Camera
      case 'maintenance': return Calendar
      default: return Circle
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'preparation': return 'text-blue-500 bg-blue-50'
      case 'installation': return 'text-green-500 bg-green-50'
      case 'testing': return 'text-purple-500 bg-purple-50'
      case 'documentation': return 'text-orange-500 bg-orange-50'
      case 'maintenance': return 'text-gray-500 bg-gray-50'
      default: return 'text-gray-500 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }

  // If no implementation exists, show the start screen
  if (!implementation) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Start Your <span className="gradient-text">Implementation</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Congratulations on completing your assessment! Now it's time to implement your rainwater harvesting system.
              Choose how you'd like to proceed.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* DIY Option */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6">
                <Tool className="w-12 h-12 text-white mb-4" />
                <h3 className="text-2xl font-bold text-white">DIY Installation</h3>
                <p className="text-green-100 mt-2">
                  Build it yourself and save money
                </p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Cost-effective solution
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Download detailed blueprints
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Step-by-step guidance
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Earn 200 credits on completion
                  </li>
                </ul>
                <button
                  onClick={() => startImplementation('DIY')}
                  className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  Start DIY Project <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </motion.div>

            {/* Vendor Option */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6">
                <Building2 className="w-12 h-12 text-white mb-4" />
                <h3 className="text-2xl font-bold text-white">Hire a Vendor</h3>
                <p className="text-blue-100 mt-2">
                  Professional installation by experts
                </p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
                    Verified local vendors
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
                    Get multiple quotes
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
                    Professional installation
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
                    Earn 100 credits on completion
                  </li>
                </ul>
                <button
                  onClick={() => navigate('/marketplace')}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  Browse Vendors <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 bg-gradient-to-r from-primary-50 to-water-50 rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/subsidies')}
                className="flex items-center p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
              >
                <FileText className="w-8 h-8 text-purple-500" />
                <div className="ml-3 text-left">
                  <div className="font-medium text-gray-900">Check Subsidies</div>
                  <div className="text-sm text-gray-500">Find government schemes</div>
                </div>
              </button>
              <button
                onClick={() => navigate('/marketplace')}
                className="flex items-center p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
              >
                <Tool className="w-8 h-8 text-green-500" />
                <div className="ml-3 text-left">
                  <div className="font-medium text-gray-900">Get Materials</div>
                  <div className="text-sm text-gray-500">Browse marketplace</div>
                </div>
              </button>
              <button
                onClick={() => navigate('/results')}
                className="flex items-center p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
              >
                <FileText className="w-8 h-8 text-blue-500" />
                <div className="ml-3 text-left">
                  <div className="font-medium text-gray-900">View Assessment</div>
                  <div className="text-sm text-gray-500">See your results</div>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Show implementation progress
  const categories = [...new Set(implementation.checklist.map(item => item.category))]
  const completedCount = implementation.checklist.filter(item => item.completed).length

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{implementation.title}</h1>
              <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  {implementation.type === 'DIY' ? <Tool className="w-4 h-4 mr-1" /> : <Building2 className="w-4 h-4 mr-1" />}
                  {implementation.type} Installation
                </span>
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {implementation.location?.city || 'Not set'}, {implementation.location?.state || 'Not set'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold gradient-text">{implementation.completionPercentage}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-water-500"
              initial={{ width: 0 }}
              animate={{ width: `${implementation.completionPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate('/results')}
            className="flex items-center justify-center p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
          >
            <FileText className="w-6 h-6 text-primary-500 mr-3" />
            <span className="font-medium">View Blueprint</span>
          </button>
          <button
            onClick={() => navigate('/marketplace')}
            className="flex items-center justify-center p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
          >
            <Tool className="w-6 h-6 text-green-500 mr-3" />
            <span className="font-medium">Get Quotes</span>
          </button>
          <button
            onClick={() => navigate('/subsidies')}
            className="flex items-center justify-center p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
          >
            <Star className="w-6 h-6 text-purple-500 mr-3" />
            <span className="font-medium">Apply for Subsidy</span>
          </button>
        </div>

        {/* Checklist by Category */}
        {categories.map((category, categoryIndex) => {
          const categoryItems = implementation.checklist.filter(item => item.category === category)
          const categoryCompleted = categoryItems.filter(item => item.completed).length
          const CategoryIcon = getCategoryIcon(category)
          
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden"
            >
              <div className={`p-4 flex items-center justify-between ${getCategoryColor(category)}`}>
                <div className="flex items-center">
                  <CategoryIcon className="w-6 h-6 mr-3" />
                  <h3 className="font-semibold text-gray-900 capitalize">{category}</h3>
                </div>
                <span className="text-sm text-gray-600">
                  {categoryCompleted}/{categoryItems.length} complete
                </span>
              </div>
              
              <div className="divide-y divide-gray-100">
                {categoryItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => updateChecklist(item.id, !item.completed)}
                    className="w-full p-4 flex items-center hover:bg-gray-50 transition-colors text-left"
                  >
                    {item.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                    )}
                    <div className="ml-4 flex-1">
                      <div className={`font-medium ${item.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {item.title}
                      </div>
                      {item.description && (
                        <div className="text-sm text-gray-500">{item.description}</div>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </button>
                ))}
              </div>
            </motion.div>
          )
        })}

        {/* Complete Button */}
        {implementation.completionPercentage === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-900 mb-2">Congratulations!</h3>
            <p className="text-green-700 mb-4">
              You've completed your RTRWH implementation. Mark it as complete to earn credits!
            </p>
            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem('token')
                  await axios.put(`/api/implementation/${implementation._id}/complete`, {}, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                  })
                  alert('Implementation marked as complete! Credits will be awarded.')
                } catch (error) {
                  console.error('Failed to complete:', error)
                }
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Mark as Complete
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
