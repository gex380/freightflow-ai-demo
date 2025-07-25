// Live Shipment Coordination System for FreightFlow AI
// Shows Wilson actually coordinating freight in real-time

export interface LiveShipment {
  id: string
  millName: string
  customer: string
  product: {
    type: string
    grade: string
    species: string
    quantity: number
    unit: string
  }
  route: {
    origin: string
    destination: string
    distance: number
  }
  carrier: {
    name: string
    serviceType: string
    trackingNumber: string
  }
  pricing: {
    originalQuote: number
    wilsonRate: number
    savings: number
    savingsPercentage: number
  }
  status: 'pending' | 'booked' | 'picked_up' | 'in_transit' | 'delivered'
  timeline: ShipmentEvent[]
  wilsonActions: WilsonAction[]
  estimatedDelivery: string
  actualDelivery?: string
  createdAt: string
  updatedAt: string
}

export interface ShipmentEvent {
  timestamp: string
  status: string
  location: string
  description: string
  isWilsonAction: boolean
}

export interface WilsonAction {
  timestamp: string
  action: string
  reasoning: string
  result: string
  timeSaved: number // minutes
  costImpact: number // dollars
}

export interface CoordinationMetrics {
  totalShipments: number
  activeShipments: number
  totalSavings: number
  averageSavings: number
  timeAutomated: number // hours saved
  successRate: number
  onTimeDelivery: number
}

