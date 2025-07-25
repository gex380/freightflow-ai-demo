'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FreightPricingService, type FreightRate, type RouteInfo } from '@/lib/freight-pricing'
import { ShipmentCoordinationService, type LiveShipment, type CoordinationMetrics } from '@/lib/shipment-coordination'

export default function LiveOperationsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('coordination')
  const [liveShipments, setLiveShipments] = useState<LiveShipment[]>([])
  const [metrics, setMetrics] = useState<CoordinationMetrics | null>(null)
  const [freightRates, setFreightRates] = useState<FreightRate[]>([])
  const [isLoadingRates, setIsLoadingRates] = useState(false)
  const [isLoadingShipments, setIsLoadingShipments] = useState(true)
  const [selectedShipment, setSelectedShipment] = useState<LiveShipment | null>(null)

  // Load initial data
  useEffect(() => {
    loadLiveData()
    const interval = setInterval(loadLiveData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadLiveData = async () => {
    try {
      const [shipments, metricsData] = await Promise.all([
        ShipmentCoordinationService.getLiveShipments(),
        ShipmentCoordinationService.getCoordinationMetrics()
      ])
      setLiveShipments(shipments)
      setMetrics(metricsData)
      setIsLoadingShipments(false)
    } catch (error) {
      console.error('Error loading live data:', error)
      setIsLoadingShipments(false)
    }
  }

  const loadFreightRates = async () => {
    setIsLoadingRates(true)
    try {
      const route: RouteInfo = {
        origin: 'Portland,OR',
        destination: 'Chicago,IL',
        distance: 2135,
        weight: 45000,
        commodity: 'Lumber'
      }
      const rates = await FreightPricingService.getLiveRates(route)
      setFreightRates(rates)
    } catch (error) {
      console.error('Error loading freight rates:', error)
    }
    setIsLoadingRates(false)
  }

  const simulateNewShipment = async () => {
    try {
      const newShipment = await ShipmentCoordinationService.simulateNewShipment('Demo Mill Co.')
      setLiveShipments(prev => [newShipment, ...prev])
      await loadLiveData() // Refresh metrics
    } catch (error) {
      console.error('Error simulating shipment:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Header with Back Button */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => router.back()}
                  className="flex items-center gap-2"
                >
                  ← Back
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">FreightFlow AI Live Operations</h1>
                  <p className="text-gray-600">Real-time freight coordination and market intelligence</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={loadLiveData}>
                  Refresh Data
                </Button>
                <Button onClick={simulateNewShipment} className="bg-green-600 hover:bg-green-700">
                  Simulate New Shipment
                </Button>
              </div>
            </div>

            {/* Live Metrics */}
            {metrics && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {ShipmentCoordinationService.formatCurrency(metrics.totalSavings)}
                    </div>
                    <div className="text-sm text-gray-600">Total Savings This Month</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">{metrics.activeShipments}</div>
                    <div className="text-sm text-gray-600">Active Shipments</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-purple-600">{metrics.timeAutomated}h</div>
                    <div className="text-sm text-gray-600">Time Automated</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-orange-600">{metrics.onTimeDelivery}%</div>
                    <div className="text-sm text-gray-600">On-Time Delivery</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'coordination' 
                    ? 'bg-white text-gray-900 shadow' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('coordination')}
              >
                Live Coordination
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'pricing' 
                    ? 'bg-white text-gray-900 shadow' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('pricing')}
              >
                Market Pricing
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'intelligence' 
                    ? 'bg-white text-gray-900 shadow' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('intelligence')}
              >
                AI Intelligence
              </button>
            </div>
          </div>

          {/* Live Coordination Tab */}
          {activeTab === 'coordination' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>FreightFlow AI in Action</CardTitle>
                  <CardDescription>
                    Watch FreightFlow coordinate freight in real-time, optimize routes, and save costs automatically
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingShipments ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">Loading...</div>
                      <p>Loading live shipment data...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {liveShipments.map((shipment) => (
                        <div
                          key={shipment.id}
                          className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all"
                          onClick={() => setSelectedShipment(shipment)}
                        >
                          {/* Shipment Header */}
                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-bold text-gray-900">
                                {shipment.id}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                ShipmentCoordinationService.getStatusColor(shipment.status)
                              }`}>
                                {shipment.status.replace('_', ' ').toUpperCase()}
                              </span>
                              <span className="text-sm text-gray-500">
                                {ShipmentCoordinationService.getTimeAgo(shipment.updatedAt)}
                              </span>
                            </div>
                            <Button variant="outline" size="sm">
                              View Full Details
                            </Button>
                          </div>

                          {/* Shipment Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-700 mb-2">Route Information</h4>
                              <div className="space-y-1">
                                <div className="text-gray-900 font-medium">
                                  {shipment.route.origin} → {shipment.route.destination}
                                </div>
                                <div className="text-gray-600 text-sm">
                                  {shipment.carrier.name} • {shipment.carrier.serviceType}
                                </div>
                                <div className="text-gray-500 text-xs">
                                  Distance: {shipment.route.distance} miles
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-700 mb-2">Product Details</h4>
                              <div className="space-y-1">
                                <div className="text-gray-900 font-medium">
                                  {ShipmentCoordinationService.formatQuantity(shipment.product.quantity, shipment.product.unit)} {shipment.product.species}
                                </div>
                                <div className="text-gray-600 text-sm">
                                  {shipment.product.grade} • {shipment.product.type}
                                </div>
                                <div className="text-gray-500 text-xs">
                                  Customer: {shipment.customer}
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-700 mb-2">FreightFlow AI Savings</h4>
                              <div className="space-y-1">
                                <div className="text-green-600 text-xl font-bold">
                                  {ShipmentCoordinationService.formatCurrency(shipment.pricing.savings)} 
                                  <span className="text-sm">({shipment.pricing.savingsPercentage}% saved)</span>
                                </div>
                                <div className="text-gray-600 text-sm">
                                  {ShipmentCoordinationService.formatCurrency(shipment.pricing.wilsonRate)} vs {ShipmentCoordinationService.formatCurrency(shipment.pricing.originalQuote)} manual
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Latest AI Action */}
                          {shipment.wilsonActions.length > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <div className="bg-blue-500 rounded-full w-3 h-3 mt-1"></div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-blue-700 font-semibold text-sm">Latest AI Action:</span>
                                    <span className="text-blue-600 font-medium text-sm">
                                      {shipment.wilsonActions[shipment.wilsonActions.length - 1].action}
                                    </span>
                                  </div>
                                  <div className="text-blue-600 text-sm">
                                    {shipment.wilsonActions[shipment.wilsonActions.length - 1].reasoning}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Market Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live Freight Market Rates</CardTitle>
                  <CardDescription>
                    Real-time freight pricing intelligence powered by FreightFlow AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Button 
                      onClick={loadFreightRates}
                      disabled={isLoadingRates}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isLoadingRates ? 'Loading Market Rates...' : 'Get Live Market Rates'}
                    </Button>
                  </div>

                  {freightRates.length > 0 && (
                    <div className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-2">
                          FreightFlow AI Recommendation
                        </h3>
                        <p className="text-green-700">
                          {(() => {
                            const savings = FreightPricingService.calculateSavings(freightRates)
                            return `Best option: ${savings.bestOption?.carrier} ${savings.bestOption?.serviceType} - Save $${savings.amount} (${savings.percentage}%) vs highest rate`
                          })()}
                        </p>
                      </div>

                      <div className="grid gap-4">
                        {freightRates.map((rate, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {rate.carrier} - {rate.serviceType}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Transit time: {rate.transitTime} • Reliability: {rate.reliability}%
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">
                                  ${rate.rate}/cwt
                                </div>
                                <div className="text-sm text-gray-600">
                                  + ${rate.fuelSurcharge} fuel
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="text-sm">
                                  <span className="font-medium">Total Cost:</span>
                                  <span className="ml-1 text-lg font-semibold">
                                    ${rate.totalCost}
                                  </span>
                                </div>
                                <div className={`text-sm flex items-center gap-1 ${
                                  rate.marketTrend === 'up' ? 'text-red-600' : 
                                  rate.marketTrend === 'down' ? 'text-green-600' : 'text-gray-600'
                                }`}>
                                  {rate.marketTrend === 'up' ? '↗' : rate.marketTrend === 'down' ? '↘' : '→'}
                                  {rate.trendPercentage > 0 ? '+' : ''}{rate.trendPercentage}% this week
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                Select Rate
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* AI Intelligence Tab */}
          {activeTab === 'intelligence' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>FreightFlow AI Intelligence</CardTitle>
                  <CardDescription>
                    Advanced analytics and insights from FreightFlow AI coordination
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Process Automation */}
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-800 mb-4">
                        Process Automation
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-700">Manual Process (Before)</span>
                          <span className="text-blue-600 font-medium">47 minutes</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-700">FreightFlow AI (After)</span>
                          <span className="text-green-600 font-bold">3 minutes</span>
                        </div>
                        <div className="border-t border-blue-200 pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-blue-800 font-medium">Time Saved</span>
                            <span className="text-green-600 font-bold">93.6%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-2 text-sm text-blue-700">
                        <div>✓ Automated carrier selection</div>
                        <div>✓ Instant rate optimization</div>
                        <div>✓ Auto-generated documentation</div>
                        <div>✓ Real-time tracking setup</div>
                      </div>
                    </div>

                    {/* Cost Intelligence */}
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-800 mb-4">
                        Cost Intelligence
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-green-700">Average Manual Rate</span>
                          <span className="text-green-600 font-medium">$2.89/cwt</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-green-700">FreightFlow AI Rate</span>
                          <span className="text-green-600 font-bold">$2.15/cwt</span>
                        </div>
                        <div className="border-t border-green-200 pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-green-800 font-medium">Average Savings</span>
                            <span className="text-green-600 font-bold">25.6%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-2 text-sm text-green-700">
                        <div>• Market rate optimization</div>
                        <div>• Smart carrier mix</div>
                        <div>• Volume consolidation</div>
                        <div>• Timing optimization</div>
                      </div>
                    </div>

                    {/* AI Decisions */}
                    <div className="bg-purple-50 p-6 rounded-lg md:col-span-2">
                      <h3 className="text-lg font-semibold text-purple-800 mb-4">
                        Recent AI Decisions
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded border-l-4 border-purple-500">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-purple-900">Route Optimization</span>
                            <span className="text-xs text-purple-600">2 hours ago</span>
                          </div>
                          <div className="text-purple-700 text-sm">
                            Detected 18% rate increase on I-5 corridor. Automatically rerouted 3 shipments via rail intermodal, saving $1,240 total.
                          </div>
                        </div>
                        
                        <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-blue-900">Carrier Performance</span>
                            <span className="text-xs text-blue-600">4 hours ago</span>
                          </div>
                          <div className="text-blue-700 text-sm">
                            FedEx Freight showing 96% on-time rate (above 95% threshold). Increased allocation by 15% for premium shipments.
                          </div>
                        </div>
                        
                        <div className="bg-white p-3 rounded border-l-4 border-green-500">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-green-900">Market Intelligence</span>
                            <span className="text-xs text-green-600">6 hours ago</span>
                          </div>
                          <div className="text-green-700 text-sm">
                            Seasonal demand spike detected in Pacific Northwest. Proactively secured capacity with 3 carriers at current rates.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Shipment Detail Modal */}
          {selectedShipment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Shipment Details: {selectedShipment.id}</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedShipment(null)}
                    size="sm"
                  >
                    × Close
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {/* Timeline */}
                  <div>
                    <h3 className="font-semibold mb-2">Shipment Timeline</h3>
                    <div className="space-y-2">
                      {selectedShipment.timeline.map((event, index) => (
                        <div key={index} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            event.isWilsonAction ? 'bg-blue-500' : 'bg-gray-400'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{event.status.replace('_', ' ')}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(event.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">{event.description}</div>
                            <div className="text-xs text-gray-500">{event.location}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Actions */}
                  <div>
                    <h3 className="font-semibold mb-2">FreightFlow AI Actions</h3>
                    <div className="space-y-2">
                      {selectedShipment.wilsonActions.map((action, index) => (
                        <div key={index} className="p-3 bg-blue-50 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-blue-900">{action.action}</span>
                            <span className="text-xs text-blue-600">
                              {new Date(action.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-sm text-blue-700 mb-2">{action.reasoning}</div>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="text-green-600">
                              Time: {action.timeSaved} minutes saved
                            </span>
                            <span className="text-green-600">
                              Cost: ${Math.abs(action.costImpact)} impact
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}