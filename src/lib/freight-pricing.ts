// Freight Pricing Service for FreightFlow AI
// Simulates real freight market data with realistic pricing

export interface FreightRate {
  carrier: string
  serviceType: string
  rate: number // dollars per hundredweight (cwt)
  transitTime: string
  reliability: number // percentage
  fuelSurcharge: number
  totalCost: number
  savings?: number
  marketTrend: 'up' | 'down' | 'stable'
  trendPercentage: number
}

export interface RouteInfo {
  origin: string
  destination: string
  distance: number
  weight: number // pounds
  commodity: string
}

export interface MarketIntelligence {
  averageRate: number
  marketCondition: 'tight' | 'balanced' | 'loose'
  seasonalFactor: number
  fuelIndex: number
  demandLevel: 'high' | 'medium' | 'low'
  recommendation: string
}

// Simulated freight rates database
const FREIGHT_RATES_DB = {
  'Portland,OR-Chicago,IL': {
    ltl: { base: 2.89, fuel: 0.23, trend: 'up', trendPercent: 8 },
    rail: { base: 1.95, fuel: 0.15, trend: 'stable', trendPercent: 2 },
    truckload: { base: 2.45, fuel: 0.31, trend: 'up', trendPercent: 12 }
  },
  'Portland,OR-Atlanta,GA': {
    ltl: { base: 3.45, fuel: 0.28, trend: 'up', trendPercent: 6 },
    rail: { base: 2.15, fuel: 0.18, trend: 'down', trendPercent: -3 },
    truckload: { base: 2.89, fuel: 0.35, trend: 'up', trendPercent: 15 }
  },
  'Seattle,WA-Denver,CO': {
    ltl: { base: 2.67, fuel: 0.21, trend: 'stable', trendPercent: 1 },
    rail: { base: 1.78, fuel: 0.14, trend: 'down', trendPercent: -5 },
    truckload: { base: 2.23, fuel: 0.29, trend: 'up', trendPercent: 9 }
  }
}

// Carrier reliability and service data
const CARRIER_DATA = {
  'FedEx Freight': { reliability: 96, onTimeDelivery: 94, damage: 0.2 },
  'UPS Freight': { reliability: 95, onTimeDelivery: 93, damage: 0.3 },
  'Old Dominion': { reliability: 97, onTimeDelivery: 96, damage: 0.1 },
  'XPO Logistics': { reliability: 92, onTimeDelivery: 90, damage: 0.4 },
  'BNSF Railway': { reliability: 89, onTimeDelivery: 87, damage: 0.1 },
  'Union Pacific': { reliability: 88, onTimeDelivery: 85, damage: 0.2 }
}

export class FreightPricingService {
  
  static async getLiveRates(route: RouteInfo): Promise<FreightRate[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const routeKey = `${route.origin}-${route.destination}`
    const rates = FREIGHT_RATES_DB[routeKey as keyof typeof FREIGHT_RATES_DB] || 
                  FREIGHT_RATES_DB['Portland,OR-Chicago,IL'] // fallback
    
    const weight = route.weight / 100 // convert to hundredweight
    
    return [
      this.generateLTLRate(rates, weight, route),
      this.generateRailRate(rates, weight, route),
      this.generateTruckloadRate(rates, weight, route)
    ].filter(rate => rate.totalCost > 0)
  }

  private static generateLTLRate(rates: any, weight: number, route: RouteInfo): FreightRate {
    const ltl = rates.ltl
    const baseRate = ltl.base + (Math.random() * 0.4 - 0.2) // ±$0.20 variation
    const fuelSurcharge = ltl.fuel
    const totalRate = baseRate + fuelSurcharge
    
    return {
      carrier: 'FedEx Freight',
      serviceType: 'LTL Standard',
      rate: Math.round(baseRate * 100) / 100,
      transitTime: this.calculateTransitTime(route.distance, 'ltl'),
      reliability: CARRIER_DATA['FedEx Freight'].reliability,
      fuelSurcharge: Math.round(fuelSurcharge * 100) / 100,
      totalCost: Math.round(totalRate * weight * 100) / 100,
      marketTrend: ltl.trend as 'up' | 'down' | 'stable',
      trendPercentage: ltl.trendPercent
    }
  }

