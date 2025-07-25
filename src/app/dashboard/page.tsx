'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Mock data for example mills
const EXAMPLE_MILLS = [
  {
    id: 1,
    name: "Pacific Northwest Lumber Co.",
    location: "Portland, OR",
    millType: "SAWMILL",
    capacity: 2500000,
    onboardingStatus: "COMPLETED",
    wilsonConfigured: true,
    shipmentsThisMonth: 45,
    costSavings: 23400,
    lastActivity: "2 hours ago",
    isExample: true
  },
  {
    id: 2,
    name: "Heritage Pine Mills",
    location: "Atlanta, GA", 
    millType: "SPECIALTY_MILL",
    capacity: 800000,
    onboardingStatus: "WILSON_CONFIG",
    wilsonConfigured: false,
    shipmentsThisMonth: 18,
    costSavings: 0,
    lastActivity: "Active now",
    isExample: true
  },
  {
    id: 3,
    name: "Mountain View Integrated",
    location: "Denver, CO",
    millType: "INTEGRATED_MILL", 
    capacity: 1200000,
    onboardingStatus: "PRODUCT_CATALOG",
    wilsonConfigured: false,
    shipmentsThisMonth: 0,
    costSavings: 0,
    lastActivity: "1 day ago",
    isExample: true
  },
  {
    id: 4,
    name: "Coastal Cedar Works",
    location: "Eureka, CA",
    millType: "SPECIALTY_MILL",
    capacity: 600000,
    onboardingStatus: "COMPLETED",
    wilsonConfigured: true,
    shipmentsThisMonth: 28,
    costSavings: 15600,
    lastActivity: "6 hours ago", 
    isExample: true
  }
]

export default function DashboardPage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState('overview')
  const [mills, setMills] = useState<any[]>([])
  const [selectedMill, setSelectedMill] = useState<any>(null)

  // Load mills from localStorage on component mount
  useEffect(() => {
    const completedMills = JSON.parse(localStorage.getItem('completedMills') || '[]')
    // Combine example mills with real completed mills
    const allMills = [...EXAMPLE_MILLS, ...completedMills]
    setMills(allMills)
    console.log('Loaded mills:', allMills)
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'WILSON_CONFIG':
        return 'bg-blue-100 text-blue-800'
      case 'PRODUCT_CATALOG':
        return 'bg-yellow-100 text-yellow-800'
      case 'PAIN_POINTS':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const tabs = [
    { id: 'overview', label: 'Mills Overview', description: 'Active lumber mills and their onboarding status' },
    { id: 'shipments', label: 'Recent Shipments', description: 'Latest freight coordination activity' },
    { id: 'analytics', label: 'Performance Analytics', description: 'FreightFlow AI performance metrics' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FreightFlow AI Operations</h1>
              <p className="text-gray-600">Monitor lumber mill onboarding and freight coordination</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Refresh Data
              </Button>
              <Button variant="outline" onClick={() => router.push('/live-operations')}>
                Live Operations
              </Button>
              <Button variant="outline">Export Report</Button>
              <Button onClick={handleAddNewMill}>+ Add New Mill</Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Mills</p>
                    <p className="text-2xl font-bold text-gray-900">{totalMills}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Onboarding Complete</p>
                    <p className="text-2xl font-bold text-gray-900">{completedOnboarding}/{totalMills}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Shipments</p>
                    <p className="text-2xl font-bold text-gray-900">{totalShipments}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cost Savings</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSavings)}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tab Navigation */}
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

          {/* Tab Content */}
          {selectedTab === 'overview' && (
            <Card>
              <CardHeader>
                <CardTitle>Lumber Mills Overview</CardTitle>
                <CardDescription>
                  Monitor onboarding progress and FreightFlow AI performance across all mills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mills.map(mill => (
                    <div key={mill.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900">{mill.name}</h4>
                              {mill.isExample && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  Example
                                </span>
                              )}
                              {!mill.isExample && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                  Your Mill
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{mill.location} • {mill.millType.replace('_', ' ')}</p>
                            <p className="text-xs text-gray-500">
                              {(mill.capacity / 1000000).toFixed(1)}M BF/month capacity
                              {mill.productCount && ` • ${mill.productCount} products configured`}
                              {mill.painPointCount && ` • ${mill.painPointCount} pain points addressed`}
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedMill(mill)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}

                  {mills.length === 0 && (
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
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTab === 'shipments' && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Shipments</CardTitle>
                <CardDescription>
                  Latest freight coordination activity across all mills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📦</div>
                  <h3 className="text-lg font-semibold mb-2">Live Shipment Tracking</h3>
                  <p className="text-gray-600 mb-4">
                    View real-time shipment coordination in the Live Operations dashboard.
                  </p>
                  <Button onClick={() => router.push('/live-operations')}>
                    View Live Operations
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTab === 'analytics' && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  FreightFlow AI performance metrics and optimization insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Average Cost Reduction</h4>
                    <p className="text-3xl font-bold text-blue-600">18.5%</p>
                    <p className="text-blue-700 text-sm">vs manual freight coordination</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">On-Time Delivery Rate</h4>
                    <p className="text-3xl font-bold text-green-600">94.7%</p>
                    <p className="text-green-700 text-sm">FreightFlow AI optimized routes</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Time Savings</h4>
                    <p className="text-3xl font-bold text-purple-600">89%</p>
                    <p className="text-purple-700 text-sm">reduction in booking time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mill Details Modal */}
          {selectedMill && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{selectedMill.name}</h2>
                  <Button variant="outline" onClick={() => setSelectedMill(null)} size="sm">
                    × Close
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Location</h3>
                      <p className="text-gray-600">{selectedMill.location}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Mill Type</h3>
                      <p className="text-gray-600">{selectedMill.millType.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Capacity</h3>
                      <p className="text-gray-600">{(selectedMill.capacity / 1000000).toFixed(1)}M BF/month</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Status</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedMill.onboardingStatus)}`}>
                        {selectedMill.onboardingStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-3">Performance Metrics</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{selectedMill.shipmentsThisMonth || 0}</p>
                        <p className="text-xs text-gray-500">Shipments This Month</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedMill.costSavings || 0)}</p>
                        <p className="text-xs text-gray-500">Total Savings</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{selectedMill.wilsonConfigured ? 'Yes' : 'No'}</p>
                        <p className="text-xs text-gray-500">FreightFlow Configured</p>
                      </div>
                    </div>
                  </div>

                  {/* Onboarding Details */}
                  {!selectedMill.isExample && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-700 mb-3">Onboarding Details</h3>
                      <div className="space-y-2">
                        {selectedMill.productCount && (
                          <p className="text-sm text-gray-600">• {selectedMill.productCount} products configured</p>
                        )}
                        {selectedMill.painPointCount && (
                          <p className="text-sm text-gray-600">• {selectedMill.painPointCount} pain points identified</p>
                        )}
                        {selectedMill.priorityLevel && (
                          <p className="text-sm text-gray-600">• Priority Level: {selectedMill.priorityLevel}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button onClick={() => router.push('/live-operations')}>
                      View Shipments
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/onboarding')}>
                      Edit Details
                    </Button>
                    {selectedMill.onboardingStatus !== 'COMPLETED' && (
                      <Button variant="outline" onClick={() => router.push('/onboarding')}>
                        Continue Onboarding
                      </Button>
                    )}
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