import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Droplets,
  Info,
  Layers,
  MapPin,
  Navigation,
  RefreshCcw
} from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import axios from 'axios'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const aquiferColorMap = {
  'alluvial-plain': '#0ea5e9',
  'hard-rock': '#14b8a6',
  sedimentary: '#f59e0b',
  coastal: '#ef4444',
  island: '#6366f1'
}

const defaultAquiferTypes = [
  {
    id: 'alluvial-plain',
    name: 'Alluvial Aquifer',
    description: 'Formed by river deposits, these aquifers have high water yield potential.',
    characteristics: ['High transmissivity', 'Shallow water table', 'Excellent for recharge pits'],
    states: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Bihar', 'West Bengal'],
    color: aquiferColorMap['alluvial-plain']
  },
  {
    id: 'hard-rock',
    name: 'Weathered & Fractured Rock',
    description: 'Found in peninsular India, these require specific recharge techniques.',
    characteristics: ['Variable yield', 'Deeper water table', 'Suitable for recharge shafts'],
    states: ['Karnataka', 'Maharashtra', 'Tamil Nadu', 'Telangana', 'Madhya Pradesh'],
    color: aquiferColorMap['hard-rock']
  },
  {
    id: 'sedimentary',
    name: 'Sedimentary Basin',
    description: 'Deep aquifers with confined conditions in some areas.',
    characteristics: ['Deep groundwater', 'Confined conditions', 'Artesian potential'],
    states: ['Rajasthan', 'Gujarat', 'Assam'],
    color: aquiferColorMap.sedimentary
  },
  {
    id: 'coastal',
    name: 'Coastal Aquifer',
    description: 'Freshwater lenses floating over saline water near coastlines.',
    characteristics: ['Saline intrusion risk', 'Lens-shaped freshwater', 'Requires careful management'],
    states: ['Kerala', 'Goa', 'Gujarat Coast', 'Tamil Nadu Coast'],
    color: aquiferColorMap.coastal
  }
]

const indianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Chandigarh',
  'Puducherry'
]

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

function LocationPicker({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation([e.latlng.lat, e.latlng.lng])
    }
  })

  return null
}

function Aquifer3DView({ layers, waterTableDepth, surfaceElevation }) {
  const depthScale = 0.05
  const width = 4
  const depth = 3

  const totalDepth = useMemo(
    () => layers.reduce((sum, layer) => sum + layer.thickness, 0),
    [layers]
  )

  let depthCursor = 0
  const layerMeshes = layers.map((layer) => {
    const height = layer.thickness * depthScale
    const positionY = -(depthCursor + layer.thickness / 2) * depthScale
    depthCursor += layer.thickness

    return {
      ...layer,
      height,
      positionY
    }
  })

  return (
    <Canvas className="h-72 w-full" camera={{ position: [6, 4, 6], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 4]} intensity={0.8} />
      <group position={[0, (totalDepth * depthScale) / 4, 0]}>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[width + 0.5, 0.1, depth + 0.5]} />
          <meshStandardMaterial color="#86efac" />
        </mesh>
        {layerMeshes.map((layer) => (
          <mesh key={layer.name} position={[0, layer.positionY, 0]}>
            <boxGeometry args={[width, layer.height, depth]} />
            <meshStandardMaterial color={layer.color} opacity={0.9} transparent />
          </mesh>
        ))}
        {Number.isFinite(waterTableDepth) && (
          <mesh position={[0, -waterTableDepth * depthScale, 0]}>
            <boxGeometry args={[width + 0.2, 0.05, depth + 0.2]} />
            <meshStandardMaterial color="#38bdf8" opacity={0.6} transparent />
          </mesh>
        )}
      </group>
      <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.2} />
    </Canvas>
  )
}

