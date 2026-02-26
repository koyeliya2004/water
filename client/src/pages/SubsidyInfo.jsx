import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, CheckCircle, ExternalLink, MapPin, IndianRupee, Building, Home, Info, ChevronDown, ChevronUp } from 'lucide-react'
import axios from 'axios'

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Chandigarh', 'Puducherry'
]

export default function SubsidyInfo() {
  const [selectedState, setSelectedState] = useState('')
  const [propertyType, setPropertyType] = useState('residential')
  const [schemes, setSchemes] = useState([])
  const [centralSchemes, setCentralSchemes] = useState([])
  const [loading, setLoading] = useState(false)
  const [expandedScheme, setExpandedScheme] = useState(null)

  const checkSubsidies = async () => {
    if (!selectedState) return
    setLoading(true)
    try {
      const response = await axios.post('/api/subsidy/check', {
        state: selectedState,
        propertyType
      })
      setSchemes(response.data.data.schemes)
      setCentralSchemes(response.data.data.centralSchemes)
    } catch (error) {
      console.error('Failed to fetch subsidies:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (selectedState) {
      checkSubsidies()
    }
  }, [selectedState, propertyType])

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <IndianRupee className="w-4 h-4" />
            <span>Government Schemes</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Subsidy & Incentive <span className="gradient-text">Tracker</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover financial assistance available for rainwater harvesting from central and state governments.
          </p>
        </motion.div>

        {/* Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Your State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="input-field"
              >
                <option value="">Choose a state</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setPropertyType('residential')}
                  className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-xl border-2 transition-all ${
                    propertyType === 'residential'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Residential</span>
                </button>
                <button
                  onClick={() => setPropertyType('commercial')}
                  className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-xl border-2 transition-all ${
                    propertyType === 'commercial'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Building className="w-5 h-5" />
                  <span>Commercial</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {selectedState && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* State Schemes */}
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {selectedState} State Schemes
            </h2>
            
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading schemes...</div>
            ) : schemes.length > 0 ? (
              <div className="space-y-4 mb-8">
                {schemes.map((scheme, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedScheme(expandedScheme === index ? null : index)}
                      className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">{scheme.scheme}</h3>
                          <p className="text-sm text-gray-500">{scheme.department}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm font-medium text-green-600">{scheme.subsidyAmount}</span>
                            <span className="text-xs text-gray-400">Deadline: {scheme.deadline}</span>
                          </div>
                        </div>
                      </div>
                      {expandedScheme === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedScheme === index && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        className="px-6 pb-6 border-t bg-gray-50"
                      >
                        <div className="pt-4 space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Eligibility</h4>
                            <p className="text-sm text-gray-600">{scheme.eligibility}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Required Documents</h4>
                            <ul className="space-y-1">
                              {scheme.documents.map((doc, idx) => (
                                <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span>{doc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <a 
                            href={scheme.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                          >
                            <span>Visit Official Website</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800">No specific schemes found</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      While there may not be state-specific schemes, check the central government schemes below 
                      or contact your local municipality for RWH mandates and rebates.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Central Schemes */}
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Central Government Schemes
            </h2>
            
            <div className="space-y-4">
              {centralSchemes.map((scheme, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl shadow-md p-6 border border-orange-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{scheme.scheme}</h3>
                        <p className="text-sm text-gray-500">{scheme.ministry}</p>
                        <p className="text-sm font-medium text-orange-600 mt-2">{scheme.subsidyAmount}</p>
                        <p className="text-sm text-gray-600 mt-1">{scheme.eligibility}</p>
                      </div>
                    </div>
                    <a 
                      href={scheme.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* How to Apply */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Apply for Subsidies</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Check Eligibility', desc: 'Verify you meet all criteria for the scheme' },
              { step: 2, title: 'Gather Documents', desc: 'Collect all required documents and certificates' },
              { step: 3, title: 'Submit Application', desc: 'Apply online or at the designated office' },
              { step: 4, title: 'Follow Up', desc: 'Track status and provide additional info if needed' }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-primary-600 to-water-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Start Your RWH Project?</h3>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Get a detailed assessment of your rainwater harvesting potential and estimated subsidy amount.
          </p>
          <a 
            href="/assessment"
            className="inline-block px-8 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Free Assessment
          </a>
        </motion.div>
      </div>
    </div>
  )
}