// Simulated live shipments database
const LIVE_SHIPMENTS: LiveShipment[] = [
  {
    id: 'FFA-2024-001847',
    millName: 'Pacific Northwest Lumber Co.',
    customer: 'Chicago Premium Hardwoods',
    product: {
      type: 'Dimensional Lumber',
      grade: 'Cabinet Grade',
      species: 'Douglas Fir',
      quantity: 50000,
      unit: 'BF'
    },
    route: {
      origin: 'Portland, OR',
      destination: 'Chicago, IL',
      distance: 2135
    },
    carrier: {
      name: 'BNSF Railway',
      serviceType: 'Rail Intermodal',
      trackingNumber: 'BNSF789456123'
    },
    pricing: {
      originalQuote: 1875,
      wilsonRate: 1535,
      savings: 340,
      savingsPercentage: 18
    },
    status: 'in_transit',
    timeline: [
      {
        timestamp: '2024-01-15T08:30:00Z',
        status: 'booked',
        location: 'Portland, OR',
        description: 'Shipment booked by FreightFlow AI',
        isWilsonAction: true
      },
      {
        timestamp: '2024-01-15T14:20:00Z',
        status: 'picked_up',
        location: 'Portland, OR',
        description: 'Lumber loaded at Pacific Northwest facility',
        isWilsonAction: false
      },
      {
        timestamp: '2024-01-16T09:15:00Z',
        status: 'in_transit',
        location: 'Spokane, WA',
        description: 'Rail intermodal terminal - on schedule',
        isWilsonAction: false
      }
    ],
    wilsonActions: [
      {
        timestamp: '2024-01-15T08:15:00Z',
        action: 'Carrier Selection Optimization',
        reasoning: 'Analyzed 8 carrier options. BNSF Railway selected for 18% cost savings vs LTL',
        result: 'Booked BNSF intermodal service',
        timeSaved: 45,
        costImpact: -340
      },
      {
        timestamp: '2024-01-15T08:18:00Z',
        action: 'Automated Documentation',
        reasoning: 'Generated BOL, insurance docs, and tracking setup automatically',
        result: 'All shipping documents completed',
        timeSaved: 25,
        costImpact: 0
      },
      {
        timestamp: '2024-01-15T14:25:00Z',
        action: 'Proactive Tracking Setup',
        reasoning: 'Established automated tracking updates and customer notifications',
        result: 'Real-time visibility enabled',
        timeSaved: 15,
        costImpact: 0
      }
    ],
    estimatedDelivery: '2024-01-18T16:00:00Z',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-16T09:15:00Z'
  },
  {
    id: 'FFA-2024-001823',
    millName: 'Heritage Pine Mills',
    customer: 'Atlanta Building Supply',
    product: {
      type: 'Specialty Millwork',
      grade: 'Architectural',
      species: 'Southern Pine',
      quantity: 12500,
      unit: 'LF'
    },
    route: {
      origin: 'Valdosta, GA',
      destination: 'Atlanta, GA',
      distance: 235
    },
    carrier: {
      name: 'FedEx Freight',
      serviceType: 'LTL White Glove',
      trackingNumber: 'FX123789456'
    },
    pricing: {
      originalQuote: 890,
      wilsonRate: 725,
      savings: 165,
      savingsPercentage: 19
    },
    status: 'delivered',
    timeline: [
      {
        timestamp: '2024-01-14T10:15:00Z',
        status: 'booked',
        location: 'Valdosta, GA',
        description: 'Priority shipment booked by FreightFlow AI',
        isWilsonAction: true
      },
      {
        timestamp: '2024-01-14T15:30:00Z',
        status: 'picked_up',
        location: 'Valdosta, GA',
        description: 'Specialty millwork carefully loaded with white glove service',
        isWilsonAction: false
      },
      {
        timestamp: '2024-01-15T11:45:00Z',
        status: 'delivered',
        location: 'Atlanta, GA',
        description: 'Delivered on-time with zero damage',
        isWilsonAction: false
      }
    ],
    wilsonActions: [
      {
        timestamp: '2024-01-14T10:05:00Z',
        action: 'Premium Service Selection',
        reasoning: 'Architectural millwork requires white glove handling. Selected FedEx premium service.',
        result: 'White glove service secured',
        timeSaved: 35,
        costImpact: -165
      },
      {
        timestamp: '2024-01-14T10:12:00Z',
        action: 'Insurance Optimization',
        reasoning: 'High-value cargo detected. Automatically added appropriate coverage.',
        result: 'Full value protection applied',
        timeSaved: 20,
        costImpact: -25
      }
    ],
    estimatedDelivery: '2024-01-15T12:00:00Z',
    actualDelivery: '2024-01-15T11:45:00Z',
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-15T11:45:00Z'
  },
  {
    id: 'FFA-2024-001901',
    millName: 'Mountain View Integrated',
    customer: 'Denver Construction Co.',
    product: {
      type: 'Framing Lumber',
      grade: 'Construction',
      species: 'Ponderosa Pine',
      quantity: 75000,
      unit: 'BF'
    },
    route: {
      origin: 'Missoula, MT',
      destination: 'Denver, CO',
      distance: 785
    },
    carrier: {
      name: 'Regional Hauler',
      serviceType: 'Full Truckload',
      trackingNumber: 'RH445789123'
    },
    pricing: {
      originalQuote: 2150,
      wilsonRate: 1825,
      savings: 325,
      savingsPercentage: 15
    },
    status: 'booked',
    timeline: [
      {
        timestamp: '2024-01-16T11:20:00Z',
        status: 'booked',
        location: 'Missoula, MT',
        description: 'Large volume shipment optimized by FreightFlow AI',
        isWilsonAction: true
      }
    ],
    wilsonActions: [
      {
        timestamp: '2024-01-16T11:05:00Z',
        action: 'Volume Optimization',
        reasoning: '75K BF qualifies for full truckload. Negotiated regional carrier rate.',
        result: 'Truckload service at LTL+15% pricing',
        timeSaved: 40,
        costImpact: -325
      },
      {
        timestamp: '2024-01-16T11:15:00Z',
        action: 'Route Optimization',
        reasoning: 'Direct route via I-90 avoids weekend restrictions and saves 2 hours.',
        result: 'Optimal routing confirmed',
        timeSaved: 30,
        costImpact: -50
      }
    ],
    estimatedDelivery: '2024-01-18T10:00:00Z',
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-16T11:20:00Z'
  }
]

export class ShipmentCoordinationService {
  
