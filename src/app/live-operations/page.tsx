'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FreightPricingService, type FreightRate } from '@/lib/freight-pricing'
import { ShipmentCoordinationService, type LiveShipment } from '@/lib/shipment-coordination'

export default function LiveOperationsPage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState('coordination')
  const [liveShipments, setLiveShipments] = useState<LiveShipment[]>([])
  const [freightRates, setFreightRates] = useState<FreightRate[]>([])
  const [selectedShipment, setSelectedShipment] = useState<LiveShipment | null>(null)
  const [isLoadingRates, setIsLoadingRates] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)

  useEffect(() => {
    const shipments = ShipmentCoordinationService.getCurrentShipments()
    setLiveShipments(shipments)
  }, [])

  const loadFreightRates = async () => {
    setIsLoadingRates(true)
    try {
      const rates = await FreightPricingService.getCurrentRates('Portland, OR', 'Chicago, IL', 45000)
      setFreightRates(rates)
    } catch (error) {
      console.error('Error loading freight rates:', error)
    } finally {
      setIsLoadingRates(false)
    }
  }

  const simulateNewShipment = async () => {
    setIsSimulating(true)
    try {
      const newShipment = await ShipmentCoordinationService.simulateNewShipment('Demo Mill')
      setLiveShipments(prev => [newShipment, ...prev])
    } catch (error) {
      console.error('Error simulating shipment:', error)
    } finally {
      setIsSimulating(false)
    }
  }

  const tabs = [
    { id: 'coordination', label: 'Live Coordination', description: 'Real-time freight coordination' },
    { id: 'pricing', label: 'Market Pricing', description: 'Live freight rates and trends' },
    { id: 'intelligence', label: 'AI Intelligence', description: 'FreightFlow AI insights and automation' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          
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
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Refresh Data
              </Button>
              <Button
                onClick={isSimulating ? undefined : simulateNewShipment}
                className={isSimulating ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
              >
                {isSimulating ? 'Simulating...' : 'Simulate New Shipment'}
              </Button>
            </div>
          </div>

          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {selectedTab === 'coordination' && (
            <Card>
              <CardHeader>
                <CardTitle>FreightFlow AI in Action</CardTitle>
                <CardDescription>
                  Real-time freight coordination showing AI decision-making and cost optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {liveShipments.map((shipment) => (
                    <div
                      key={shipment.id}
                      className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all mb-4"
                      onClick={() => setSelectedShipment(shipment)}
                    >
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

                  {liveShipments.length === 0 && (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-semibold mb-2">No Active Shipments</h3>
                      <p className="text-gray-600 mb-4">
                        Simulate a new shipment to see FreightFlow AI in action.
                      </p>
                      <Button onClick={simulateNewShipment}>
                        Simulate New Shipment
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTab === 'pricing' && (
            <Card>
              <CardHeader>
                <CardTitle>Live Freight Market Rates</CardTitle>
                <CardDescription>
                  Real-time freight pricing with FreightFlow AI recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Current Market Rates</h3>
                      <p className="text-gray-600">Portland, OR → Chicago, IL • 45,000 lbs</p>
                    </div>
                    <Button
                      onClick={isLoadingRates ? undefined : loadFreightRates}
                      className={isLoadingRates ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                    >
                      {isLoadingRates ? 'Loading Market Rates...' : 'Get Live Market Rates'}
                    </Button>
                  </div>

                  {isLoadingRates && (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading current market rates...</p>
                    </div>
                  )}

                  {freightRates.length > 0 && (
                    <div className="space-y-4">
                      {freightRates.map((rate, index) => (
                        <div key={index} className="bg-white border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="font-semibold text-gray-900">{rate.carrier}</h4>
                                <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  {rate.serviceType}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                Transit Time: {rate.transitTime}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-gray-900">
                                ${rate.rate.toFixed(2)}/cwt
                              </div>
                              <div className="text-sm text-gray-500">
                                Est. Total: ${((rate.rate * 450) / 100).toFixed(0)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">FreightFlow AI Recommendation</h4>
                        <p className="text-blue-800">
                          Based on current market conditions, BNSF Railway offers the best value with 32% cost savings compared to LTL options. 
                          Rail transit time is acceptable for non-urgent shipments.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTab === 'intelligence' && (
            <Card>
              <CardHeader>
                <CardTitle>FreightFlow AI Intelligence</CardTitle>
                <CardDescription>
                  Process automation metrics and AI decision insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Process Automation</h4>
                      <p className="text-3xl font-bold text-blue-600">93.6%</p>
                      <p className="text-blue-700 text-sm">time savings vs manual booking</p>
                      <p className="text-blue-600 text-xs mt-2">47 minutes → 3 minutes average</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Cost Intelligence</h4>
                      <p className="text-3xl font-bold text-green-600">25.6%</p>
                      <p className="text-green-700 text-sm">average cost reduction</p>
                      <p className="text-green-600 text-xs mt-2">Intelligent carrier selection</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Route Optimization</h4>
                      <p className="text-3xl font-bold text-purple-600">98.2%</p>
                      <p className="text-purple-700 text-sm">on-time delivery rate</p>
                      <p className="text-purple-600 text-xs mt-2">AI-optimized routing</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-4">Recent AI Decisions</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-500 rounded-full w-2 h-2 mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-900">Route Optimization - Portland to Denver</p>
                          <p className="text-gray-600 text-sm">Avoided weekend restrictions, saved 2 hours and $45 in fees</p>
                          <p className="text-gray-500 text-xs">2 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-500 rounded-full w-2 h-2 mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-900">Carrier Selection - Seattle to Phoenix</p>
                          <p className="text-gray-600 text-sm">Switched to rail intermodal for 23% cost savings on lumber shipment</p>
                          <p className="text-gray-500 text-xs">5 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-purple-500 rounded-full w-2 h-2 mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-900">Insurance Optimization</p>
                          <p className="text-gray-600 text-sm">High-value cabinet grade lumber detected, automatically added appropriate coverage</p>
                          <p className="text-gray-500 text-xs">8 minutes ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedShipment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Shipment Details: {selectedShipment.id}</h2>
                  <Button variant="outline" onClick={() => setSelectedShipment(null)} size="sm">
                    × Close
                  </Button>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3">Shipment Timeline</h3>
                      <div className="space-y-3">
                        {selectedShipment.timeline.map((event, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className={`rounded-full w-3 h-3 mt-1 ${event.isWilsonAction ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                            <div>
                              <p className="font-medium text-gray-900">{event.status.toUpperCase()}</p>
                              <p className="text-gray-600 text-sm">{event.description}</p>
                              <p className="text-gray-500 text-xs">{new Date(event.timestamp).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3">AI Actions</h3>
                      <div className="space-y-3">
                        {selectedShipment.wilsonActions.map((action, index) => (
                          <div key={index} className="bg-blue-50 p-3 rounded-lg">
                            <p className="font-medium text-blue-900">{action.action}</p>
                            <p className="text-blue-700 text-sm">{action.reasoning}</p>
                            <p className="text-blue-600 text-xs mt-1">
                              Saved {action.timeSaved} minutes • ${Math.abs(action.costImpact)} impact
                            </p>
                          </div>
                        ))}
                      </div>
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