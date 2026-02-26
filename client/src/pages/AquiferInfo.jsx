import { useState } from 'react'
import { motion } from 'framer-motion'
import { Map, Layers, Droplets, ChevronRight, Info, Activity, ArrowDown } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import axios from 'axios'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const aquiferTypes = [
  {
    id: 'alluvial-plain',
    name: 'Alluvial Aquifer',
    description: 'Formed by river deposits, these aquifers have high water yield potential.',
    characteristics: ['High transmissivity', 'Shallow water table', 'Excellent for recharge pits'],
    states: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Bihar', 'West Bengal'],
    color: '#0ea5e9'
  },
  {
    id: 'hard-rock',
    name: 'Weathered & Fractured Rock',
    description: 'Found in peninsular India, these require specific recharge techniques.',
    characteristics: ['Variable yield', 'Deeper water table', 'Suitable for recharge shafts'],
    states: ['Karnataka', 'Maharashtra', 'Tamil Nadu', 'Telangana', 'Madhya Pradesh'],
    color: '#14b8a6'
  },
  {
    id: 'sedimentary',
    name: 'Sedimentary Basin',
    description: 'Deep aquifers with confined conditions in some areas.',
    characteristics: ['Deep groundwater', 'Confined conditions', 'Artesian potential'],
    states: ['Rajasthan', 'Gujarat', 'Assam'],
    color: '#f59e0b'
  },
  {
    id: 'coastal',
    name: 'Coastal Aquifer',
    description: 'Freshwater lenses floating over saline water near coastlines.',
    characteristics: ['Saline intrusion risk', 'Lens-shaped freshwater', 'Requires careful management'],
    states: ['Kerala', 'Goa', 'Gujarat Coast', 'Tamil Nadu Coast'],
    color: '#ef4444'
  }
]

const depthData = {
  preMonsoon: 12.5,
  postMonsoon: 8.2,
  historical: [
    { year: 2010, depth: 8.5 },
    { year: 2015, depth: 10.2 },
    { year: 2020, depth: 11.8 },
    { year: 2024, depth: 12.5 }
  ]
}

