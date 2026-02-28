import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Package, Calculator, RefreshCw } from 'lucide-react'
import axios from 'axios'

export default function PriceTracker({ state, onStateChange }) {
  const [materials, setMaterials] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [priceTrends, setPriceTrends] = useState({})

  useEffect(() => {
    fetchPrices()
  }, [state, selectedCategory])

  const fetchPrices = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (state) params.append('state', state)
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      
      const response = await axios.get(`/api/prices/materials?${params}`)
      if (response.data.success) {
        setMaterials(response.data.data)
        setCategories(response.data.categories || [])
      }
    } catch (error) {
      // Use default prices if API fails
      setMaterials([
        { name: 'Rainwater Filter (Basic)', category: 'Filters', unit: 'piece', basePrice: 3500, statePrice: 3500 },
        { name: 'Rainwater Filter (Advanced)', category: 'Filters', unit: 'piece', basePrice: 8500, statePrice: 8500 },
        { name: 'Storage Tank (1000L)', category: 'Tanks', unit: 'piece', basePrice: 4500, statePrice: 4500 },
        { name: 'Storage Tank (2000L)', category: 'Tanks', unit: 'piece', basePrice: 8000, statePrice: 8000 },
        { name: 'PVC Pipes (3 inch)', category: 'Pipes', unit: 'meter', basePrice: 180, statePrice: 180 },
        { name: 'Gutter System', category: 'Gutters', unit: 'meter', basePrice: 250, statePrice: 250 },
        { name: 'First Flush Diverter', category: 'Diverters', unit: 'piece', basePrice: 2200, statePrice: 2200 },
        { name: 'Smart Water Level Monitor', category: 'IoT', unit: 'piece', basePrice: 4500, statePrice: 4500 },
      ])
      setCategories(['Filters', 'Tanks', 'Pipes', 'Gutters', 'Diverters', 'IoT'])
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Filters': 'bg-blue-100 text-blue-700',
      'Tanks': 'bg-green-100 text-green-700',
      'Pipes': 'bg-gray-100 text-gray-700',
      'Gutters': 'bg-orange-100 text-orange-700',
      'Diverters': 'bg-purple-100 text-purple-700',
      'IoT': 'bg-yellow-100 text-yellow-700',
      'Pumps': 'bg-cyan-100 text-cyan-700',
      'Fittings': 'bg-pink-100 text-pink-700',
      'Materials': 'bg-amber-100 text-amber-700',
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  const getTrend = (basePrice, statePrice) => {
    const diff = statePrice - basePrice
    const percent = (diff / basePrice) * 100
    
    if (Math.abs(percent) < 5) return { direction: 'stable', icon: null, color: 'text-gray-500' }
    if (diff > 0) return { direction: 'up', icon: TrendingUp, color: 'text-red-500' }
    return { direction: 'down', icon: TrendingDown, color: 'text-green-500' }
  }

  const filteredMaterials = selectedCategory === 'all' 
    ? materials 
    : materials.filter(m => m.category === selectedCategory)

  const totalEstimate = filteredMaterials.reduce((sum, m) => sum + m.statePrice, 0)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Package className="w-6 h-6 text-primary-500 mr-3" />
            <h3 className="font-semibold text-gray-900">Material Prices</h3>
          </div>
          <button
            onClick={fetchPrices}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh prices"
          >
            <RefreshCw className={`w-5 h-5 text-gray-500 ${loading ? 'animate-spin' : ''}`}`} />
          </button>
        </div>

        {/* State Selector */}
        <div className="flex items-center gap-4">
          <select
            value={state || ''}
            onChange={(e) => onStateChange?.(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All India (Base Price)</option>
            <option value="delhi">Delhi</option>
            <option value="maharashtra">Maharashtra</option>
            <option value="karnataka">Karnataka</option>
            <option value="tamil-nadu">Tamil Nadu</option>
            <option value="gujarat">Gujarat</option>
            <option value="telangana">Telangana</option>
            <option value="rajasthan">Rajasthan</option>
            <option value="kerala">Kerala</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Materials List */}
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
            Loading prices...
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No materials found in this category
          </div>
        ) : (
          filteredMaterials.map((material, index) => {
            const trend = getTrend(material.basePrice, material.statePrice)
            
            return (
              <motion.div
                key={material.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-medium text-gray-900">{material.name}</h4>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getCategoryColor(material.category)}`}>
                        {material.category}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Unit: {material.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{material.statePrice.toLocaleString()}
                      </span>
                      {trend.icon && (
                        <trend.icon className={`w-4 h-4 ml-1 ${trend.color}`} />
                      )}
                    </div>
                    {state && material.basePrice !== material.statePrice && (
                      <div className="text-xs text-gray-500">
                        Base: ₹{material.basePrice.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Alternatives */}
                {material.alternatives && material.alternatives.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">Alternatives:</div>
                    <div className="flex flex-wrap gap-2">
                      {material.alternatives.slice(0, 2).map((alt, i) => (
                        <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {alt.name}: ₹{alt.price.toLocaleString()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })
        )}
      </div>

      {/* Summary */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <Calculator className="w-5 h-5 mr-2" />
            <span>Estimated Total ({filteredMaterials.length} items)</span>
          </div>
          <span className="text-2xl font-bold text-primary-600">
            ₹{totalEstimate.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
