import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Droplets, Calculator, Trophy, Map, TrendingUp, ChevronRight, Leaf, Users, Shield } from 'lucide-react'

const features = [
  {
    icon: Calculator,
    title: 'Smart Assessment',
    description: 'Calculate your rooftop rainwater harvesting potential with advanced algorithms and real-time data.'
  },
  {
    icon: Map,
    title: 'GIS Integration',
    description: 'View aquifer information, rainfall patterns, and groundwater levels for your specific location.'
  },
  {
    icon: Trophy,
    title: 'Community Leaderboard',
    description: 'Earn water credits, compete with neighbors, and track collective impact on groundwater recharge.'
  },
  {
    icon: TrendingUp,
    title: 'Impact Tracking',
    description: 'Monitor your contribution to water conservation with detailed analytics and visualizations.'
  }
]

const stats = [
  { value: '15,247+', label: 'Active Users' },
  { value: '4.5B', label: 'Liters Recharged' },
  { value: '28', label: 'States Covered' },
  { value: '1,809', label: 'Olympic Pools' }
]

function AnimatedCounter({ value }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const target = parseInt(value.replace(/[^0-9]/g, ''))
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [value])
  
  return <span>{count.toLocaleString()}{value.replace(/[0-9,]/g, '')}</span>
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-water-500 opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Leaf className="w-4 h-4" />
                <span>CGWB Inspired Initiative</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Harvest Rainwater,<br />
                <span className="gradient-text">Replenish Groundwater</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                Assess your rooftop rainwater harvesting potential, get personalized recommendations, 
                and join thousands of Indians working towards water security.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/assessment" className="btn-primary flex items-center space-x-2">
                  <span>Start Assessment</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link to="/impact" className="btn-secondary">
                  View Impact
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-square bg-gradient-to-br from-primary-500 to-water-500 flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <Droplets className="w-32 h-32 mx-auto mb-6 animate-float" />
                    <p className="text-2xl font-bold">Every Drop Counts</p>
                    <p className="text-primary-100 mt-2">Start your water conservation journey today</p>
                  </div>
                </div>
                {/* Floating cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Water Secured</p>
                      <p className="text-xs text-gray-500">For future generations</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Community</p>
                      <p className="text-xs text-gray-500">15,000+ members</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold gradient-text mb-2">
                  <AnimatedCounter value={stat.value} />
                </div>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for <span className="gradient-text">Water Conservation</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides comprehensive tools to help you implement and monitor 
              rainwater harvesting systems effectively.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card-hover bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-water-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Enter Details', desc: 'Provide your location, roof area, and other basic information.' },
              { step: '02', title: 'Get Analysis', desc: 'Our system calculates your harvesting potential using GIS and weather data.' },
              { step: '03', title: 'Take Action', desc: 'Receive personalized recommendations and connect with vendors.' }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: index === 0 ? -30 : index === 2 ? 30 : 0, y: index === 1 ? 30 : 0 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-6xl font-bold text-gray-100 absolute -top-4 -left-2">
                  {item.step}
                </div>
                <div className="relative bg-gradient-to-br from-primary-50 to-water-50 rounded-2xl p-8 pt-12">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-water-600 rounded-3xl p-8 lg:p-16 text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Start Your Water Conservation Journey?
            </h2>
            <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of Indians who are already making a difference. 
              Assess your potential in just 2 minutes.
            </p>
            <Link
              to="/assessment"
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              <span>Get Started Now</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
