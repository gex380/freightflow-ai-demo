'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Example mills to show alongside real user data
const EXAMPLE_MILLS = [
  {
    id: 1,
    name: "Pacific Northwest Lumber Co.",
    location: "Portland, OR",
    millType: "SAWMILL",
    capacity: 2500000,
    onboardingStatus: "COMPLETED",
    FreightFlowConfigured: true,
    shipmentsThisMonth: 45,
    costSavings: 23400,
    lastActivity: "2 hours ago",
    productCount: 4,
    painPointCount: 3,
    priorityLevel: "High Priority",
    isExample: true
  },
  {
    id: 2,
    name: "Heritage Pine Mills",
    location: "Atlanta, GA", 
    millType: "SPECIALTY_MILL",
    capacity: 800000,
    onboardingStatus: "FreightFlow_CONFIG",
    FreightFlowConfigured: false,
    shipmentsThisMonth: 18,
    costSavings: 0,
    lastActivity: "Active now",
    productCount: 6,
    painPointCount: 5,
    priorityLevel: "Critical/Urgent",
    isExample: true
  },
  {
    id: 3,
    name: "Mountain View Integrated",
    location: "Denver, CO",
    millType: "INTEGRATED_MILL", 
    capacity: 4200000,
    onboardingStatus: "PRODUCT_CATALOG",
    FreightFlowConfigured: false,
    shipmentsThisMonth: 0,
    costSavings: 0,
    lastActivity: "1 day ago",
    productCount: 0,
    painPointCount: 0,
    priorityLevel: "Medium Priority",
    isExample: true
  },
  {
    id: 4,
    name: "Coastal Cedar Works",
    location: "Seattle, WA",
    millType: "PLANING_MILL",
    capacity: 1200000,
    onboardingStatus: "COMPLETED",
    FreightFlowConfigured: true,
    shipmentsThisMonth: 32,
    costSavings: 15800,
    lastActivity: "30 minutes ago",
    productCount: 3,
    painPointCount: 4,
    priorityLevel: "Medium Priority",
    isExample: true
  }
]

const RECENT_SHIPMENTS = [
  {
    id: "WS-2024-001",
    mill: "Pacific Northwest Lumber Co.",
    destination: "Chicago, IL",
    products: "Douglas Fir 2x4x16",
    weight: 42000,
    carrier: "BNSF Railway", 
    status: "IN_TRANSIT",
    FreightFlowSavings: 850,
    estimatedDelivery: "Jan 25, 2025"
  },
  {
    id: "WS-2024-002", 
    mill: "Coastal Cedar Works",
    destination: "Phoenix, AZ",
    products: "Cedar Decking Boards",
    weight: 18500,
    carrier: "FedEx Freight",
    status: "DELIVERED",
    FreightFlowSavings: 420,
    estimatedDelivery: "Delivered"
  },
  {
    id: "WS-2024-003",
    mill: "Pacific Northwest Lumber Co.",
    destination: "Dallas, TX", 
    products: "Structural Beams",
    weight: 65000,
    carrier: "XPO Logistics",
    status: "QUOTED",
    FreightFlowSavings: 1200,
    estimatedDelivery: "Jan 28, 2025"
  }
]

