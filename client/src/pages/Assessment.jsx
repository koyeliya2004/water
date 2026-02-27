import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { 
  MapPin, Upload, Camera, Calculator, ChevronRight, ChevronLeft, 
  Check, Droplets, Home, Users, Ruler, Layers, Loader 
} from 'lucide-react'
import L from 'leaflet'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

// Indian states
const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Chandigarh', 'Puducherry'
]

const roofTypes = [
  { value: 'concrete', label: 'Concrete/RCC', coeff: 0.85 },
  { value: 'metal', label: 'Metal/Sheet', coeff: 0.90 },
  { value: 'tiles', label: 'Clay/Concrete Tiles', coeff: 0.75 },
  { value: 'asbestos', label: 'Asbestos Sheets', coeff: 0.80 },
  { value: 'flat', label: 'Flat Roof', coeff: 0.80 }
]

const soilTypes = [
  { value: 'sandy', label: 'Sandy Soil', desc: 'High infiltration rate' },
  { value: 'loamy', label: 'Loamy Soil', desc: 'Medium infiltration rate' },
  { value: 'clay', label: 'Clay Soil', desc: 'Low infiltration rate' },
  { value: 'rocky', label: 'Rocky/Hard Rock', desc: 'Variable infiltration' }
]

function LocationPicker({ position, setPosition, setAddress }) {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
      // Reverse geocoding would happen here in production
      setAddress(`Lat: ${e.latlng.lat.toFixed(4)}, Lng: ${e.latlng.lng.toFixed(4)}`)
    }
  })
  
  return position ? <Marker position={position} /> : null
}

