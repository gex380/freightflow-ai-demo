'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Keep some mock data as examples, but merge with real data
const EXAMPLE_MILLS = [
  {
    id: 1,
    name: "Pacific Northwest Lumber Co.",
    location: "Portland, OR",
    millType: "SAWMILL",
    capacity: 2500000,
    onboardingStatus: "COMPLETED",
    freightflowConfigured: true,
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
    onboardingStatus: "FREIGHTFLOW_CONFIG",
    freightflowConfigured: false,
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
    onboardingStatus: "PRODUCTS",
    freightflowConfigured: false,
    shipmentsThisMonth: 0,
    costSavings: 0,
    lastActivity: "1 day ago",
    isExample: true
  },
  {
    id: 4,
    name: "Coastal Cedar Works",
    location: "Seattle, WA",
    millType: "SAWMILL",
    capacity: 1800000,
    onboardingStatus: "COMPLETED",
    freightflowConfigured: true,
    shipmentsThisMonth: 62,
    costSavings: 18750,
    lastActivity: "30 minutes ago",
    isExample: true
  }
]

const RECENT_SHIPMENTS = [
  {
    id: "FFA-2024-001847",
    mill: "Pacific Northwest Lumber Co.",
    destination: "Chicago, IL",
    product: "50K BF Douglas Fir",
    carrier: "BNSF Railway",
    status: "In Transit",
    freightflowSavings: 340,
    estimatedDelivery: "Tomorrow 4PM"
  },
  {
    id: "FFA-2024-001823",
    mill: "Heritage Pine Mills",
    destination: "Atlanta, GA",
    product: "12.5K LF Pine Millwork",
    carrier: "FedEx Freight",
    status: "Delivered",
    freightflowSavings: 165,
    estimatedDelivery: "Delivered on time"
  },
  {
    id: "FFA-2024-001901",
    mill: "Coastal Cedar Works",
    destination: "Phoenix, AZ",
    product: "35K BF Cedar Decking",
    carrier: "Old Dominion",
    status: "Booked",
    freightflowSavings: 275,
    estimatedDelivery: "Friday 2PM"
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

  // Add function to navigate to live operations
  const handleLiveOperations = () => {
    router.push('/live-operations')
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
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700'
      case 'FREIGHTFLOW_CONFIG': return 'bg-blue-100 text-blue-700'
      case 'PRODUCTS': return 'bg-yellow-100 text-yellow-700'
      case 'PAIN_POINTS': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getShipmentStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700'
      case 'In Transit': return 'bg-blue-100 text-blue-700'
      case 'Booked': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">FreightFlow AI Operations</h1>
                <p className="text-gray-600">Manage lumber mill onboarding and freight coordination</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Refresh Data
                </Button>
                <Button variant="outline" onClick={handleLiveOperations}>
                  Live Operations
                </Button>
                <Button variant="outline">Export Report</Button>
                <Button onClick={handleAddNewMill}>+ Add New Mill</Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Mills</p>
                      <p className="text-2xl font-bold text-gray-900">{totalMills}</p>
                    </div>
                    <div className="ml-auto">
                      <div className="text-3xl text-blue-600">🏭</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed Onboarding</p>
                      <p className="text-2xl font-bold text-gray-900">{completedOnboarding}</p>
                      <p className="text-xs text-gray-500">
                        {Math.round((completedOnboarding / totalMills) * 100)}% completion rate
                      </p>
                    </div>
                    <div className="ml-auto">
                      <div className="text-3xl text-green-600">✓</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Shipments</p>
                      <p className="text-2xl font-bold text-gray-900">{totalShipments}</p>
                      <p className="text-xs text-gray-500">FreightFlow coordinated</p>
                    </div>
                    <div className="ml-auto">
                      <div className="text-3xl text-orange-600">📦</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Savings</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSavings)}</p>
                      <p className="text-xs text-gray-500">This month</p>
                    </div>
                    <div className="ml-auto">
                      <div className="text-3xl text-green-600">💰</div>
                    </div>
                  </div>
                </CardContent>
              </Card>