  private static generateRailRate(rates: any, weight: number, route: RouteInfo): FreightRate {
    // Rail only makes sense for heavy shipments
    if (weight < 200) return null as any
    
    const rail = rates.rail
    const baseRate = rail.base + (Math.random() * 0.3 - 0.15)
    const fuelSurcharge = rail.fuel
    const totalRate = baseRate + fuelSurcharge
    
    return {
      carrier: 'BNSF Railway',
      serviceType: 'Rail Intermodal',
      rate: Math.round(baseRate * 100) / 100,
      transitTime: this.calculateTransitTime(route.distance, 'rail'),
      reliability: CARRIER_DATA['BNSF Railway'].reliability,
      fuelSurcharge: Math.round(fuelSurcharge * 100) / 100,
      totalCost: Math.round(totalRate * weight * 100) / 100,
      marketTrend: rail.trend as 'up' | 'down' | 'stable',
      trendPercentage: rail.trendPercent
    }
  }

  private static generateTruckloadRate(rates: any, weight: number, route: RouteInfo): FreightRate {
    // Truckload only for very heavy shipments
    if (weight < 400) return null as any
    
    const tl = rates.truckload
    const baseRate = tl.base + (Math.random() * 0.5 - 0.25)
    const fuelSurcharge = tl.fuel
    const totalRate = baseRate + fuelSurcharge
    
    return {
      carrier: 'Regional Carrier',
      serviceType: 'Full Truckload',
      rate: Math.round(baseRate * 100) / 100,
      transitTime: this.calculateTransitTime(route.distance, 'truckload'),
      reliability: 91,
      fuelSurcharge: Math.round(fuelSurcharge * 100) / 100,
      totalCost: Math.round(totalRate * weight * 100) / 100,
      marketTrend: tl.trend as 'up' | 'down' | 'stable',
      trendPercentage: tl.trendPercent
    }
  }

  private static calculateTransitTime(distance: number, mode: string): string {
    const days = mode === 'rail' ? Math.ceil(distance / 400) + 2 : 
                  mode === 'ltl' ? Math.ceil(distance / 500) + 1 :
                  Math.ceil(distance / 600)
    
    return days === 1 ? 'Next day' : `${days} business days`
  }

  static async getMarketIntelligence(route: RouteInfo): Promise<MarketIntelligence> {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // Simulate market intelligence
    const seasonalFactor = this.getSeasonalFactor()
    const fuelIndex = 105.7 + (Math.random() * 10 - 5) // Current fuel index
    
    return {
      averageRate: 2.67,
      marketCondition: seasonalFactor > 1.1 ? 'tight' : seasonalFactor < 0.9 ? 'loose' : 'balanced',
      seasonalFactor,
      fuelIndex,
      demandLevel: seasonalFactor > 1.1 ? 'high' : 'medium',
      recommendation: this.generateRecommendation(seasonalFactor, fuelIndex)
    }
  }

  private static getSeasonalFactor(): number {
    const month = new Date().getMonth()
    // Spring building season (March-June) has higher demand
    const seasonalFactors = [0.95, 0.93, 1.15, 1.25, 1.20, 1.18, 1.05, 1.02, 1.08, 1.12, 0.98, 0.92]
    return seasonalFactors[month]
  }

  private static generateRecommendation(seasonal: number, fuel: number): string {
    if (seasonal > 1.15 && fuel > 110) {
      return "High demand + elevated fuel costs. Consider rail for cost savings and booking 2+ weeks ahead."
    } else if (seasonal < 0.95) {
      return "Favorable market conditions. Good time for large shipments with negotiated rates."
    } else if (fuel > 110) {
      return "Elevated fuel costs impacting rates. Rail intermodal offers better fuel efficiency."
    } else {
      return "Balanced market conditions. Standard routing recommendations apply."
    }
  }

  static calculateSavings(rates: FreightRate[]): { amount: number, percentage: number, bestOption: FreightRate } {
    if (rates.length === 0) return { amount: 0, percentage: 0, bestOption: rates[0] }
    
    const sortedRates = rates.sort((a, b) => a.totalCost - b.totalCost)
    const bestRate = sortedRates[0]
    const worstRate = sortedRates[sortedRates.length - 1]
    
    const savings = worstRate.totalCost - bestRate.totalCost
    const percentage = Math.round((savings / worstRate.totalCost) * 100)
    
    return {
      amount: Math.round(savings * 100) / 100,
      percentage,
      bestOption: bestRate
    }
  }

  // Simulate route distance calculation
  static getRouteDistance(origin: string, destination: string): number {
    const distances: { [key: string]: number } = {
      'Portland,OR-Chicago,IL': 2135,
      'Portland,OR-Atlanta,GA': 2595,
      'Seattle,WA-Denver,CO': 1325,
      'Portland,OR-Dallas,TX': 2080,
      'Seattle,WA-Chicago,IL': 2065
    }
    
    return distances[`${origin}-${destination}`] || 2000
  }
}