export default function Assessment() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [position, setPosition] = useState([20.5937, 78.9629]) // India center
  const [markerPosition, setMarkerPosition] = useState(null)
  const [roofAnalysis, setRoofAnalysis] = useState(null)
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const fileInputRef = useRef(null)
  
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    address: '',
    latitude: null,
    longitude: null,
    roofArea: '',
    roofType: 'concrete',
    openSpace: '',
    soilType: 'loamy',
    numDwellers: '',
    waterUsage: 135
  })

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const analyzeRoofFromMap = async () => {
    if (!markerPosition) return
    setAnalysisLoading(true)
    try {
      const response = await axios.post('/api/roof-detect/analyze-map', {
        latitude: markerPosition[0],
        longitude: markerPosition[1],
        address: formData.address
      })
      setRoofAnalysis(response.data.data)
      updateForm('roofArea', response.data.data.analysis.effectiveArea)
    } catch (error) {
      console.error('Roof analysis failed:', error)
    }
    setAnalysisLoading(false)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const formDataImg = new FormData()
    formDataImg.append('image', file)
    
    setAnalysisLoading(true)
    try {
      const response = await axios.post('/api/roof-detect/upload-image', formDataImg, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setRoofAnalysis(response.data.data)
      updateForm('roofArea', response.data.data.analysis.roofArea)
    } catch (error) {
      console.error('Image analysis failed:', error)
    }
    setAnalysisLoading(false)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/api/assessment/calculate', formData)
      // Store results in localStorage for results page
      localStorage.setItem('assessmentResults', JSON.stringify(response.data.data))
      navigate('/results')
    } catch (error) {
      console.error('Assessment failed:', error)
      alert('Assessment failed. Please try again.')
    }
    setLoading(false)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  className="input-field"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => updateForm('state', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select your state</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address/Location</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateForm('address', e.target.value)}
                  className="input-field"
                  placeholder="Enter your address"
                />
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">Select Location</h2>
            <p className="text-gray-600">Click on the map to pinpoint your location for accurate analysis.</p>
            
            <div className="h-80 rounded-xl overflow-hidden border border-gray-200">
              <MapContainer
                center={position}
                zoom={5}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker 
                  position={markerPosition} 
                  setPosition={setMarkerPosition}
                  setAddress={(addr) => updateForm('address', addr)}
                />
              </MapContainer>
            </div>
            
            {markerPosition && (
              <div className="bg-primary-50 p-4 rounded-lg">
                <p className="text-sm text-primary-700">
                  Selected: {markerPosition[0].toFixed(4)}, {markerPosition[1].toFixed(4)}
                </p>
              </div>
            )}
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">Roof Detection</h2>
            <p className="text-gray-600">Automatically detect your roof area using AI or enter manually.</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={analyzeRoofFromMap}
                disabled={!markerPosition || analysisLoading}
                className="p-6 border-2 border-dashed border-primary-300 rounded-xl hover:border-primary-500 transition-colors flex flex-col items-center space-y-3 disabled:opacity-50"
              >
                {analysisLoading ? (
                  <Loader className="w-10 h-10 text-primary-500 animate-spin" />
                ) : (
                  <Camera className="w-10 h-10 text-primary-500" />
                )}
                <span className="font-medium text-gray-700">Auto-Detect from Map</span>
                <span className="text-sm text-gray-500">Uses satellite imagery</span>
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={analysisLoading}
                className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-500 transition-colors flex flex-col items-center space-y-3 disabled:opacity-50"
              >
                {analysisLoading ? (
                  <Loader className="w-10 h-10 text-gray-500 animate-spin" />
                ) : (
                  <Upload className="w-10 h-10 text-gray-500" />
                )}
                <span className="font-medium text-gray-700">Upload Roof Photo</span>
                <span className="text-sm text-gray-500">Take a photo from ground level</span>
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {roofAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Analysis Complete</span>
                </div>
                <p className="text-sm text-green-700">
                  Detected roof area:{' '}
                  <strong>
                    {roofAnalysis.analysis.effectiveArea ?? roofAnalysis.analysis.roofArea} m²
                  </strong>
                  <br />
                  Roof type: <strong>{roofAnalysis.analysis.roofType}</strong>
                  <br />
                  Confidence: <strong>{roofAnalysis.analysis.confidence}%</strong>
                </p>

                {roofAnalysis.imagery?.imageUrl ? (
                  <div className="rounded-lg overflow-hidden border border-green-200 bg-white">
                    <img
                      src={roofAnalysis.imagery.imageUrl}
                      alt="Satellite roof preview"
                      className="w-full h-48 object-cover"
                    />
                    <div className="px-3 py-2 text-xs text-green-700 bg-green-100">
                      Satellite preview via {roofAnalysis.imagery.provider}
                    </div>
                  </div>
                ) : (
                  roofAnalysis.imagery?.note && (
                    <div className="text-xs text-green-800 bg-green-100 border border-green-200 rounded-lg p-3">
                      {roofAnalysis.imagery.note}
                    </div>
                  )
                )}

                {roofAnalysis.analysis.pipeline && (
                  <div>
                    <p className="text-xs font-semibold text-green-800">Detection Pipeline</p>
                    <ul className="text-xs text-green-700 list-disc list-inside mt-1 space-y-1">
                      {roofAnalysis.analysis.pipeline.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
            
            <div className="pt-4 border-t">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or enter roof area manually (m²)
              </label>
              <input
                type="number"
                value={formData.roofArea}
                onChange={(e) => updateForm('roofArea', e.target.value)}
                className="input-field"
                placeholder="e.g., 150"
              />
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">Property Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Roof Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {roofTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => updateForm('roofType', type.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        formData.roofType === type.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{type.label}</div>
                      <div className="text-xs text-gray-500">Coeff: {type.coeff}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Open Space (m²)</label>
                <input
                  type="number"
                  value={formData.openSpace}
                  onChange={(e) => updateForm('openSpace', e.target.value)}
                  className="input-field"
                  placeholder="Space for recharge structure"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {soilTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => updateForm('soilType', type.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        formData.soilType === type.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">Household Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Residents</label>
                <input
                  type="number"
                  value={formData.numDwellers}
                  onChange={(e) => updateForm('numDwellers', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 4"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Water Usage per Person (Liters)
                </label>
                <input
                  type="number"
                  value={formData.waterUsage}
                  onChange={(e) => updateForm('waterUsage', e.target.value)}
                  className="input-field"
                  placeholder="Default: 135 LPCD"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Default is 135 liters per capita per day (LPCD) as per Indian standards
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Review Your Information</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Name:</strong> {formData.name || 'Not provided'}</p>
                <p><strong>State:</strong> {formData.state || 'Not selected'}</p>
                <p><strong>Roof Area:</strong> {formData.roofArea ? `${formData.roofArea} m²` : 'Not provided'}</p>
                <p><strong>Residents:</strong> {formData.numDwellers || 'Not provided'}</p>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Harvest Potential Assessment</h1>
            <span className="text-sm text-gray-500">Step {step} of 5</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Basic Info</span>
            <span>Location</span>
            <span>Roof</span>
            <span>Property</span>
            <span>Review</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>
            
            {step < 5 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="btn-primary flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5" />
                    <span>Calculate Potential</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
