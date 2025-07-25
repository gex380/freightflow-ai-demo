'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface MillProfileData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  millType: string
  capacity: string
  established: string
  employees: string
  currentCarriers: string[]
  monthlyShipments: string
  averageShipmentSize: string
  seasonalVariation: string
}

const MILL_TYPES = [
  { value: 'SAWMILL', label: 'Sawmill', description: 'Primary lumber processing from logs' },
  { value: 'PLANING_MILL', label: 'Planing Mill', description: 'Secondary processing and finishing' },
  { value: 'INTEGRATED_MILL', label: 'Integrated Mill', description: 'Full processing from logs to finished products' },
  { value: 'SPECIALTY_MILL', label: 'Specialty Mill', description: 'Custom millwork and specialty products' }
]

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

const COMMON_CARRIERS = [
  'FedEx Freight',
  'UPS Freight', 
  'Old Dominion',
  'XPO Logistics',
  'BNSF Railway',
  'Local Trucking',
  'Regional LTL',
  'Contract Haulers'
]

interface MillProfileFormProps {
  onSubmit: (data: MillProfileData) => void
  onNext: () => void
}

export function MillProfileForm({ onSubmit, onNext }: MillProfileFormProps) {
  const [formData, setFormData] = useState<MillProfileData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    millType: '',
    capacity: '',
    established: '',
    employees: '',
    currentCarriers: [],
    monthlyShipments: '',
    averageShipmentSize: '',
    seasonalVariation: ''
  })

  const [errors, setErrors] = useState<Partial<MillProfileData>>({})

  const handleInputChange = (field: keyof MillProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleCarrierToggle = (carrier: string) => {
    setFormData(prev => ({
      ...prev,
      currentCarriers: prev.currentCarriers.includes(carrier)
        ? prev.currentCarriers.filter(c => c !== carrier)
        : [...prev.currentCarriers, carrier]
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<MillProfileData> = {}

    if (!formData.name.trim()) newErrors.name = 'Mill name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state) newErrors.state = 'State is required'
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required'
    if (!formData.millType) newErrors.millType = 'Mill type is required'
    if (!formData.capacity.trim()) newErrors.capacity = 'Capacity is required'
    if (!formData.established.trim()) newErrors.established = 'Year established is required'
    if (!formData.employees.trim()) newErrors.employees = 'Number of employees is required'

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code'
    }

    if (formData.capacity && (isNaN(Number(formData.capacity)) || Number(formData.capacity) <= 0)) {
      newErrors.capacity = 'Please enter a valid capacity in board feet per month'
    }

    if (formData.established && (isNaN(Number(formData.established)) || Number(formData.established) < 1800 || Number(formData.established) > new Date().getFullYear())) {
      newErrors.established = 'Please enter a valid year between 1800 and current year'
    }

    if (formData.employees && (isNaN(Number(formData.employees)) || Number(formData.employees) <= 0)) {
      newErrors.employees = 'Please enter a valid number of employees'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Tell us about your lumber mill's location and contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mill Name *
              </label>
              <Input
                placeholder="Pacific Northwest Lumber Co."
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <Input
                type="email"
                placeholder="contact@mill.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <Input
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <Input
                placeholder="1234 Mill Road"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <Input
                placeholder="Portland"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${errors.state ? 'border-red-500' : ''}`}
                >
                  <option value="">Select State</option>
                  {US_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <Input
                  placeholder="97201"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className={errors.zipCode ? 'border-red-500' : ''}
                />
                {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mill Specifications</CardTitle>
          <CardDescription>
            Help us understand your mill's capabilities and operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mill Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {MILL_TYPES.map(type => (
                <div
                  key={type.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.millType === type.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => handleInputChange('millType', type.value)}
                >
                  <div className="font-medium text-sm">{type.label}</div>
                  <div className="text-xs text-gray-600">{type.description}</div>
                </div>
              ))}
            </div>
            {errors.millType && <p className="text-red-500 text-xs mt-1">{errors.millType}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Capacity (Board Feet) *
              </label>
              <Input
                placeholder="2500000"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                className={errors.capacity ? 'border-red-500' : ''}
              />
              {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year Established *
              </label>
              <Input
                placeholder="1985"
                value={formData.established}
                onChange={(e) => handleInputChange('established', e.target.value)}
                className={errors.established ? 'border-red-500' : ''}
              />
              {errors.established && <p className="text-red-500 text-xs mt-1">{errors.established}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Employees *
              </label>
              <Input
                placeholder="75"
                value={formData.employees}
                onChange={(e) => handleInputChange('employees', e.target.value)}
                className={errors.employees ? 'border-red-500' : ''}
              />
              {errors.employees && <p className="text-red-500 text-xs mt-1">{errors.employees}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Shipping Information</CardTitle>
          <CardDescription>
            Tell us about your existing freight operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Carriers (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {COMMON_CARRIERS.map(carrier => (
                <div
                  key={carrier}
                  className={`p-2 border rounded cursor-pointer text-sm transition-colors ${
                    formData.currentCarriers.includes(carrier)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => handleCarrierToggle(carrier)}
                >
                  {carrier}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Shipments
              </label>
              <Input
                placeholder="45"
                value={formData.monthlyShipments}
                onChange={(e) => handleInputChange('monthlyShipments', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Average Shipment Size (Board Feet)
              </label>
              <Input
                placeholder="25000"
                value={formData.averageShipmentSize}
                onChange={(e) => handleInputChange('averageShipmentSize', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seasonal Variation (%)
              </label>
              <Input
                placeholder="20"
                value={formData.seasonalVariation}
                onChange={(e) => handleInputChange('seasonalVariation', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Continue to Product Catalog
        </Button>
      </div>
    </form>
  )
}