  static async getLiveShipments(): Promise<LiveShipment[]> {
    // Simulate real-time updates
    const shipments = [...LIVE_SHIPMENTS]
    
    // Update in-transit shipments with new locations
    shipments.forEach(shipment => {
      if (shipment.status === 'in_transit') {
        this.simulateProgress(shipment)
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return shipments
  }

  static async getActiveShipment(id: string): Promise<LiveShipment | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return LIVE_SHIPMENTS.find(s => s.id === id) || null
  }

  static async getCoordinationMetrics(): Promise<CoordinationMetrics> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const totalShipments = LIVE_SHIPMENTS.length + 45 // Historical + current
    const activeShipments = LIVE_SHIPMENTS.filter(s => s.status !== 'delivered').length
    const totalSavings = LIVE_SHIPMENTS.reduce((sum, s) => sum + s.pricing.savings, 0) + 18750 // Historical
    const averageSavings = Math.round((totalSavings / totalShipments) * 100) / 100
    const timeAutomated = LIVE_SHIPMENTS.reduce((sum, s) => 
      sum + s.wilsonActions.reduce((actionSum, a) => actionSum + a.timeSaved, 0), 0
    ) / 60 + 127 // Convert to hours + historical
    
    return {
      totalShipments,
      activeShipments,
      totalSavings: Math.round(totalSavings),
      averageSavings,
      timeAutomated: Math.round(timeAutomated * 10) / 10,
      successRate: 97.8,
      onTimeDelivery: 94.5
    }
  }

  private static simulateProgress(shipment: LiveShipment): void {
    // Add realistic location updates for in-transit shipments
    const now = new Date()
    const lastUpdate = new Date(shipment.updatedAt)
    const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60)
    
    if (hoursSinceUpdate > 4 && shipment.timeline.length < 5) {
      const newLocations = [
        'Billings, MT - Rail yard processing',
        'Cheyenne, WY - In transit, on schedule',
        'North Platte, NE - Rail classification yard',
        'Approaching final destination'
      ]
      
      const nextLocation = newLocations[shipment.timeline.length - 3]
      if (nextLocation) {
        shipment.timeline.push({
          timestamp: new Date(now.getTime() - (2 * 60 * 60 * 1000)).toISOString(),
          status: 'in_transit',
          location: nextLocation.split(' - ')[0],
          description: nextLocation,
          isWilsonAction: false
        })
        shipment.updatedAt = now.toISOString()
      }
    }
  }