export default function DashboardPage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState('overview')
  const [mills, setMills] = useState<any[]>([])

  // Load mills from localStorage on component mount
  useEffect(() => {
    const completedMills = JSON.parse(localStorage.getItem('completedMills') || '[]')
    
    // Combine example mills with real completed mills
    const allMills = [...EXAMPLE_MILLS, ...completedMills]
    
    setMills(allMills)
    
    console.log('Loaded mills for dashboard:', allMills)
  }, [])

  // Add function to handle adding new mill
  const handleAddNewMill = () => {
    router.push('/onboarding')
  }

  // Calculate summary metrics
  const totalMills = mills.length
  const completedOnboarding = mills.filter(m => m.onboardingStatus === 'COMPLETED').length
  const totalShipments = mills.reduce((sum, mill) => sum + (mill.shipmentsThisMonth || 0), 0)
  const totalSavings = mills.reduce((sum, mill) => sum + (mill.costSavings || 0), 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'FreightFlow_CONFIG': return 'bg-blue-100 text-blue-800'
      case 'PRODUCT_CATALOG': return 'bg-yellow-100 text-yellow-800'
      case 'IN_TRANSIT': return 'bg-blue-100 text-blue-800'
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      case 'QUOTED': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                FreightFlow Operations Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor lumber mill onboarding and freight coordination
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Refresh Data
              </Button>
              <Button variant="outline">Export Report</Button>
              <Button onClick={handleAddNewMill}>+ Add New Mill</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Metrics Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Mills</p>
                  <p className="text-3xl font-bold text-gray-900">{totalMills}</p>
                  <p className="text-xs text-gray-500">
                    {mills.filter(m => !m.isExample).length} your mills + {mills.filter(m => m.isExample).length} examples
                  </p>
                </div>
                <div className="text-blue-600">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Onboarded</p>
                  <p className="text-3xl font-bold text-green-600">{completedOnboarding}</p>
                  <p className="text-xs text-gray-500">
                    {Math.round((completedOnboarding / totalMills) * 100)}% completion rate
                  </p>
                </div>
                <div className="text-green-600">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Shipments This Month</p>
                  <p className="text-3xl font-bold text-blue-600">{totalShipments}</p>
                  <p className="text-xs text-gray-500">↗ 23% from last month</p>
                </div>
                <div className="text-blue-600">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">FreightFlow Savings</p>
                  <p className="text-3xl font-bold text-purple-600">{formatCurrency(totalSavings)}</p>
                  <p className="text-xs text-gray-500">This month</p>
                </div>
                <div className="text-purple-600">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Mills Overview' },
                { id: 'shipments', label: 'Recent Shipments' },
                { id: 'analytics', label: 'Analytics' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
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
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <Card>
            <CardHeader>
              <CardTitle>Lumber Mills Overview</CardTitle>
              <CardDescription>
                Monitor onboarding progress and FreightFlow performance across all mills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mills.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🏭</div>
                    <h3 className="text-lg font-semibold mb-2">No Mills Yet</h3>
                    <p className="text-gray-600 mb-4">
                      Start by onboarding your first lumber mill with FreightFlow AI.
                    </p>
                    <Button onClick={handleAddNewMill}>
                      Add Your First Mill
                    </Button>
                  </div>
                ) : (
                  mills.map(mill => (
                    <div key={mill.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900">{mill.name}</h4>
                              {mill.isExample ? (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  Example
                                </span>
                              ) : (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                  Your Mill
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{mill.location} • {mill.millType.replace('_', ' ')}</p>
                            <p className="text-xs text-gray-500">
                              {(mill.capacity / 1000000).toFixed(1)}M BF/month capacity
                              {mill.productCount > 0 && ` • ${mill.productCount} products configured`}
                              {mill.painPointCount > 0 && ` • ${mill.painPointCount} pain points addressed`}
                              {mill.priorityLevel && ` • ${mill.priorityLevel}`}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900">{mill.shipmentsThisMonth || 0}</div>
                          <div className="text-xs text-gray-500">Shipments</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm font-medium text-green-600">{formatCurrency(mill.costSavings || 0)}</div>
                          <div className="text-xs text-gray-500">Savings</div>
                        </div>
                        
                        <div className="text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(mill.onboardingStatus)}`}>
                            {mill.onboardingStatus.replace('_', ' ')}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">{mill.lastActivity}</div>
                        </div>
                        
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTab === 'shipments' && (
          <Card>
            <CardHeader>
              <CardTitle>Recent FreightFlow-Coordinated Shipments</CardTitle>
              <CardDescription>
                Live freight coordination and cost optimization in action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {RECENT_SHIPMENTS.map(shipment => (
                  <div key={shipment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-medium text-blue-600">{shipment.id}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(shipment.status)}`}>
                          {shipment.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 font-medium">{shipment.mill}</p>
                      <p className="text-sm text-gray-600">
                        {shipment.products} → {shipment.destination}
                      </p>
                      <p className="text-xs text-gray-500">
                        {shipment.weight.toLocaleString()} lbs via {shipment.carrier}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        +{formatCurrency(shipment.FreightFlowSavings)} saved
                      </div>
                      <div className="text-xs text-gray-500">
                        {shipment.estimatedDelivery}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTab === 'analytics' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>FreightFlow Performance</CardTitle>
                <CardDescription>
                  AI-powered optimization results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Cost Reduction</span>
                    <span className="text-lg font-bold text-green-600">18.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">On-Time Delivery Rate</span>
                    <span className="text-lg font-bold text-blue-600">96.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Carrier Optimization Score</span>
                    <span className="text-lg font-bold text-purple-600">9.1/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Auto-Booking Success</span>
                    <span className="text-lg font-bold text-green-600">94.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Onboarding Funnel</CardTitle>
                <CardDescription>
                  Customer journey through FreightFlow setup
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Mill Profile Created</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '100%'}}></div>
                      </div>
                      <span className="text-sm font-medium">{mills.length}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Product Catalog</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '80%'}}></div>
                      </div>
                      <span className="text-sm font-medium">{mills.filter(m => m.productCount > 0).length}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">FreightFlow Configured</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '60%'}}></div>
                      </div>
                      <span className="text-sm font-medium">{mills.filter(m => m.FreightFlowConfigured).length}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Go Live</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '50%'}}></div>
                      </div>
                      <span className="text-sm font-medium">{completedOnboarding}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}