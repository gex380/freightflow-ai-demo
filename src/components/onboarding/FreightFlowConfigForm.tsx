'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface FreightFlowConfig {
  routingRules: RoutingRule[]
  carrierPreferences: CarrierPreference[]
  rateOptimization: RateOptimization
  specialHandling: SpecialHandling
  automationSettings: AutomationSettings
}

interface RoutingRule {
  id: string
  name: string
  conditions: string
  action: string
  priority: number
  reasoning: string
}

interface CarrierPreference {
  name: string
  serviceTypes: string[]
  preferenceScore: number
  reasoning: string
  contractRates: boolean
}

interface RateOptimization {
  primary_objective: string
  cost_weight: number
  speed_weight: number
  reliability_weight: number
  reasoning: string
}

interface SpecialHandling {
  oversizedCapability: boolean
  temperatureControl: boolean
  hazmatCapability: boolean
  reasoning: string
}

interface AutomationSettings {
  autoBooking: boolean
  autoTracking: boolean
  autoNotifications: boolean
  reasoning: string
}

interface FreightFlowConfigFormProps {
  millData: any
  productData?: any
  painPointsData?: any
  onSubmit: (config: FreightFlowConfig) => void
  onNext: () => void
}

export function FreightFlowConfigForm({ millData, productData, painPointsData, onSubmit, onNext }: FreightFlowConfigFormProps) {
  const [config, setConfig] = useState<FreightFlowConfig | null>(null)
  const [isGenerating, setIsGenerating] = useState(true)

  useEffect(() => {
    // Call FreightFlow AI to generate configuration based on all collected data
    const generateFreightFlowConfig = async () => {
      setIsGenerating(true)
      
      try {
        console.log('Calling FreightFlow AI with comprehensive data:', {
          millData,
          productData,
          painPointsData
        })
        
        // Simulate loading time for demo (in production this would call real API)
        await new Promise(resolve => setTimeout(resolve, 4000))
        
        // Use enhanced fallback system with all collected data
        const enhancedConfig = generateIntelligentConfig(millData, productData, painPointsData)
        setConfig(enhancedConfig)
        setIsGenerating(false)
        
      } catch (error) {
        console.error('Error calling FreightFlow AI:', error)
        
        // Fallback to intelligent simulation
        const fallbackConfig = generateIntelligentConfig(millData, productData, painPointsData)
        setConfig(fallbackConfig)
        setIsGenerating(false)
      }
    }

    generateFreightFlowConfig()
  }, [millData, productData, painPointsData])

  // Enhanced intelligent configuration using ALL collected data
  const generateIntelligentConfig = (mill: any, products: any, painPoints: any): FreightFlowConfig => {
    console.log('Generating intelligent config with all data sources')
    
    // Analyze mill characteristics
    const isLargeMill = parseInt(mill?.capacity || '0') > 2000000
    const isSpecialtyMill = mill?.millType === 'SPECIALTY_MILL'
    const isSawmill = mill?.millType === 'SAWMILL'
    const isIntegratedMill = mill?.millType === 'INTEGRATED_MILL'
    
    // Analyze product data
    const hasOversizedProducts = products?.products?.some((p: any) => 
      p.dimensions?.includes('Custom Sizes') || p.specialHandling
    ) || false
    
    const hasHighValueProducts = products?.products?.some((p: any) => 
      p.grade?.includes('Cabinet') || p.grade?.includes('Appearance')
    ) || false
    
    const totalProductVolume = products?.products?.reduce((sum: number, p: any) => 
      sum + parseInt(p.monthlyVolume || '0'), 0
    ) || 0
    
    const hasSpecialRequirements = products?.specialRequirements?.length > 0 || false
    
    // Analyze pain points data
    const criticalChallenges = painPoints?.currentChallenges?.filter((c: any) => 
      c.severity === 'critical' || c.severity === 'high'
    ) || []
    
    const priorityLevel = painPoints?.priorityLevel || 'Medium Priority'
    const isUrgent = priorityLevel.includes('Critical') || priorityLevel.includes('High')
    
    const hasCostFocus = painPoints?.successMetrics?.some((m: string) => 
      m.includes('cost') || m.includes('save')
    ) || false
    
    const hasSpeedFocus = painPoints?.processIssues?.some((i: string) => 
      i.includes('phone calls') || i.includes('Manual')
    ) || false

    // Generate intelligent routing rules
    const routingRules: RoutingRule[] = []

    // Rule 1: High volume optimization
    if (isLargeMill || totalProductVolume > 100000) {
      routingRules.push({
        id: 'high_volume_rail',
        name: 'High Volume Rail Optimization',
        conditions: 'Shipment weight > 40,000 lbs AND distance > 500 miles',
        action: 'Automatically route to rail carriers (BNSF, UP) for cost efficiency',
        priority: 1,
        reasoning: `With ${parseInt(mill?.capacity || '0').toLocaleString()} BF/month capacity and ${totalProductVolume.toLocaleString()} BF total product volume, rail transport provides significant cost savings for large shipments`
      })
    }

    // Rule 2: Product-specific handling
    if (hasOversizedProducts || hasSpecialRequirements) {
      routingRules.push({
        id: 'special_handling',
        name: 'Special Product Handling',
        conditions: hasOversizedProducts ? 'Custom sizes or oversized products' : 'Products requiring special handling',
        action: 'Route to carriers with specialized equipment and white-glove service',
        priority: hasOversizedProducts ? 1 : 2,
        reasoning: `Your product catalog includes ${hasOversizedProducts ? 'custom/oversized lumber' : 'products with special requirements'} that need specialized carriers`
      })
    }

    // Rule 3: Pain point driven rules
    if (criticalChallenges.some((c: any) => c.issue.includes('damage'))) {
      routingRules.push({
        id: 'damage_prevention',
        name: 'Damage Prevention Protocol',
        conditions: 'High-value lumber grades OR damage-sensitive products',
        action: 'Prioritize carriers with excellent damage records and proper lumber handling',
        priority: 1,
        reasoning: 'You identified freight damage as a critical issue - FreightFlow will prioritize carriers with proven lumber handling expertise'
      })
    }

    if (criticalChallenges.some((c: any) => c.issue.includes('pricing') || c.issue.includes('cost'))) {
      routingRules.push({
        id: 'cost_optimization',
        name: 'Aggressive Cost Optimization',
        conditions: 'All eligible shipments',
        action: 'Compare rates across all carriers and automatically select lowest cost option',
        priority: isUrgent ? 1 : 2,
        reasoning: 'Inconsistent freight pricing was identified as a critical challenge - FreightFlow will ensure competitive rates on every shipment'
      })
    }

    // Rule 4: Regional optimization
    routingRules.push({
      id: 'regional_optimization',
      name: `${mill?.state || 'Regional'} Carrier Optimization`,
      conditions: 'Local and regional deliveries < 300 miles',
      action: `Prioritize ${mill?.state || 'regional'} carriers and LTL providers for faster delivery`,
      priority: 3,
      reasoning: `Optimized for ${mill?.city || 'your location'}, ${mill?.state || 'regional'} market with local carrier relationships`
    })

    // Generate carrier preferences based on all data
    const carrierPreferences: CarrierPreference[] = [
      {
        name: 'FedEx Freight',
        serviceTypes: ['LTL', 'White Glove'],
        preferenceScore: (hasHighValueProducts ? 2 : 0) + (isSpecialtyMill ? 2 : 0) + (hasSpecialRequirements ? 1 : 0) + 5,
        reasoning: hasHighValueProducts 
          ? 'Excellent for your cabinet/appearance grade lumber with superior tracking and handling'
          : hasSpecialRequirements
          ? 'Strong capabilities for special requirements you identified'
          : 'Reliable LTL service with good tracking capabilities',
        contractRates: isLargeMill
      },
      {
        name: 'BNSF Railway',
        serviceTypes: ['Rail', 'Intermodal'],
        preferenceScore: (isLargeMill ? 3 : 0) + (hasCostFocus ? 2 : 0) + (isSawmill ? 1 : 0) + 3,
        reasoning: isLargeMill 
          ? `Perfect for your ${parseInt(mill?.capacity || '0').toLocaleString()} BF/month volume - significant cost savings on long hauls`
          : hasCostFocus
          ? 'Most cost-effective option for your cost reduction goals'
          : 'Good for high-volume shipments when time permits',
        contractRates: isLargeMill
      },
      {
        name: 'Old Dominion',
        serviceTypes: ['LTL', 'Construction Materials'],
        preferenceScore: (isSawmill ? 2 : 0) + (mill?.state === 'GA' || mill?.state === 'NC' || mill?.state === 'SC' ? 2 : 0) + 4,
        reasoning: isSawmill 
          ? 'Specialized in construction lumber transport - perfect match for sawmill operations'
          : 'Strong LTL network with construction material expertise',
        contractRates: false
      },
      {
        name: 'XPO Logistics',
        serviceTypes: ['LTL', 'FTL', 'Expedited'],
        preferenceScore: (isUrgent ? 2 : 0) + (hasSpeedFocus ? 2 : 0) + 5,
        reasoning: isUrgent 
          ? 'Expedited services available for your high-priority timeline'
          : hasSpeedFocus
          ? 'Efficient processes to address your manual booking pain points'
          : 'Good balance of services and competitive pricing',
        contractRates: isLargeMill
      },
      {
        name: 'Regional Carriers',
        serviceTypes: ['LTL', 'Local Delivery'],
        preferenceScore: (mill?.state ? 1 : 0) + 6,
        reasoning: `Optimized for ${mill?.state || 'your region'} market with local knowledge and relationships`,
        contractRates: false
      }
    ]

    // Sort carriers by preference score
    carrierPreferences.sort((a, b) => b.preferenceScore - a.preferenceScore)
    // Normalize scores to 1-10 range
    carrierPreferences.forEach(carrier => {
      carrier.preferenceScore = Math.min(10, Math.max(1, carrier.preferenceScore))
    })

    // Generate rate optimization strategy
    const rateOptimization: RateOptimization = {
      primary_objective: isUrgent ? 'speed' : 
                        hasCostFocus ? 'cost' : 
                        hasHighValueProducts ? 'reliability' : 
                        'balanced',
      cost_weight: hasCostFocus ? 0.7 : isLargeMill ? 0.5 : 0.4,
      speed_weight: isUrgent ? 0.5 : hasSpeedFocus ? 0.4 : 0.3,
      reliability_weight: hasHighValueProducts ? 0.5 : 0.3,
      reasoning: `Strategy optimized for ${priorityLevel.toLowerCase()} with focus on ${hasCostFocus ? 'cost savings' : isUrgent ? 'speed' : hasHighValueProducts ? 'reliability for high-value products' : 'balanced performance'} based on your pain points analysis`
    }

    // Generate special handling requirements
    const specialHandling: SpecialHandling = {
      oversizedCapability: hasOversizedProducts || isSawmill || products?.specialRequirements?.includes('Oversized loads (>12 feet)'),
      temperatureControl: products?.specialRequirements?.includes('Temperature-controlled transport') || false,
      hazmatCapability: false, // Lumber typically not hazmat
      reasoning: hasOversizedProducts 
        ? 'Your product catalog includes custom sizes and special handling requirements'
        : isSawmill 
        ? 'Sawmills often produce oversized structural lumber requiring specialized transport'
        : products?.specialRequirements?.length > 0
        ? `Based on your ${products.specialRequirements.length} special shipping requirements`
        : 'Standard lumber handling protocols'
    }

    // Generate automation settings
    const automationSettings: AutomationSettings = {
      autoBooking: !painPoints?.processIssues?.includes('No automated booking confirmations'),
      autoTracking: true,
      autoNotifications: parseInt(mill?.employees || '0') > 50 || isUrgent,
      reasoning: `Automation level optimized for ${mill?.employees || 0} employee operation with ${priorityLevel.toLowerCase()} priority. ${painPoints?.processIssues?.includes('Multiple phone calls') ? 'Automated booking will eliminate manual phone calls' : 'Streamlined processes based on your requirements'}`
    }

    return {
      routingRules,
      carrierPreferences,
      rateOptimization,
      specialHandling,
      automationSettings
    }
  }

  const handleApproveConfig = () => {
    if (config) {
      onSubmit(config)
      onNext()
    }
  }

  if (isGenerating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>FreightFlow AI Configuration</CardTitle>
          <CardDescription>
            Analyzing your comprehensive mill profile, product catalog, and business requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">FreightFlow AI is analyzing your data...</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>🏭 Processing mill specifications and capacity data</p>
              <p>📦 Analyzing {productData?.products?.length || 0} lumber products and requirements</p>
              <p>🎯 Evaluating {painPointsData?.currentChallenges?.length || 0} identified pain points</p>
              <p>🚛 Optimizing carrier selection for your region</p>
              <p>⚡ Generating intelligent routing rules</p>
              <p>💡 Creating personalized automation strategy</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!config) return null

  return (
    <div className="space-y-6">
      {/* Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🤖 FreightFlow AI Configuration Complete
          </CardTitle>
          <CardDescription>
            FreightFlow analyzed your mill profile, {productData?.products?.length || 0} products, and {painPointsData?.currentChallenges?.length || 0} pain points to create this optimized strategy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{config.routingRules.length}</div>
              <div className="text-sm text-blue-700">Intelligent Rules</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{config.carrierPreferences.length}</div>
              <div className="text-sm text-green-700">Ranked Carriers</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{config.rateOptimization.primary_objective}</div>
              <div className="text-sm text-purple-700">AI Strategy</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {painPointsData?.priorityLevel?.includes('Critical') ? 'HIGH' : 
                 painPointsData?.priorityLevel?.includes('High') ? 'HIGH' : 'MED'}
              </div>
              <div className="text-sm text-orange-700">Priority Level</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Routing Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Intelligent Routing Rules</CardTitle>
          <CardDescription>
            FreightFlow created these rules based on your specific mill profile and identified challenges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {config.routingRules.map((rule, index) => (
              <div key={rule.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Priority {rule.priority}
                      </span>
                      <h4 className="font-semibold">{rule.name}</h4>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>When:</strong> {rule.conditions}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Then:</strong> {rule.action}
                    </div>
                    <div className="text-xs text-gray-500 italic">
                      🤖 AI Reasoning: {rule.reasoning}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Carrier Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Optimized Carrier Rankings</CardTitle>
          <CardDescription>
            Carriers ranked based on your mill type, products, and specific requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {config.carrierPreferences.map((carrier, index) => (
              <div key={carrier.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <div>
                      <h4 className="font-semibold">{carrier.name}</h4>
                      <div className="text-sm text-gray-600">
                        Services: {carrier.serviceTypes.join(', ')}
                        {carrier.contractRates && ' • Contract Rates Available'}
                      </div>
                      <div className="text-xs text-gray-500 italic">
                        🤖 AI Match: {carrier.reasoning}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{carrier.preferenceScore}/10</div>
                  <div className="text-xs text-gray-500">AI Score</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rate Optimization Strategy */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Rate Strategy</CardTitle>
          <CardDescription>
            Optimization approach tailored to your pain points and business priorities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(config.rateOptimization.cost_weight * 100)}%
                </div>
                <div className="text-sm text-gray-600">Cost Focus</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(config.rateOptimization.speed_weight * 100)}%
                </div>
                <div className="text-sm text-gray-600">Speed Focus</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(config.rateOptimization.reliability_weight * 100)}%
                </div>
                <div className="text-sm text-gray-600">Reliability Focus</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 italic">
                🤖 AI Strategy: {config.rateOptimization.reasoning}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Special Handling & Automation */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Smart Special Handling</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Oversized Capability</span>
                <span className={`px-2 py-1 rounded text-xs ${config.specialHandling.oversizedCapability ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {config.specialHandling.oversizedCapability ? 'Enabled' : 'Not Needed'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Temperature Control</span>
                <span className={`px-2 py-1 rounded text-xs ${config.specialHandling.temperatureControl ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {config.specialHandling.temperatureControl ? 'Enabled' : 'Not Needed'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Hazmat Capability</span>
                <span className={`px-2 py-1 rounded text-xs ${config.specialHandling.hazmatCapability ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {config.specialHandling.hazmatCapability ? 'Enabled' : 'Not Needed'}
                </span>
              </div>
              <div className="text-xs text-gray-500 italic mt-2">
                🤖 Analysis: {config.specialHandling.reasoning}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Intelligent Automation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Auto Booking</span>
                <span className={`px-2 py-1 rounded text-xs ${config.automationSettings.autoBooking ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {config.automationSettings.autoBooking ? 'Enabled' : 'Manual'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Auto Tracking</span>
                <span className={`px-2 py-1 rounded text-xs ${config.automationSettings.autoTracking ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {config.automationSettings.autoTracking ? 'Enabled' : 'Manual'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Auto Notifications</span>
                <span className={`px-2 py-1 rounded text-xs ${config.automationSettings.autoNotifications ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {config.automationSettings.autoNotifications ? 'Enabled' : 'Manual'}
                </span>
              </div>
              <div className="text-xs text-gray-500 italic mt-2">
                🤖 Recommendation: {config.automationSettings.reasoning}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => window.history.back()}
        >
          Back to Pain Points
        </Button>
        <div className="flex gap-3">
          <Button variant="outline">
            Customize Configuration
          </Button>
          <Button onClick={handleApproveConfig} size="lg">
            Complete Onboarding
          </Button>
        </div>
      </div>
    </div>
  )
}