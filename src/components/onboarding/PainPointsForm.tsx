'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface PainPointsData {
  currentChallenges: Challenge[]
  processIssues: string[]
  priorityLevel: string
  budgetRange: string
  timelineExpectation: string
  currentSolutions: string
  successMetrics: string[]
  additionalGoals: string
}

interface Challenge {
  issue: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  frequency: string
  impact: string
}

const COMMON_CHALLENGES = [
  {
    issue: 'Manual freight booking process',
    description: 'Time-consuming manual carrier selection and booking'
  },
  {
    issue: 'Limited carrier visibility',
    description: 'Lack of visibility into all available carrier options'
  },
  {
    issue: 'Inconsistent freight pricing',
    description: 'Unpredictable rates and difficulty comparing options'
  },
  {
    issue: 'Poor shipment tracking',
    description: 'Limited visibility once freight is in transit'
  },
  {
    issue: 'Freight damage issues',
    description: 'Lumber damaged during transportation'
  },
  {
    issue: 'Seasonal capacity constraints',
    description: 'Difficulty finding carriers during peak seasons'
  },
  {
    issue: 'Complex LTL consolidation',
    description: 'Challenges optimizing less-than-truckload shipments'
  },
  {
    issue: 'Oversized load coordination',
    description: 'Difficulty arranging transport for long lumber'
  },
  {
    issue: 'Customer communication gaps',
    description: 'Customers asking for shipment updates'
  },
  {
    issue: 'Billing reconciliation issues',
    description: 'Time spent matching invoices to shipments'
  }
]

const PROCESS_ISSUES = [
  'Multiple phone calls to get quotes',
  'Manual data entry and paperwork',
  'Lack of integration with our systems',
  'No real-time rate comparisons',
  'Difficult to track ROI on shipping costs',
  'No automated booking confirmations',
  'Manual shipment status updates',
  'Spreadsheet-based carrier management'
]

const SUCCESS_METRICS = [
  'Reduce shipping costs by 15-20%',
  'Save 10+ hours per week on logistics',
  'Improve on-time delivery rates',
  'Reduce freight damage claims',
  'Better customer satisfaction',
  'Automated reporting and analytics',
  'Eliminate manual booking processes',
  'Improve carrier relationship management'
]

interface PainPointsFormProps {
  onSubmit: (data: PainPointsData) => void
  onNext: () => void
  onPrevious: () => void
}