export default function AquiferInfo() {
  const [aquiferTypes, setAquiferTypes] = useState(defaultAquiferTypes)
  const [selectedAquifer, setSelectedAquifer] = useState(defaultAquiferTypes[0])
  const [show3D, setShow3D] = useState(false)
  const [location, setLocation] = useState([28.6139, 77.209])
  const [selectedState, setSelectedState] = useState('Delhi')
  const [aquiferInfo, setAquiferInfo] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get('/api/aquifer/types')
        const mappedTypes = response.data.data.map((type) => {
          const fallback = defaultAquiferTypes.find((item) => item.id === type.id)
          return {
            ...fallback,
            ...type,
            color: fallback?.color || aquiferColorMap[type.id] || '#0ea5e9',
            characteristics: fallback?.characteristics || [],
            states: fallback?.states || []
          }
        })
        setAquiferTypes(mappedTypes)
      } catch (error) {
        console.error('Failed to load aquifer types:', error)
      }
    }

    fetchTypes()
  }, [])

  const fetchAquiferInfo = async (coords = location, state = selectedState) => {
    setLoading(true)
    try {
      const response = await axios.post('/api/aquifer/info', {
        latitude: coords[0],
        longitude: coords[1],
        state
      })
      setAquiferInfo(response.data.data)
    } catch (error) {
      console.error('Aquifer info fetch failed:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAquiferInfo()
  }, [location, selectedState])

  useEffect(() => {
    if (aquiferInfo?.aquifer?.category) {
      const match = aquiferTypes.find((type) => type.id === aquiferInfo.aquifer.category)
      if (match) {
        setSelectedAquifer(match)
      }
    }
  }, [aquiferInfo, aquiferTypes])

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation([position.coords.latitude, position.coords.longitude])
    })
  }

  const groundwaterLevels = aquiferInfo?.groundwaterLevels || {
    preMonsoonDepth: 12.5,
    postMonsoonDepth: 8.2,
    historical: [
      { year: 2010, depth: 8.5 },
      { year: 2015, depth: 10.2 },
      { year: 2020, depth: 11.8 },
      { year: 2024, depth: 12.5 }
    ]
  }

  const visualization = aquiferInfo?.visualization3D
  const visualizationLayers = visualization?.layers || []

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
            <span>CGWB + GIS Data Integration</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Understand Your <span className="gradient-text">Aquifer</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the underground water systems beneath your feet and learn how different
            aquifer types influence recharge strategies.
          </p>
        </motion.div>

        {/* Location Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Locate Your Aquifer</h2>
              <p className="text-sm text-gray-500">
                Tap on the map or use GPS to view underground layers for your location.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleUseMyLocation}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-300"
              >
                <Navigation className="w-4 h-4" />
                <span>Use My Location</span>
              </button>
              <button
                onClick={() => fetchAquiferInfo()}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700"
              >
                <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Updating...' : 'Refresh Data'}</span>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[2fr,1fr] gap-6">
            <div className="h-72 rounded-xl overflow-hidden border border-gray-200">
              <MapContainer center={location} zoom={6} className="h-full w-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker setLocation={setLocation} />
                <Marker position={location} />
              </MapContainer>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-4">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4" />
                <span>
                  {location[0].toFixed(4)}, {location[1].toFixed(4)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select State</label>
                <select
                  value={selectedState}
                  onChange={(event) => setSelectedState(event.target.value)}
                  className="input-field"
                >
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              {aquiferInfo && (
                <div className="rounded-lg bg-white border border-slate-200 p-3 text-sm text-slate-600">
                  <p className="font-semibold text-slate-800 mb-1">Detected Aquifer</p>
                  <p>{aquiferInfo.aquifer.name}</p>
                  <p className="text-xs text-slate-500 mt-1">Depth to water table: {aquiferInfo.aquifer.depthToWater}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Aquifer Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
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
                <h2 className="text-2xl font-bold text-gray-900">
                  {aquiferInfo?.aquifer?.name || selectedAquifer.name}
                </h2>
                <p className="text-gray-500">Principal Aquifer Type</p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              {aquiferInfo?.aquifer?.lithology || selectedAquifer.description}
            </p>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Key Characteristics</h3>
              <ul className="space-y-2">
                {(selectedAquifer.characteristics.length
                  ? selectedAquifer.characteristics
                  : aquiferInfo?.aquifer
                  ? [
                      aquiferInfo.aquifer.type,
                      aquiferInfo.aquifer.transmissivity,
                      `Specific yield ${aquiferInfo.aquifer.specificYield}`
                    ]
                  : []
                ).map((char, idx) => (
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

            {aquiferInfo?.aquifer && (
              <div className="mt-6 pt-6 border-t grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-semibold text-gray-800">Thickness</p>
                  <p>{aquiferInfo.aquifer.thickness}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Water Quality</p>
                  <p>{aquiferInfo.aquifer.waterQuality}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Transmissivity</p>
                  <p>{aquiferInfo.aquifer.transmissivity}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Specific Yield</p>
                  <p>{aquiferInfo.aquifer.specificYield}</p>
                </div>
              </div>
            )}
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
              {show3D && visualizationLayers.length > 0 ? (
                <Aquifer3DView
                  layers={visualizationLayers}
                  waterTableDepth={visualization?.waterTable?.depth}
                  surfaceElevation={visualization?.surface?.elevation}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Click “Show Layers” to render the 3D aquifer model.
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600">
              {visualizationLayers.map((layer) => (
                <div key={layer.name} className="flex items-center space-x-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: layer.color }}
                  />
                  <span>{layer.name}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
              <Info className="w-4 h-4" />
              <span>
                Water table depth: {visualization?.waterTable?.depth || '--'}m below ground
              </span>
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
              <p className="text-3xl font-bold text-red-700">{groundwaterLevels.preMonsoonDepth}m</p>
              <p className="text-xs text-red-500 mt-1">Below ground level</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-green-600 mb-1">Post-Monsoon Depth</p>
              <p className="text-3xl font-bold text-green-700">{groundwaterLevels.postMonsoonDepth}m</p>
              <p className="text-xs text-green-500 mt-1">Below ground level</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl">
              <p className="text-sm text-orange-600 mb-1">Declining Rate</p>
              <p className="text-3xl font-bold text-orange-700">
                {aquiferInfo?.groundwaterTrend?.rate || 0.5}m
              </p>
              <p className="text-xs text-orange-500 mt-1">
                Per year ({aquiferInfo?.groundwaterTrend?.period || '2010-2024'})
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold text-gray-900 mb-4">Historical Depth to Water Level</h3>
            <div className="flex items-end justify-between h-32 px-4">
              {groundwaterLevels.historical.map((data) => (
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
                {selectedAquifer.id === 'hard-rock'
                  ? 'Recharge Shaft with Borewell'
                  : selectedAquifer.id === 'alluvial-plain'
                  ? 'Recharge Pit/Trench'
                  : selectedAquifer.id === 'coastal'
                  ? 'Recharge Shaft with Salinity Barrier'
                  : 'Deep Recharge Shaft'}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-semibold mb-2">Expected Recharge</h3>
              <p className="text-primary-100">
                {selectedAquifer.id === 'alluvial-plain'
                  ? 'High (1000-2000 L/day)'
                  : selectedAquifer.id === 'hard-rock'
                  ? 'Medium (500-1000 L/day)'
                  : 'Low-Medium (300-800 L/day)'}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-semibold mb-2">Maintenance</h3>
              <p className="text-primary-100">Clean filter every 3 months, inspect structure annually</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