  static async simulateNewShipment(millName: string): Promise<LiveShipment> {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Random shipment data arrays
    const products = [
      { type: 'Dimensional Lumber', grade: 'Select', species: 'Douglas Fir', quantity: 25000, unit: 'BF' },
      { type: 'Specialty Millwork', grade: 'Premium', species: 'Cedar', quantity: 15000, unit: 'LF' },
      { type: 'Framing Lumber', grade: 'Construction', species: 'Pine', quantity: 40000, unit: 'BF' },
      { type: 'Decking Materials', grade: 'Premium', species: 'Redwood', quantity: 12000, unit: 'SF' },
      { type: 'Plywood Sheets', grade: 'Cabinet', species: 'Birch', quantity: 500, unit: 'Sheets' },
      { type: 'Engineered Beams', grade: 'Structural', species: 'Glulam', quantity: 200, unit: 'Units' },
      { type: 'Tongue & Groove', grade: 'Flooring', species: 'Oak', quantity: 8000, unit: 'SF' },
      { type: 'Fence Pickets', grade: 'Utility', species: 'Pressure Treated', quantity: 2000, unit: 'Units' }
    ]
    
    const routes = [
      { origin: 'Portland, OR', destination: 'Phoenix, AZ', distance: 1425 },
      { origin: 'Seattle, WA', destination: 'Denver, CO', distance: 1325 },
      { origin: 'Portland, OR', destination: 'Los Angeles, CA', distance: 1150 },
      { origin: 'Eugene, OR', destination: 'Salt Lake City, UT', distance: 895 },
      { origin: 'Spokane, WA', destination: 'Minneapolis, MN', distance: 1245 },
      { origin: 'Tacoma, WA', destination: 'Dallas, TX', distance: 2085 },
      { origin: 'Bend, OR', destination: 'Kansas City, MO', distance: 1685 },
      { origin: 'Portland, OR', destination: 'Atlanta, GA', distance: 2595 }
    ]
    
    const carriers = [
      { name: 'XPO Logistics', serviceType: 'LTL Standard' },
      { name: 'FedEx Freight', serviceType: 'LTL Priority' },
      { name: 'Old Dominion', serviceType: 'LTL Standard' },
      { name: 'BNSF Railway', serviceType: 'Rail Intermodal' },
      { name: 'Union Pacific', serviceType: 'Rail Intermodal' },
      { name: 'Regional Hauler', serviceType: 'Full Truckload' },
      { name: 'UPS Freight', serviceType: 'LTL Standard' },
      { name: 'Knight Transportation', serviceType: 'Dedicated' }
    ]
    
    const customers = [
      'Phoenix Building Supply', 'Denver Construction Co.', 'LA Lumber Yard', 
      'Mountain West Distributors', 'Prairie Construction Materials', 'Southwest Builders',
      'Rocky Mountain Supply', 'Desert Valley Lumber', 'High Plains Building Materials',
      'Cascade Construction Supply', 'Pacific Coast Distributors', 'Inland Empire Lumber'
    ]

    const actionTypes = [
      {
        action: 'Intelligent Booking & Optimization',
        reasoningTemplate: 'Analyzed {carrierCount} carrier options and current market rates. {carrier} selected for optimal cost-service balance on {route} route.',
        result: 'Shipment booked automatically with optimized routing'
      },
      {
        action: 'Market Rate Arbitrage',
        reasoningTemplate: 'Detected {savingsPercent}% rate differential in current market. Secured {carrier} capacity before rate increase.',
        result: 'Locked in favorable rates ahead of market uptick'
      },
      {
        action: 'Volume Consolidation Optimization',
        reasoningTemplate: 'Optimized shipment timing to consolidate with other {mill} loads, reducing per-unit costs.',
        result: 'Achieved economies of scale through intelligent batching'
      },
      {
        action: 'Seasonal Route Planning',
        reasoningTemplate: 'Applied seasonal demand modeling for {route}. Selected {carrier} based on Q{quarter} performance data.',
        result: 'Optimized for seasonal freight patterns'
      }
    ]
    
    // Random selections
    const randomProduct = products[Math.floor(Math.random() * products.length)]
    const randomRoute = routes[Math.floor(Math.random() * routes.length)]
    const randomCarrier = carriers[Math.floor(Math.random() * carriers.length)]
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)]
    const randomAction = actionTypes[Math.floor(Math.random() * actionTypes.length)]
    
    // Random pricing with realistic ranges
    const baseRate = 800 + Math.floor(Math.random() * 2000) // $800-$2800 base
    const savingsPercent = 12 + Math.floor(Math.random() * 15) // 12-27% savings
    const savings = Math.floor(baseRate * (savingsPercent / 100))
    const wilsonRate = baseRate - savings
    
    // Generate tracking number
    const carrierCode = randomCarrier.name.replace(/\s+/g, '').slice(0,3).toUpperCase()
    const trackingNumber = `${carrierCode}${Math.random().toString().slice(2, 11)}`
    
    // Create dynamic reasoning text
    const reasoning = randomAction.reasoningTemplate
      .replace('{carrierCount}', String(5 + Math.floor(Math.random() * 4)))
      .replace('{carrier}', randomCarrier.name)
      .replace('{route}', `${randomRoute.origin} to ${randomRoute.destination}`)
      .replace('{savingsPercent}', String(savingsPercent))
      .replace('{mill}', millName)
      .replace('{quarter}', `${Math.floor(new Date().getMonth() / 3) + 1}`)
    
    const newShipment: LiveShipment = {
      id: `FFA-2024-${String(Date.now()).slice(-6)}`,
      millName,
      customer: randomCustomer,
      product: randomProduct,
      route: randomRoute,
      carrier: {
        name: randomCarrier.name,
        serviceType: randomCarrier.serviceType,
        trackingNumber
      },
      pricing: {
        originalQuote: baseRate,
        wilsonRate,
        savings,
        savingsPercentage: savingsPercent
      },
      status: 'booked',
      timeline: [
        {
          timestamp: new Date().toISOString(),
          status: 'booked',
          location: randomRoute.origin,
          description: `FreightFlow AI automatically booked shipment with ${randomCarrier.name}`,
          isWilsonAction: true
        }
      ],
      wilsonActions: [
        {
          timestamp: new Date().toISOString(),
          action: randomAction.action,
          reasoning,
          result: randomAction.result,
          timeSaved: 25 + Math.floor(Math.random() * 30), // 25-55 minutes
          costImpact: -savings
        }
      ],
      estimatedDelivery: new Date(Date.now() + (2 + Math.floor(Math.random() * 5)) * 24 * 60 * 60 * 1000).toISOString(), // 2-7 days
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    LIVE_SHIPMENTS.unshift(newShipment)
    return newShipment
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  static formatQuantity(quantity: number, unit: string): string {
    if (quantity >= 1000) {
      return `${(quantity / 1000).toFixed(0)}K ${unit}`
    }
    return `${quantity.toLocaleString()} ${unit}`
  }

  static getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'booked': return 'bg-blue-100 text-blue-700'
      case 'picked_up': return 'bg-purple-100 text-purple-700'
      case 'in_transit': return 'bg-orange-100 text-orange-700'
      case 'delivered': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  static getTimeAgo(timestamp: string): string {
    const now = new Date()
    const time = new Date(timestamp)
    const diffMs = now.getTime() - time.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    } else {
      const diffMins = Math.floor(diffMs / (1000 * 60))
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    }
  }
}