import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calculator, TrendingDown, CheckCircle, XCircle, Info } from 'lucide-react'
import axios from 'axios'

export default function SubsidyCalculator({ scheme, onCalculate }) {
  const [installationCost, setInstallationCost] = useState(50000)
  const [result, setResult] = useState(null)
  const [calculating, setCalculating] = useState(false)

  useEffect(() => {
    if (scheme && installationCost > 0) {
      calculateSubsidy()
    }
  }, [scheme, installationCost])

  const calculateSubsidy = async () => {
    if (!scheme) return
    
    setCalculating(true)
    try {
      const response = await axios.post('/api/subsidy/calculate', {
        schemeId: scheme._id || scheme.id,
        installationCost,
        propertyType: scheme.category?.[0] || 'residential',
        area: 1000,
      })

      if (response.data.success) {
        setResult(response.data.data)
        onCalculate?.(response.data.data)
      }
    } catch (error) {
      // Fallback calculation
      let subsidyAmount = 0
      let breakdown = []
      
      if (scheme.subsidyType === 'fixed') {
        subsidyAmount = scheme.amount?.max || scheme.amount?.min || 10000
        breakdown.push({ item: 'Fixed Amount', amount: subsidyAmount })
      } else if (scheme.subsidyType === 'percentage') {
        const percent = scheme.amount?.percentage || 50
        subsidyAmount = (installationCost * percent) / 100
        if (scheme.amount?.max && subsidyAmount > scheme.amount.max) {
          subsidyAmount = scheme.amount.max
        }
        breakdown.push({ item: `${percent}% of ₹${installationCost.toLocaleString()}`, amount: subsidyAmount })
      } else {
        subsidyAmount = installationCost * 0.1
        breakdown.push({ item: 'Estimated 10%', amount: subsidyAmount })
      }

      const calculatedResult = {
        scheme: scheme.name,
        installationCost,
        subsidyAmount,
        userContribution: installationCost - subsidyAmount,
        breakdown,
        savings: `${Math.round((subsidyAmount / installationCost) * 100)}%`,
      }
      
      setResult(calculatedResult)
      onCalculate?.(calculatedResult)
    } finally {
      setCalculating(false)
    }
  }

  if (!scheme) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Select a scheme to calculate subsidy</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
        <div className="flex items-center">
          <Calculator className="w-8 h-8 text-white mr-3" />
          <div>
            <h3 className="text-lg font-bold text-white">Subsidy Calculator</h3>
            <p className="text-purple-100 text-sm">{scheme.name}</p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estimated Installation Cost (₹)
        </label>
        <input
          type="range"
          min="10000"
          max="500000"
          step="5000"
          value={installationCost}
          onChange={(e) => setInstallationCost(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>₹10,000</span>
          <span className="text-lg font-bold text-primary-600">₹{installationCost.toLocaleString()}</span>
          <span>₹5,00,000</span>
        </div>
      </div>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-gray-100"
        >
          <div className="p-6 bg-green-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">You Save</span>
              <span className="text-3xl font-bold text-green-600">
                ₹{result.subsidyAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Savings Percentage</span>
              <span className="font-medium text-green-700">{result.savings}</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="p-6">
            <h4 className="text-sm font-medium text-gray-500 mb-4">Cost Breakdown</h4>
            
            <div className="space-y-3">
              {/* Installation Cost */}
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  <span className="text-gray-700">Installation Cost</span>
                </div>
                <span className="font-medium">₹{result.installationCost.toLocaleString()}</span>
              </div>

              {/* Subsidy */}
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <TrendingDown className="w-4 h-4 text-green-600 mr-3" />
                  <span className="text-green-800">Subsidy Amount</span>
                </div>
                <span className="font-medium text-green-600">-₹{result.subsidyAmount.toLocaleString()}</span>
              </div>

              {/* User Contribution */}
              <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                  <span className="text-primary-800">Your Contribution</span>
                </div>
                <span className="font-bold text-primary-700">₹{result.userContribution.toLocaleString()}</span>
              </div>
            </div>

            {/* Eligibility Note */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start">
              <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                This is an estimate. Actual subsidy may vary based on document verification and inspection.
              </p>
            </div>
          </div>

          {/* Action */}
          <div className="p-6 pt-0">
            <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center">
              Apply for this Scheme
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
