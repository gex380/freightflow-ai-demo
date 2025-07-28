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
  status: 'booked' | 'in_transit' | 'delivered' | 'delayed' | 'cancelled'
  timeline: Array<{
    timestamp: string
    status: string
    location: string
    description: string
    isWilsonAction: boolean
  }>
  wilsonActions: Array<{
    timestamp: string
    action: string
    reasoning: string
    result: string
    timeSaved: number
    costImpact: number
  }>
  estimatedDelivery: string
  createdAt: string
  updatedAt: string
}

// Mock live shipments data
const LIVE_SHIPMENTS: LiveShipment[] = [
  {
    id: 'FFA-2024-001847',
    millName: 'Pacific Northwest Lumber Co.',
    customer: 'Chicago Building Supply',
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
      distance: 2150
    },
    carrier: {
      name: 'BNSF Railway',
      serviceType: 'Rail Intermodal',
      trackingNumber: 'BNS847291847'
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
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        status: 'in_transit',
        location: 'Portland, OR',
        description: 'Shipment loaded and departed from Portland rail yard',
        isWilsonAction: true
      },
      {
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'booked',
        location: 'Portland, OR',
        description: 'FreightFlow AI automatically booked optimal rail route',
        isWilsonAction: true
      }
    ],
    wilsonActions: [
      {
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        action: 'Proactive Tracking Setup',
        reasoning: 'Established automated tracking updates and customer notifications',
        result: 'Enhanced visibility and communication',
        timeSaved: 25,
        costImpact: 0
      }
    ],
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  },
  {
    id: 'FFA-2024-001823',
    millName: 'Heritage Pine Mills',
    customer: 'Atlanta Architectural Supply',
    product: {
      type: 'Specialty Millwork',
      grade: 'Architectural',
      species: 'Southern Pine',
      quantity: 13000,
      unit: 'LF'
    },
    route: {
      origin: 'Valdosta, GA',
      destination: 'Atlanta, GA',
      distance: 245
    },
    carrier: {
      name: 'FedEx Freight',
      serviceType: 'LTL White Glove',
      trackingNumber: 'FFX6789012345'
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
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'delivered',
        location: 'Atlanta, GA',
        description: 'Delivery completed with white glove service',
        isWilsonAction: false
      },
      {
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'in_transit',
        location: 'Valdosta, GA',
        description: 'Picked up from mill with special handling',
        isWilsonAction: true
      }
    ],
    wilsonActions: [
      {
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        action: 'Insurance Optimization',
        reasoning: 'High-value cargo detected. Automatically added appropriate coverage.',
        result: 'Enhanced protection with minimal cost impact',
        timeSaved: 15,
        costImpact: -25
      }
    ],
    estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'FFA-2024-001901',
    millName: 'Mountain View Integrated',
    customer: 'Denver Construction Materials',
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
      distance: 895
    },
    carrier: {
      name: 'Regional Hauler',
      serviceType: 'Full Truckload',
      trackingNumber: 'REG4567890123'
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
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        status: 'booked',
        location: 'Missoula, MT',
        description: 'FreightFlow AI booked direct route with weekend optimization',
        isWilsonAction: true
      }
    ],
    wilsonActions: [
      {
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        action: 'Route Optimization',
        reasoning: 'Direct route via I-90 avoids weekend restrictions and saves 2 hours.',
        result: 'Faster delivery with cost savings',
        timeSaved: 35,
        costImpact: -325
      }
    ],
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  }
]

export class ShipmentCoordinationService {
  // Get current active shipments - THIS WAS MISSING
  static getCurrentShipments(): LiveShipment[] {
    return LIVE_SHIPMENTS
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
      { type: 'Engineered Beams', grade: 'Structural', species: 'Glulam', quantity: 200, unit: 'Pieces' },
      { type: 'Fence Pickets', grade: 'Standard', species: 'Western Red Cedar', quantity: 8000, unit: 'LF' },
      { type: 'Trim Boards', grade: 'Premium', species: 'Hemlock', quantity: 3500, unit: 'LF' }
    ]

    const routes = [
      { origin: 'Portland, OR', destination: 'Phoenix, AZ', distance: 1425 },
      { origin: 'Seattle, WA', destination: 'Denver, CO', distance: 1325 },
      { origin: 'Portland, OR', destination: 'Los Angeles, CA', distance: 1150 },
      { origin: 'Eugene, OR', destination: 'Salt Lake City, UT', distance: 895 },
      { origin: 'Spokane, WA', destination: 'Minneapolis, MN', distance: 1245 },
      { origin: 'Boise, ID', destination: 'Las Vegas, NV', distance: 785 },
      { origin: 'Missoula, MT', destination: 'Kansas City, MO', distance: 1185 },
      { origin: 'Bend, OR', destination: 'Sacramento, CA', distance: 485 }
    ]

