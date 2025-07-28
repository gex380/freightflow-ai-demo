'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const router = useRouter()
  const [mills, setMills] = useState<any[]>([])

  useEffect(() => {
    const completedMills = JSON.parse(localStorage.getItem('completedMills') || '[]')
    const exampleMills = [
      {
        id: 1,
        name: "Pacific Northwest Lumber Co.",
        location: "Portland, OR",
        onboardingStatus: "COMPLETED",
        shipmentsThisMonth: 45,
        costSavings: 23400,
        isExample: true
      },
      {
        id: 2,
        name: "Heritage Pine Mills", 
        location: "Atlanta, GA",
        onboardingStatus: "WILSON_CONFIG",
        shipmentsThisMonth: 18,
        costSavings: 0,
        isExample: true
      }
    ]
    setMills([...exampleMills, ...completedMills])
  }, [])

  const totalMills = mills.length
  const totalShipments = mills.reduce((sum, mill) => sum + (mill.shipmentsThisMonth || 0), 0)
  const totalSavings = mills.reduce((sum, mill) => sum + (mill.costSavings || 0), 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
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
              <Button variant="outline" onClick={() => router.push('/live-operations')}>
                Live Operations
              </Button>
              <Button onClick={() => router.push('/onboarding')}>
                + Add New Mill
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Mills</p>
                  <p className="text-2xl font-bold text-gray-900">{totalMills}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Shipments</p>
                  <p className="text-2xl font-bold text-gray-900">{totalShipments}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cost Savings</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSavings)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Lumber Mills</h2>
              <div className="space-y-4">
                {mills.map(mill => (
                  <div key={mill.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                      <p className="text-sm text-gray-600">{mill.location}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">{mill.shipmentsThisMonth || 0}</div>
                        <div className="text-xs text-gray-500">Shipments</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-green-600">{formatCurrency(mill.costSavings || 0)}</div>
                        <div className="text-xs text-gray-500">Savings</div>
                      </div>
                    </div>
                  </div>
                ))}

                {mills.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">No Mills Yet</h3>
                    <p className="text-gray-600 mb-4">Start by onboarding your first lumber mill.</p>
                    <Button onClick={() => router.push('/onboarding')}>
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