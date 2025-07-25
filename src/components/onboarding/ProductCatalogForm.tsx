'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ProductCatalogData {
  products: LumberProduct[]
  specialRequirements: string[]
  seasonalProducts: boolean
  customOrders: boolean
  averageOrderValue: string
  notes: string
}

interface LumberProduct {
  id: string
  species: string
  grade: string
  dimensions: string[]
  treatment: string
  monthlyVolume: string
  unitPrice: string
  specialHandling: boolean
}

const WOOD_SPECIES = [
  'Douglas Fir', 'Southern Pine', 'Eastern White Pine', 'Western Red Cedar',
  'Hemlock', 'SPF (Spruce-Pine-Fir)', 'Poplar', 'Oak', 'Maple', 'Cherry', 'Walnut', 'Other'
]

const LUMBER_GRADES = [
  'Select Structural', 'No. 1 & Better', 'No. 2 & Better', 'Construction',
  'Standard', 'Utility', 'Stud', 'Appearance Grade', 'Cabinet Grade'
]

const TREATMENTS = [
  'Kiln Dried', 'Air Dried', 'Pressure Treated', 'Fire Retardant', 'Green (Untreated)'
]

const STANDARD_DIMENSIONS = [
  '1x2', '1x4', '1x6', '1x8', '1x10', '1x12',
  '2x2', '2x4', '2x6', '2x8', '2x10', '2x12',
  '4x4', '4x6', '6x6', '8x8', 'Custom Sizes'
]

interface ProductCatalogFormProps {
  onSubmit: (data: ProductCatalogData) => void
  onNext: () => void
  onPrevious: () => void
}

export function ProductCatalogForm({ onSubmit, onNext, onPrevious }: ProductCatalogFormProps) {
  const [products, setProducts] = useState<LumberProduct[]>([
    {
      id: '1',
      species: '',
      grade: '',
      dimensions: [],
      treatment: '',
      monthlyVolume: '',
      unitPrice: '',
      specialHandling: false
    }
  ])

  const [specialRequirements, setSpecialRequirements] = useState<string[]>([])
  const [seasonalProducts, setSeasonalProducts] = useState(false)
  const [customOrders, setCustomOrders] = useState(false)
  const [averageOrderValue, setAverageOrderValue] = useState('')
  const [notes, setNotes] = useState('')

  const addProduct = () => {
    setProducts([...products, {
      id: Date.now().toString(),
      species: '',
      grade: '',
      dimensions: [],
      treatment: '',
      monthlyVolume: '',
      unitPrice: '',
      specialHandling: false
    }])
  }

  const updateProduct = (id: string, field: keyof LumberProduct, value: any) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ))
  }

  const removeProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter(product => product.id !== id))
    }
  }

  const toggleDimension = (productId: string, dimension: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      const newDimensions = product.dimensions.includes(dimension)
        ? product.dimensions.filter(d => d !== dimension)
        : [...product.dimensions, dimension]
      updateProduct(productId, 'dimensions', newDimensions)
    }
  }

  const toggleSpecialRequirement = (requirement: string) => {
    setSpecialRequirements(prev => 
      prev.includes(requirement)
        ? prev.filter(r => r !== requirement)
        : [...prev, requirement]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const data: ProductCatalogData = {
      products: products.filter(p => p.species && p.grade),
      specialRequirements,
      seasonalProducts,
      customOrders,
      averageOrderValue,
      notes
    }
    
    onSubmit(data)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Lumber Products</CardTitle>
          <CardDescription>
            Define the lumber products your mill produces for FreightFlow to optimize shipping
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {products.map((product, index) => (
            <div key={product.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Product {index + 1}</h4>
                {products.length > 1 && (
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    onClick={() => removeProduct(product.id)}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wood Species *
                  </label>
                  <select
                    value={product.species}
                    onChange={(e) => updateProduct(product.id, 'species', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    required
                  >
                    <option value="">Select Species</option>
                    {WOOD_SPECIES.map(species => (
                      <option key={species} value={species}>{species}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lumber Grade *
                  </label>
                  <select
                    value={product.grade}
                    onChange={(e) => updateProduct(product.id, 'grade', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    required
                  >
                    <option value="">Select Grade</option>
                    {LUMBER_GRADES.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Treatment
                  </label>
                  <select
                    value={product.treatment}
                    onChange={(e) => updateProduct(product.id, 'treatment', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <option value="">Select Treatment</option>
                    {TREATMENTS.map(treatment => (
                      <option key={treatment} value={treatment}>{treatment}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Volume (Board Feet)
                  </label>
                  <Input
                    placeholder="50000"
                    value={product.monthlyVolume}
                    onChange={(e) => updateProduct(product.id, 'monthlyVolume', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Standard Dimensions
                </label>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {STANDARD_DIMENSIONS.map(dimension => (
                    <div
                      key={dimension}
                      className={`p-2 border rounded cursor-pointer text-sm text-center transition-colors ${
                        product.dimensions.includes(dimension)
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => toggleDimension(product.id, dimension)}
                    >
                      {dimension}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`special-${product.id}`}
                  checked={product.specialHandling}
                  onChange={(e) => updateProduct(product.id, 'specialHandling', e.target.checked)}
                />
                <label htmlFor={`special-${product.id}`} className="text-sm text-gray-700">
                  Requires special handling during shipping
                </label>
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addProduct}>
            + Add Another Product
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Requirements</CardTitle>
          <CardDescription>
            Help FreightFlow understand your specific shipping needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Shipping Requirements
            </label>
            <div className="grid md:grid-cols-2 gap-2">
              {[
                'Oversized loads (>12 feet)',
                'Temperature-controlled transport',
                'White glove delivery',
                'Residential delivery',
                'Jobsite delivery',
                'Appointment scheduling required',
                'Lift gate service',
                'Inside delivery'
              ].map(requirement => (
                <div
                  key={requirement}
                  className={`p-2 border rounded cursor-pointer text-sm transition-colors ${
                    specialRequirements.includes(requirement)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => toggleSpecialRequirement(requirement)}
                >
                  {requirement}
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="seasonal"
                checked={seasonalProducts}
                onChange={(e) => setSeasonalProducts(e.target.checked)}
              />
              <label htmlFor="seasonal" className="text-sm text-gray-700">
                We have seasonal product variations
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="custom"
                checked={customOrders}
                onChange={(e) => setCustomOrders(e.target.checked)}
              />
              <label htmlFor="custom" className="text-sm text-gray-700">
                We handle custom/made-to-order products
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Average Order Value
            </label>
            <Input
              placeholder="$15,000"
              value={averageOrderValue}
              onChange={(e) => setAverageOrderValue(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information about your products or shipping requirements..."
              className="flex min-h-20 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Back to Mill Profile
        </Button>
        <Button type="submit" size="lg">
          Continue to Pain Points
        </Button>
      </div>
    </form>
  )
}