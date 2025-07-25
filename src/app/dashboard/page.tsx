'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const EXAMPLE_MILLS = [
  {
    id: 1,
    name: "Pacific Northwest Lumber Co.",
    location: "Portland, OR",
    millType: "SAWMILL",
    capacity: 2500000,
    onboardingStatus: "COMPLETED",
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
    shipmentsThisMonth: 18,
    costSavings: 0,
    lastActivity: "Active now",
    isExample: true
  }
]

export default function DashboardPage() {
  const router = useRouter()
  const [mills, setMills] = useState<any[]>([])

  useEffect(() => {
    const completedMills = JSON.parse(localStorage.getItem('completedMills') || '[]')
    const allMills = [...EXAMPLE_MILLS, ...completedMills]
    setMills(allMills)
  }, [])

  const handleAddNewMill = () => {
    router.push('/onboarding')
  }

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
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          
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
              <Button onClick={handleAddNewMill}>+ Add New Mill</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Mills</p>
                    <p className="text-2xl font-bold text-gray-900">{totalMills}</p>
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
                </div>
              </CardContent>
            </Card>
          </div>

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
                    </div>
                  </div>
                ))}

                {mills.length === 0 && (
                  <div className="text-center py-12">
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

        </div>
      </div>
    </div>
  )
}