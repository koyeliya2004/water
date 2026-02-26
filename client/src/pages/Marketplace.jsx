import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Store, Search, Star, Phone, Mail, MapPin, CheckCircle, Filter, ShoppingCart } from 'lucide-react'
import axios from 'axios'

export default function Marketplace() {
  const [vendors, setVendors] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeTab, setActiveTab] = useState('vendors')
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [filter])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [vendorsRes, productsRes] = await Promise.all([
        axios.get('/api/marketplace/vendors'),
        axios.get('/api/marketplace/products')
      ])
      setVendors(vendorsRes.data.data)
      setProducts(productsRes.data.data)
      setCategories(productsRes.data.categories)
    } catch (error) {
      console.error('Failed to fetch marketplace data:', error)
    }
    setLoading(false)
  }

  const filteredVendors = vendors.filter(v => 
    v.location.toLowerCase().includes(filter.toLowerCase()) ||
    v.services.some(s => s.toLowerCase().includes(filter.toLowerCase()))
  )

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
            <Store className="w-4 h-4" />
            <span>Verified Marketplace</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Find <span className="gradient-text">Vendors & Products</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with verified vendors and find quality products for your rainwater harvesting system.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location or service..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex bg-white rounded-xl shadow-sm p-1">
              <button
                onClick={() => setActiveTab('vendors')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'vendors' 
                    ? 'bg-primary-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Vendors
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'products' 
                    ? 'bg-primary-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Products
              </button>
            </div>
          </div>
        </motion.div>

        {/* Vendors Tab */}
        {activeTab === 'vendors' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {loading ? (
              <div className="col-span-full text-center py-12 text-gray-500">Loading vendors...</div>
            ) : (
              filteredVendors.map((vendor, index) => (
                <motion.div
                  key={vendor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-lg p-6 card-hover"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
                      <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{vendor.location}</span>
                      </div>
                    </div>
                    {vendor.verified && (
                      <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        <CheckCircle className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{vendor.rating}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{vendor.completedProjects} projects</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-gray-700">Services:</p>
                    <div className="flex flex-wrap gap-2">
                      {vendor.services.map((service, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{vendor.contact.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{vendor.contact.email}</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium">
                    Request Quote
                  </button>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {loading ? (
              <div className="col-span-full text-center py-12 text-gray-500">Loading products...</div>
            ) : (
              products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-lg p-6 card-hover"
                >
                  <div className="w-full h-32 bg-gradient-to-br from-primary-100 to-water-100 rounded-xl flex items-center justify-center mb-4">
                    <ShoppingCart className="w-12 h-12 text-primary-400" />
                  </div>
                  
                  <span className="text-xs text-primary-600 font-medium uppercase tracking-wide">
                    {product.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 mt-1">{product.name}</h3>
                  
                  <div className="flex items-baseline space-x-1 mt-3">
                    <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">/{product.unit}</span>
                  </div>

                  <button className="w-full mt-4 py-2 border-2 border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium">
                    Add to Estimate
                  </button>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-water-600 to-primary-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Are you a vendor?</h3>
          <p className="text-water-100 mb-6 max-w-2xl mx-auto">
            Join our verified marketplace and connect with thousands of homeowners looking for rainwater harvesting solutions.
          </p>
          <button className="px-8 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
            Register as Vendor
          </button>
        </motion.div>
      </div>
    </div>
  )
}
