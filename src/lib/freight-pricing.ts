// Freight Pricing Service for FreightFlow AI
// Simulates real freight market data with realistic pricing

export interface FreightRate {
  carrier: string
  serviceType: string
  rate: number // dollars per hundredweight (cwt)
  transitTime: string
  reliability: number // 1-10 scale
  fuelSurcharge: number
  accessorialFees: number
  totalRate: number
}

export interface MarketTrend {
  direction: 'up' | 'down' | 'stable'
  percentage: number
  reason: string
}

export interface FreightQuote {
  origin: string
  destination: string
  weight: number
  rates: FreightRate[]
  marketTrends: MarketTrend[]
  wilsonRecommendation: {
    recommendedCarrier: string
    reasoning: string
    savings: number
    savingsPercentage: number
  }
}

export class FreightPricingService {
  // THIS WAS THE MISSING METHOD
  static async getCurrentRates(origin: string, destination: string, weight: number): Promise<FreightRate[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate realistic freight rates based on route and weight
    const baseRate = this.calculateBaseRate(origin, destination, weight)
    
    return [
      {
        carrier: 'BNSF Railway',
        serviceType: 'Rail Intermodal',
        rate: baseRate * 0.65, // Rail typically 35% cheaper
        transitTime: '5-7 days',
        reliability: 8,
        fuelSurcharge: 0.15,
        accessorialFees: 45,
        totalRate: (baseRate * 0.65) + 45
      },
      {
        carrier: 'FedEx Freight',
        serviceType: 'LTL Priority',
        rate: baseRate * 1.1, // Premium service
        transitTime: '2-3 days',
        reliability: 9,
        fuelSurcharge: 0.18,
        accessorialFees: 75,
        totalRate: (baseRate * 1.1) + 75
      },
      {
        carrier: 'Old Dominion',
        serviceType: 'LTL Standard',
        rate: baseRate,
        transitTime: '3-4 days',
        reliability: 8,
        fuelSurcharge: 0.16,
        accessorialFees: 55,
        totalRate: baseRate + 55
      },
      {
        carrier: 'XPO Logistics',
        serviceType: 'LTL Standard',
        rate: baseRate * 0.95,
        transitTime: '3-5 days',
        reliability: 7,
        fuelSurcharge: 0.17,
        accessorialFees: 65,
        totalRate: (baseRate * 0.95) + 65
      },
      {
        carrier: 'Regional Hauler',
        serviceType: 'Full Truckload',
        rate: baseRate * 0.8, // FTL can be more efficient for large loads
        transitTime: '2-4 days',
        reliability: 7,
        fuelSurcharge: 0.20,
        accessorialFees: 125,
        totalRate: (baseRate * 0.8) + 125
      }
    ]
  }

  static async getMarketQuote(origin: string, destination: string, weight: number, productType: string = 'lumber'): Promise<FreightQuote> {
    const rates = await this.getCurrentRates(origin, destination, weight)
    
    // Calculate market trends
    const trends: MarketTrend[] = [
      {
        direction: 'up',
        percentage: 8,
        reason: 'Seasonal demand increase for construction materials'
      },
      {
        direction: 'down',
        percentage: 3,
        reason: 'Fuel costs stabilizing after recent volatility'
      }
    ]

    // Wilson's recommendation logic
    const bestRate = rates.reduce((prev, current) => 
      (prev.totalRate < current.totalRate) ? prev : current
    )
    
    const standardRate = rates.find(r => r.serviceType === 'LTL Standard')
    const savings = standardRate ? standardRate.totalRate - bestRate.totalRate : 0
    const savingsPercentage = standardRate ? Math.round((savings / standardRate.totalRate) * 100) : 0

    return {
      origin,
      destination,
      weight,
      rates: rates.sort((a, b) => a.totalRate - b.totalRate), // Sort by best price
      marketTrends: trends,
      wilsonRecommendation: {
        recommendedCarrier: bestRate.carrier,
        reasoning: `Based on current market conditions and ${productType} shipping requirements, ${bestRate.carrier} offers the best value with reliable service and competitive pricing.`,
        savings,
        savingsPercentage
      }
    }
  }

