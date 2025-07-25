'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProgressTracker } from '@/components/ui/progress'
import { MillProfileForm } from '@/components/onboarding/MillProfileForm'
import { ProductCatalogForm } from '@/components/onboarding/ProductCatalogForm'
import { PainPointsForm } from '@/components/onboarding/PainPointsForm'
import { FreightFlowConfigForm } from '@/components/onboarding/FreightFlowConfigForm'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Proper TypeScript types
type StepStatus = 'completed' | 'current' | 'upcoming'

interface OnboardingStep {
  id: string
  title: string
  description: string
  status: StepStatus
}

// Onboarding steps with FreightFlow branding
const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'profile',
    title: 'Mill Profile',
    description: 'Basic information',
    status: 'current'
  },
  {
    id: 'products',
    title: 'Product Catalog',
    description: 'Lumber specifications',
    status: 'upcoming'
  },
  {
    id: 'pain-points',
    title: 'Current Challenges',
    description: 'Shipping pain points',
    status: 'upcoming'
  },
  {
    id: 'freightflow-config',
    title: 'FreightFlow Setup',
    description: 'AI configuration',
    status: 'upcoming'
  },
  {
    id: 'go-live',
    title: 'Go Live',
    description: 'Final testing',
    status: 'upcoming'
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<OnboardingStep[]>(ONBOARDING_STEPS)
  const [millData, setMillData] = useState<any>(null)
  const [productData, setProductData] = useState<any>(null)
  const [painPointsData, setPainPointsData] = useState<any>(null)
  const [freightflowConfig, setFreightFlowConfig] = useState<any>(null)

  // Handle form submissions
  const handleMillProfileSubmit = (data: any) => {
    setMillData(data)
    console.log('Mill Profile Data:', data)
  }

  const handleProductCatalogSubmit = (data: any) => {
    setProductData(data)
    console.log('Product Catalog Data:', data)
  }

  const handlePainPointsSubmit = (data: any) => {
    setPainPointsData(data)
    console.log('Pain Points Data:', data)
  }

  const handleFreightFlowConfigSubmit = (config: any) => {
    setFreightFlowConfig(config)
    console.log('FreightFlow Configuration:', config)
  }

  // Navigation functions with proper TypeScript
  const updateSteps = (stepIndex: number) => {
    setSteps(prevSteps =>
      prevSteps.map((step, index) => ({
        ...step,
        status: (index < stepIndex ? 'completed' :
                index === stepIndex ? 'current' :
                'upcoming') as StepStatus
      }))
    )
  }

  const handleNextStep = () => {
    const nextStep = currentStep + 1
    updateSteps(nextStep)
    setCurrentStep(nextStep)
  }

  const handlePreviousStep = () => {
    const prevStep = Math.max(0, currentStep - 1)
    updateSteps(prevStep)
    setCurrentStep(prevStep)
  }

  const handleSkipToStep = (stepIndex: number) => {
    updateSteps(stepIndex)
    setCurrentStep(stepIndex)
  }

  const handleLaunchDashboard = () => {
    // Save the completed mill data to localStorage for dashboard
    if (millData) {
      const completedMill = {
        id: Date.now(),
        name: millData.name,
        location: `${millData.city}, ${millData.state}`,
        millType: millData.millType,
        capacity: parseInt(millData.capacity),
        onboardingStatus: 'COMPLETED',
        freightflowConfigured: true,
        shipmentsThisMonth: 0, // New mill, no shipments yet
        costSavings: 0, // Will accumulate over time
        lastActivity: 'Just completed onboarding',
        productCount: productData?.products?.length || 0,
        painPointCount: painPointsData?.currentChallenges?.length || 0,
        priorityLevel: painPointsData?.priorityLevel || 'Medium Priority',
        createdAt: new Date().toISOString()
      }

      // Get existing mills from localStorage
      const existingMills = JSON.parse(localStorage.getItem('completedMills') || '[]')
      
      // Add new mill
      const updatedMills = [...existingMills, completedMill]
      
      // Save back to localStorage
      localStorage.setItem('completedMills', JSON.stringify(updatedMills))
      
      console.log('Mill data saved to localStorage:', completedMill)
    }

    router.push('/dashboard')
  }

  // Render current step content
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <MillProfileForm
            onSubmit={handleMillProfileSubmit}
            onNext={handleNextStep}
          />
        )

      case 1:
        return (
          <ProductCatalogForm
            onSubmit={handleProductCatalogSubmit}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        )

      case 2:
        return (
          <PainPointsForm
            onSubmit={handlePainPointsSubmit}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        )

      case 3:
        return millData ? (
          <FreightFlowConfigForm
            millData={millData}
            productData={productData}
            painPointsData={painPointsData}
            onSubmit={handleFreightFlowConfigSubmit}
            onNext={handleNextStep}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>FreightFlow AI Configuration</CardTitle>
              <CardDescription>
                Mill profile data required for FreightFlow configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold mb-2">Complete Previous Steps</h3>
                <p className="text-gray-600 mb-6">
                  FreightFlow needs your mill profile and product data to generate intelligent configurations.
                </p>
                <Button onClick={() => setCurrentStep(0)}>
                  Start from Beginning
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>🎉 Onboarding Complete!</CardTitle>
              <CardDescription>
                Your lumber mill is now configured with FreightFlow AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Completion Summary */}
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">
                    ✅ Setup Complete
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-green-700">Mill Profile</div>
                      <div className="text-green-600">
                        {millData?.name || 'Configured'}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-green-700">Products Configured</div>
                      <div className="text-green-600">
                        {productData?.products?.length || 0} lumber products
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-green-700">Pain Points Identified</div>
                      <div className="text-green-600">
                        {painPointsData?.currentChallenges?.length || 0} challenges addressed
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Persistence Confirmation */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-700 font-medium">
                    📊 Data saved to operations dashboard
                  </p>
                  <p className="text-blue-600 text-sm mt-1">
                    Your mill will appear in the FreightFlow operations dashboard
                  </p>
                </div>

                {/* FreightFlow Configuration Summary */}
                {freightflowConfig && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      FreightFlow AI Configuration Summary
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-700">Routing Rules</div>
                        <div className="text-gray-600">
                          {freightflowConfig.routingRules?.length || 0} intelligent rules configured
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">Carrier Preferences</div>
                        <div className="text-gray-600">
                          {freightflowConfig.carrierPreferences?.length || 0} carriers optimized
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">Rate Strategy</div>
                        <div className="text-gray-600">
                          {freightflowConfig.rateOptimization?.primary_objective || 'Balanced'} optimization
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">Estimated Monthly Savings</div>
                        <div className="text-green-600 font-medium">
                          $8,200 - $15,400
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-3">Ready to Launch!</h3>
                  <p className="text-gray-600 mb-6">
                    Your FreightFlow AI system is configured and ready to optimize your lumber shipping operations.
                  </p>
                  
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => setCurrentStep(3)}>
                      ← Review Configuration
                    </Button>
                    <Button onClick={handleLaunchDashboard} size="lg" className="bg-green-600 hover:bg-green-700">
                      Launch FreightFlow Dashboard →
                    </Button>
                  </div>
                </div>

                {/* Development Options */}
                <div className="border-t pt-4 text-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSkipToStep(3)}
                    className="text-xs"
                  >
                    🔧 Skip to FreightFlow Configuration (Development)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return (
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-lg font-semibold mb-2">More Steps Coming!</h3>
                <p className="text-gray-600">
                  Additional onboarding steps will be built here.
                </p>
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Lumber Mill Onboarding
            </h1>
            <p className="text-gray-600">
              Let's get your mill set up with FreightFlow AI freight coordination
            </p>
          </div>

          {/* Progress Tracker */}
          <div className="mb-8">
            <ProgressTracker steps={steps} />
          </div>

          {/* Current Step Content */}
          <div className="mb-8">
            {renderCurrentStep()}
          </div>

          {/* Progress Footer */}
          <div className="text-center text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length} • 
            Estimated time remaining: {Math.max(0, (steps.length - currentStep - 1) * 3)} minutes
          </div>
        </div>
      </div>
    </div>
  )
}