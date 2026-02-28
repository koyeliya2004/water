import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Download, FileText, ChevronRight, ChevronLeft, Play,
  AlertTriangle, CheckCircle, Clock, Users, Wrench, Star
} from 'lucide-react'
import axios from 'axios'

export default function Blueprint() {
  const navigate = useNavigate()
  const [blueprint, setBlueprint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    fetchBlueprintTemplates()
  }, [])

  const fetchBlueprintTemplates = async () => {
    try {
      const response = await axios.get('/api/report/blueprint-templates')
      if (response.data.success) {
        setBlueprint(response.data.data[0]) // Default to first template
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePDF = async () => {
    setGenerating(true)
    try {
      const stored = localStorage.getItem('assessmentResults')
      if (!stored) {
        alert('Please complete an assessment first')
        navigate('/assessment')
        return
      }

      const assessmentData = JSON.parse(stored)
      const response = await axios.post('/api/report/blueprint', {
        assessmentData,
        userInfo: assessmentData.userInfo,
        language,
      })

      if (response.data.success) {
        window.open(response.data.data.downloadUrl, '_blank')
      }
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading blueprints...</div>
      </div>
    )
  }

  // Default blueprint data for display
  const blueprintData = {
    name: 'Complete RTRWH Installation Guide',
    type: 'combined',
    difficulty: 'medium',
    estimatedTime: { value: 5, unit: 'days' },
    steps: [
      {
        title: 'Site Assessment',
        description: 'Survey your property to determine the best location for rain water harvesting components.',
        tips: [
          'Check roof slope and direction',
          'Identify nearest drain point',
          'Measure available space for tank/pit',
          'Check local ground conditions',
        ],
        warnings: ['Avoid areas near septic tanks', 'Check for underground utilities'],
        duration: '2-4 hours',
      },
      {
        title: 'Gutter Installation',
        description: 'Install gutters along the roof edges to collect rainwater.',
        tips: [
          'Ensure 1:100 slope towards downpipe',
          'Use correct size (4-6 inch) for area',
          'Seal all joints properly',
          'Install leaf guard at start',
        ],
        warnings: ['Ensure gutters are firmly attached', 'Check for leaks before monsoon'],
        duration: '4-6 hours',
      },
      {
        title: 'Downpipe Setup',
        description: 'Connect downpipes from gutters to filter system.',
        tips: [
          'Use appropriate diameter pipes',
          'Minimise bends for smooth flow',
          'Install ball valve for control',
          'Check for proper alignment',
        ],
        warnings: ['Secure pipes to wall', 'Check joints for leaks'],
        duration: '2-3 hours',
      },
      {
        title: 'Filter Installation',
        description: 'Install first flush diverter and mesh filter.',
        tips: [
          'Position filter at convenient height',
          'Clean filter monthly during monsoon',
          'Use stainless steel mesh for durability',
          'Install bypass for maintenance',
        ],
        warnings: ['Do not bypass filter', 'Check after heavy rain'],
        duration: '2-3 hours',
      },
      {
        title: 'Storage Tank Setup',
        description: 'Position and connect storage tank for water collection.',
        tips: [
          'Place on stable, raised platform',
          'Ensure level positioning',
          'Connect overflow to recharge',
          'Install outlet valve',
        ],
        warnings: ['Check tank for cracks', 'Ensure proper support'],
        duration: '4-6 hours',
      },
      {
        title: 'Recharge Structure',
        description: 'Excavate and construct recharge pit or trench.',
        tips: [
          'Dig at least 1m from wall',
          'Use proper gravel layer (6-12 inch)',
          'Add sand layer on top',
          'Cover with concrete slab',
        ],
        warnings: ['Check local regulations', 'Maintain safe distance from foundation'],
        duration: '1-2 days',
      },
      {
        title: 'Overflow Management',
        description: 'Connect overflow pipe from tank to recharge structure.',
        tips: [
          'Use appropriate size pipe',
          'Ensure proper slope',
          'Add mesh at exit point',
          'Direct excess water to garden',
        ],
        warnings: ['Do not direct to sewer', 'Check for blockages'],
        duration: '2-3 hours',
      },
      {
        title: 'System Testing',
        description: 'Test the complete system with water.',
        tips: [
          'Wait for first good rain',
          'Check all joints for leaks',
          'Verify water flow direction',
          'Clean filter after testing',
        ],
        warnings: ['Do not drink first flush water', 'Check overflow during heavy rain'],
        duration: '2-4 hours',
      },
    ],
    materials: [
      { item: 'Rainwater Filter', qty: 1, unit: 'nos', price: 3500 },
      { item: 'Storage Tank (2000L)', qty: 1, unit: 'nos', price: 8000 },
      { item: 'PVC Pipes (3 inch)', qty: 30, unit: 'meters', price: 180 },
      { item: 'Gutter System', qty: 25, unit: 'meters', price: 250 },
      { item: 'First Flush Diverter', qty: 1, unit: 'nos', price: 2200 },
      { item: 'Gravel', qty: 2, unit: 'cubic meters', price: 1500 },
      { item: 'Sand', qty: 1, unit: 'cubic meters', price: 800 },
      { item: 'Cement', qty: 10, unit: 'bags', price: 400 },
    ],
    safetyGuidelines: [
      'Wear safety equipment while digging',
      'Get help for heavy lifting',
      'Avoid working during rain',
      'Use proper ladder safety',
      'Keep children away from work area',
    ],
    maintenanceSchedule: [
      { frequency: 'Monthly', tasks: 'Clean filter, check gutters' },
      { frequency: 'Quarterly', tasks: 'Inspect tank, check valves' },
      { frequency: 'Annual', tasks: 'Full system inspection, clean tank' },
    ],
  }

  const totalCost = blueprintData.materials.reduce((sum, m) => sum + (m.qty * m.price), 0)

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            DIY <span className="gradient-text">Blueprint</span>
          </h1>
          <p className="text-lg text-gray-600">
            Step-by-step guide to building your rainwater harvesting system
          </p>
        </motion.div>

        {/* Language Toggle */}
        <div className="flex justify-end mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                language === 'en' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                language === 'hi' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Step {currentStep + 1} of {blueprintData.steps.length}
                </h2>
                <span className="text-sm text-gray-500">
                  {Math.round(((currentStep + 1) / blueprintData.steps.length) * 100)}% Complete
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-water-500 transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / blueprintData.steps.length) * 100}%` }}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {blueprintData.steps[currentStep].title}
              </h3>
              <p className="text-gray-600 mb-4">
                {blueprintData.steps[currentStep].description}
              </p>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Clock className="w-4 h-4 mr-2" />
                Estimated time: {blueprintData.steps[currentStep].duration}
              </div>

              {/* Tips */}
              {blueprintData.steps[currentStep].tips && (
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-green-900 mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Tips
                  </h4>
                  <ul className="space-y-1">
                    {blueprintData.steps[currentStep].tips.map((tip, i) => (
                      <li key={i} className="text-sm text-green-800 flex items-start">
                        <span className="mr-2">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {blueprintData.steps[currentStep].warnings && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Important Warnings
                  </h4>
                  <ul className="space-y-1">
                    {blueprintData.steps[currentStep].warnings.map((warning, i) => (
                      <li key={i} className="text-sm text-yellow-800 flex items-start">
                        <span className="mr-2">⚠️</span>
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </button>
              <button
                onClick={() => setCurrentStep(Math.min(blueprintData.steps.length - 1, currentStep + 1))}
                disabled={currentStep === blueprintData.steps.length - 1}
                className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
              <button
                onClick={generatePDF}
                disabled={generating}
                className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors mb-3"
              >
                <Download className="w-5 h-5 mr-2" />
                {generating ? 'Generating PDF...' : 'Download PDF'}
              </button>
              <button
                onClick={() => navigate('/implementation')}
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                <Wrench className="w-5 h-5 mr-2" />
                Start Implementation
              </button>
            </div>

            {/* Project Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Project Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Difficulty</span>
                  <span className="flex items-center font-medium">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    {blueprintData.difficulty}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Est. Time</span>
                  <span className="font-medium">{blueprintData.estimatedTime.value} {blueprintData.estimatedTime.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Est. Cost</span>
                  <span className="font-medium text-green-600">₹{totalCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Steps Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">All Steps</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {blueprintData.steps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-full flex items-center p-2 rounded-lg text-left transition-colors ${
                      currentStep === index
                        ? 'bg-primary-50 text-primary-700'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3 ${
                      currentStep === index
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-sm">{step.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bill of Materials */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Bill of Materials</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {blueprintData.materials.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.item}</span>
                    <span className="font-medium">₹{(item.qty * item.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-green-600">₹{totalCost.toLocaleString()}</span>
              </div>
            </div>

            {/* Maintenance */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Maintenance Schedule</h3>
              <div className="space-y-3">
                {blueprintData.maintenanceSchedule.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <Clock className="w-4 h-4 text-primary-500 mr-3 mt-1" />
                    <div>
                      <div className="font-medium text-sm">{item.frequency}</div>
                      <div className="text-xs text-gray-500">{item.tasks}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