  static getLTLRates(origin: string, destination: string, weight: number): Promise<FreightRate[]> {
    return this.getCurrentRates(origin, destination, weight).then(rates => 
      rates.filter(rate => rate.serviceType.includes('LTL'))
    )
  }

  static getRailRates(origin: string, destination: string, weight: number): Promise<FreightRate[]> {
    return this.getCurrentRates(origin, destination, weight).then(rates => 
      rates.filter(rate => rate.serviceType.includes('Rail'))
    )
  }

  static getTruckloadRates(origin: string, destination: string, weight: number): Promise<FreightRate[]> {
    return this.getCurrentRates(origin, destination, weight).then(rates => 
      rates.filter(rate => rate.serviceType.includes('Truckload'))
    )
  }

  // Helper method to calculate base rate
  private static calculateBaseRate(origin: string, destination: string, weight: number): number {
    // Simple distance-based calculation (this would be more sophisticated in reality)
    const distanceMap: { [key: string]: number } = {
      'Portland, OR-Chicago, IL': 2150,
      'Seattle, WA-Denver, CO': 1325,
      'Portland, OR-Los Angeles, CA': 1150,
      'Eugene, OR-Salt Lake City, UT': 895,
      'Spokane, WA-Minneapolis, MN': 1245
    }

    const routeKey = `${origin}-${destination}`
    const distance = distanceMap[routeKey] || 1500 // Default distance

    // Base rate calculation: $1.50-$3.50 per mile + weight factor
    const baseMileRate = 1.50 + (Math.random() * 2.0) // $1.50-$3.50 per mile
    const weightFactor = weight > 40000 ? 0.8 : 1.0 // Discount for heavy loads
    
    return Math.round((distance * baseMileRate * weightFactor) / 100) // Convert to per cwt
  }

  // Market intelligence methods
  static getMarketTrends(): MarketTrend[] {
    return [
      {
        direction: 'up',
        percentage: 12,
        reason: 'Peak construction season driving demand'
      },
      {
        direction: 'stable',
        percentage: 0,
        reason: 'Rail capacity utilization at optimal levels'
      },
      {
        direction: 'down',
        percentage: 5,
        reason: 'Decreased fuel costs benefiting transportation'
      }
    ]
  }

  static getFuelSurchargeRate(): number {
    // Simulate current fuel surcharge (typically 15-25%)
    return 0.15 + (Math.random() * 0.10) // 15-25%
  }

  static getCapacityUtilization(carrier: string): number {
    // Simulate capacity utilization (affects pricing)
    const utilizationMap: { [key: string]: number } = {
      'BNSF Railway': 0.78,
      'FedEx Freight': 0.85,
      'Old Dominion': 0.82,
      'XPO Logistics': 0.79,
      'Regional Hauler': 0.73
    }
    
    return utilizationMap[carrier] || 0.80
  }

  // Wilson AI optimization methods
  static optimizeCarrierSelection(rates: FreightRate[], requirements: {
    priority: 'cost' | 'speed' | 'reliability'
    maxTransitTime?: number
    minReliability?: number
  }): FreightRate {
    let filteredRates = rates

    // Apply filters based on requirements
    if (requirements.maxTransitTime) {
      filteredRates = rates.filter(rate => {
        const days = parseInt(rate.transitTime.split('-')[1])
        return days <= requirements.maxTransitTime!
      })
    }

    if (requirements.minReliability) {
      filteredRates = filteredRates.filter(rate => rate.reliability >= requirements.minReliability!)
    }

    // Sort based on priority
    switch (requirements.priority) {
      case 'cost':
        return filteredRates.sort((a, b) => a.totalRate - b.totalRate)[0]
      case 'speed':
        return filteredRates.sort((a, b) => {
          const aDays = parseInt(a.transitTime.split('-')[0])
          const bDays = parseInt(b.transitTime.split('-')[0])
          return aDays - bDays
        })[0]
      case 'reliability':
        return filteredRates.sort((a, b) => b.reliability - a.reliability)[0]
      default:
        return filteredRates[0]
    }
  }
}