export function PainPointsForm({ onSubmit, onNext, onPrevious }: PainPointsFormProps) {
  const [selectedChallenges, setSelectedChallenges] = useState<Challenge[]>([])
  const [processIssues, setProcessIssues] = useState<string[]>([])
  const [priorityLevel, setPriorityLevel] = useState('')
  const [budgetRange, setBudgetRange] = useState('')
  const [timelineExpectation, setTimelineExpectation] = useState('')
  const [currentSolutions, setCurrentSolutions] = useState('')
  const [successMetrics, setSuccessMetrics] = useState<string[]>([])
  const [additionalGoals, setAdditionalGoals] = useState('')

  const toggleChallenge = (challengeIssue: string) => {
    const existingIndex = selectedChallenges.findIndex(c => c.issue === challengeIssue)
    
    if (existingIndex >= 0) {
      setSelectedChallenges(selectedChallenges.filter(c => c.issue !== challengeIssue))
    } else {
      setSelectedChallenges([...selectedChallenges, {
        issue: challengeIssue,
        severity: 'medium',
        frequency: 'weekly',
        impact: 'moderate'
      }])
    }
  }

  const updateChallengeSeverity = (issue: string, severity: 'low' | 'medium' | 'high' | 'critical') => {
    setSelectedChallenges(selectedChallenges.map(challenge =>
      challenge.issue === issue ? { ...challenge, severity } : challenge
    ))
  }

  const toggleProcessIssue = (issue: string) => {
    setProcessIssues(prev =>
      prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue]
    )
  }

  const toggleSuccessMetric = (metric: string) => {
    setSuccessMetrics(prev =>
      prev.includes(metric) ? prev.filter(m => m !== metric) : [...prev, metric]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const data: PainPointsData = {
      currentChallenges: selectedChallenges,
      processIssues,
      priorityLevel,
      budgetRange,
      timelineExpectation,
      currentSolutions,
      successMetrics,
      additionalGoals
    }
    
    onSubmit(data)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Freight Challenges</CardTitle>
          <CardDescription>
            Help FreightFlow understand your biggest shipping pain points
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {COMMON_CHALLENGES.map(challenge => {
              const isSelected = selectedChallenges.find(c => c.issue === challenge.issue)
              
              return (
                <div key={challenge.issue} className="space-y-2">
                  <div
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => toggleChallenge(challenge.issue)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{challenge.issue}</h4>
                        <p className="text-sm text-gray-600">{challenge.description}</p>
                      </div>
                      <div className={`w-4 h-4 rounded border-2 ${
                        isSelected ? 'bg-red-500 border-red-500' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="text-white text-xs">✓</div>}
                      </div>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="ml-6 flex items-center gap-2">
                      <span className="text-sm text-gray-600">Priority:</span>
                      {['low', 'medium', 'high', 'critical'].map(severity => (
                        <button
                          key={severity}
                          type="button"
                          onClick={() => updateChallengeSeverity(challenge.issue, severity as any)}
                          className={`px-2 py-1 text-xs rounded ${
                            isSelected.severity === severity
                              ? severity === 'critical' ? 'bg-red-600 text-white'
                                : severity === 'high' ? 'bg-red-500 text-white'
                                : severity === 'medium' ? 'bg-yellow-500 text-white'
                                : 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {severity}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Process Issues</CardTitle>
          <CardDescription>
            What specific process problems do you face with current freight operations?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-2">
            {PROCESS_ISSUES.map(issue => (
              <div
                key={issue}
                className={`p-3 border rounded cursor-pointer text-sm transition-colors ${
                  processIssues.includes(issue)
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => toggleProcessIssue(issue)}
              >
                {issue}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Implementation Details</CardTitle>
          <CardDescription>
            Help FreightFlow understand your priorities and constraints
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How urgent is solving these freight issues? *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['Low Priority', 'Medium Priority', 'High Priority', 'Critical/Urgent'].map(priority => (
                <div
                  key={priority}
                  className={`p-3 border rounded cursor-pointer text-sm text-center transition-colors ${
                    priorityLevel === priority
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setPriorityLevel(priority)}
                >
                  {priority}
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget Range for Freight Technology
              </label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <option value="">Select Budget Range</option>
                <option value="under-1000">Under $1,000/month</option>
                <option value="1000-5000">$1,000 - $5,000/month</option>
                <option value="5000-10000">$5,000 - $10,000/month</option>
                <option value="10000-plus">$10,000+/month</option>
                <option value="discuss">Prefer to discuss</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Implementation Timeline
              </label>
              <select
                value={timelineExpectation}
                onChange={(e) => setTimelineExpectation(e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <option value="">Select Timeline</option>
                <option value="immediate">Immediate (within 1 month)</option>
                <option value="short-term">Short term (1-3 months)</option>
                <option value="medium-term">Medium term (3-6 months)</option>
                <option value="long-term">Long term (6+ months)</option>
                <option value="evaluating">Still evaluating options</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Solutions You're Using
            </label>
            <textarea
              value={currentSolutions}
              onChange={(e) => setCurrentSolutions(e.target.value)}
              placeholder="Describe your current freight management process, software, or services..."
              className="flex min-h-20 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Success Metrics</CardTitle>
          <CardDescription>
            What would make FreightFlow a success for your operation?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-2">
            {SUCCESS_METRICS.map(metric => (
              <div
                key={metric}
                className={`p-3 border rounded cursor-pointer text-sm transition-colors ${
                  successMetrics.includes(metric)
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => toggleSuccessMetric(metric)}
              >
                {metric}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Goals or Requirements
            </label>
            <textarea
              value={additionalGoals}
              onChange={(e) => setAdditionalGoals(e.target.value)}
              placeholder="Any other specific goals, requirements, or concerns we should know about..."
              className="flex min-h-20 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Back to Product Catalog
        </Button>
        <Button type="submit" size="lg">
          Configure FreightFlow AI
        </Button>
      </div>
    </form>
  )
}