    const carriers = [
      { name: 'XPO Logistics', serviceType: 'LTL Standard' },
      { name: 'FedEx Freight', serviceType: 'LTL Priority' },
      { name: 'Old Dominion', serviceType: 'LTL Standard' },
      { name: 'BNSF Railway', serviceType: 'Rail Intermodal' },
      { name: 'Regional Hauler', serviceType: 'Full Truckload' },
      { name: 'UPS Freight', serviceType: 'LTL Express' },
      { name: 'Schneider', serviceType: 'Dedicated' },
      { name: 'J.B. Hunt', serviceType: 'Intermodal' }
    ]

    const customers = [
      'Phoenix Building Supply', 'Denver Construction Co.', 'LA Lumber Yard',
      'Mountain West Distributors', 'Prairie Construction Materials',
      'Desert Southwest Lumber', 'Rocky Mountain Supply', 'Pacific Coast Materials',
      'Great Plains Building Supply', 'Southwest Lumber Exchange',
      'Mile High Construction', 'Golden State Lumber Co.'
    ]

    const aiActionTypes = [
      {
        action: 'Intelligent Booking & Optimization',
        reasoningTemplate: 'Analyzed {carrierCount} carrier options and current market rates. {carrier} selected for optimal cost-service balance on {origin} to {destination} route.',
        result: 'Shipment booked automatically with optimized routing'
      },
      {
        action: 'Dynamic Route Planning',
        reasoningTemplate: 'Real-time traffic and weather analysis identified fastest route. Avoided construction zones on primary highways, saving estimated delivery time.',
        result: 'Reduced transit time and fuel costs'
      },
      {
        action: 'Market Rate Analysis', 
        reasoningTemplate: 'Current market rates analyzed across {carrierCount} carriers. {carrier} offering competitive rate due to return load optimization.',
        result: 'Secured below-market pricing'
      },
      {
        action: 'Load Consolidation Opportunity',
        reasoningTemplate: 'Identified opportunity to consolidate with compatible shipment. Shared transportation costs while maintaining delivery schedules.',
        result: 'Achieved additional cost savings through consolidation'
      }
    ]

    // Random selections
    const randomProduct = products[Math.floor(Math.random() * products.length)]
    const randomRoute = routes[Math.floor(Math.random() * routes.length)]
    const randomCarrier = carriers[Math.floor(Math.random() * carriers.length)]
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)]
    const randomActionType = aiActionTypes[Math.floor(Math.random() * aiActionTypes.length)]

    // Random pricing
    const originalQuote = 800 + Math.floor(Math.random() * 2000) // $800-$2800
    const savingsPercent = 12 + Math.floor(Math.random() * 15) // 12-27% savings
    const savings = Math.floor(originalQuote * (savingsPercent / 100))
    const wilsonRate = originalQuote - savings

    // Generate reasoning with template
    const reasoning = randomActionType.reasoningTemplate
      .replace('{carrierCount}', carriers.length.toString())
      .replace('{carrier}', randomCarrier.name)
      .replace('{origin}', randomRoute.origin)
      .replace('{destination}', randomRoute.destination)

    const newShipment: LiveShipment = {
      id: `FFA-2024-${String(Date.now()).slice(-6)}`,
      millName,
      customer: randomCustomer,
      product: randomProduct,
      route: randomRoute,
      carrier: {
        name: randomCarrier.name,
        serviceType: randomCarrier.serviceType,
        trackingNumber: `${randomCarrier.name.replace(/\s+/g, '').slice(0,3).toUpperCase()}${Math.random().toString().slice(2, 11)}`
      },
      pricing: {
        originalQuote,
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
          description: 'FreightFlow AI automatically booked shipment with optimized routing',
          isWilsonAction: true
        }
      ],
      wilsonActions: [
        {
          timestamp: new Date().toISOString(),
          action: randomActionType.action,
          reasoning: reasoning,
          result: randomActionType.result,
          timeSaved: 30 + Math.floor(Math.random() * 20), // 30-50 minutes
          costImpact: -savings
        }
      ],
      estimatedDelivery: new Date(Date.now() + (2 + Math.floor(Math.random() * 4)) * 24 * 60 * 60 * 1000).toISOString(), // 2-6 days
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    LIVE_SHIPMENTS.unshift(newShipment)
    return newShipment
  }

  static getStatusColor(status: string): string {
    switch (status) {
      case 'booked':
        return 'bg-blue-100 text-blue-800'
      case 'in_transit':
        return 'bg-yellow-100 text-yellow-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'delayed':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  static getTimeAgo(timestamp: string): string {
    const now = new Date()
    const past = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  static formatQuantity(quantity: number, unit: string): string {
    return `${quantity.toLocaleString()} ${unit}`
  }
}