export default function AquiferInfo() {
  const [selectedAquifer, setSelectedAquifer] = useState(aquiferTypes[0])
  const [show3D, setShow3D] = useState(false)

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Layers className="w-4 h-4" />
            <span>CGWB Data Integration</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Understand Your <span className="gradient-text">Aquifer</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the underground water systems beneath your feet and learn how different 
            aquifer types influence recharge strategies.
          </p>
        </motion.div>

        {/* Aquifer Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {aquiferTypes.map((aquifer) => (
            <button
              key={aquifer.id}
              onClick={() => setSelectedAquifer(aquifer)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedAquifer.id === aquifer.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div 
                className="w-4 h-4 rounded-full mb-3"
                style={{ backgroundColor: aquifer.color }}
              />
              <h3 className="font-semibold text-gray-900">{aquifer.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{aquifer.states.length} states</p>
            </button>
          ))}
        </motion.div>

        {/* Selected Aquifer Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-8 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${selectedAquifer.color}20` }}
              >
                <Droplets className="w-6 h-6" style={{ color: selectedAquifer.color }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedAquifer.name}</h2>
                <p className="text-gray-500">Principal Aquifer Type</p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">{selectedAquifer.description}</p>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Key Characteristics</h3>
              <ul className="space-y-2">
                {selectedAquifer.characteristics.map((char, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: selectedAquifer.color }}
                    />
                    <span className="text-gray-600">{char}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-3">Found In States</h3>
              <div className="flex flex-wrap gap-2">
                {selectedAquifer.states.map((state) => (
                  <span 
                    key={state}
                    className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                  >
                    {state}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 3D Visualization */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">3D Aquifer View</h2>
              <button 
                onClick={() => setShow3D(!show3D)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {show3D ? 'Hide Layers' : 'Show Layers'}
              </button>
            </div>

            <div className="relative h-80 bg-gradient-to-b from-sky-100 to-amber-50 rounded-xl overflow-hidden">
              {/* Surface */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-green-200 flex items-center justify-center">
                <span className="text-green-800 font-medium">Ground Surface</span>
              </div>

              {/* Soil Layer */}
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: show3D ? '20%' : 0 }}
                className="absolute top-16 left-0 right-0 bg-amber-100 flex items-center justify-center overflow-hidden"
              >
                <span className="text-amber-800 font-medium">Top Soil (1-2m)</span>
              </motion.div>

              {/* Weathered Zone */}
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: show3D ? '25%' : 0 }}
                className="absolute top-[36%] left-0 right-0 bg-amber-200 flex items-center justify-center overflow-hidden"
              >
                <span className="text-amber-800 font-medium">Weathered Zone</span>
              </motion.div>

              {/* Saturated Zone */}
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: show3D ? '30%' : 0 }}
                className="absolute top-[61%] left-0 right-0 flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: `${selectedAquifer.color}40` }}
              >
                <div className="text-center">
                  <Droplets className="w-8 h-8 mx-auto mb-1" style={{ color: selectedAquifer.color }} />
                  <span className="font-medium" style={{ color: selectedAquifer.color }}>
                    Saturated Zone (Aquifer)
                  </span>
                </div>
              </motion.div>

              {/* Bedrock */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-400 flex items-center justify-center">
                <span className="text-gray-800 font-medium">Bedrock</span>
              </div>

              {/* Water Level Indicator */}
              <div className="absolute right-4 top-20 bottom-20 w-8 bg-white/50 rounded-full flex flex-col items-center justify-between py-2">
                <span className="text-xs text-gray-600">Surface</span>
                <ArrowDown className="w-4 h-4 text-blue-500 animate-bounce" />
                <span className="text-xs text-gray-600">12m</span>
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
              <Info className="w-4 h-4" />
              <span>Water table depth varies seasonally (±3m)</span>
            </div>
          </div>
        </motion.div>

        {/* Groundwater Level Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Activity className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900">Groundwater Level Trends</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-red-50 rounded-xl">
              <p className="text-sm text-red-600 mb-1">Pre-Monsoon Depth</p>
              <p className="text-3xl font-bold text-red-700">{depthData.preMonsoon}m</p>
              <p className="text-xs text-red-500 mt-1">Below ground level</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-green-600 mb-1">Post-Monsoon Depth</p>
              <p className="text-3xl font-bold text-green-700">{depthData.postMonsoon}m</p>
              <p className="text-xs text-green-500 mt-1">Below ground level</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl">
              <p className="text-sm text-orange-600 mb-1">Declining Rate</p>
              <p className="text-3xl font-bold text-orange-700">0.5m</p>
              <p className="text-xs text-orange-500 mt-1">Per year (2010-2024)</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold text-gray-900 mb-4">Historical Depth to Water Level</h3>
            <div className="flex items-end justify-between h-32 px-4">
              {depthData.historical.map((data, idx) => (
                <div key={data.year} className="flex flex-col items-center">
                  <div 
                    className="w-12 bg-gradient-to-t from-primary-500 to-primary-300 rounded-t-lg transition-all duration-500"
                    style={{ height: `${data.depth * 8}px` }}
                  />
                  <span className="text-sm text-gray-600 mt-2">{data.year}</span>
                  <span className="text-xs text-gray-400">{data.depth}m</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recharge Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-primary-600 to-water-600 rounded-2xl p-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-4">Recommended Recharge Strategy</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-semibold mb-2">Best Structure</h3>
              <p className="text-primary-100">
                {selectedAquifer.id === 'hard-rock' ? 'Recharge Shaft with Borewell' :
                 selectedAquifer.id === 'alluvial-plain' ? 'Recharge Pit/Trench' :
                 selectedAquifer.id === 'coastal' ? 'Recharge Shaft with Salinity Barrier' :
                 'Deep Recharge Shaft'}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-semibold mb-2">Expected Recharge</h3>
              <p className="text-primary-100">
                {selectedAquifer.id === 'alluvial-plain' ? 'High (1000-2000 L/day)' :
                 selectedAquifer.id === 'hard-rock' ? 'Medium (500-1000 L/day)' :
                 'Low-Medium (300-800 L/day)'}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-semibold mb-2">Maintenance</h3>
              <p className="text-primary-100">
                Clean filter every 3 months, inspect structure annually
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
