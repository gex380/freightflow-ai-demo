import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  console.log('=== FreightFlow API Route Called ===')
  
  let millData: any = null
  
  try {
    console.log('1. Getting mill data from request...')
    const requestBody = await request.json()
    millData = requestBody.millData
    console.log('2. Mill data received:', millData)

    if (!millData) {
      console.log('3. ERROR: No mill data provided')
      return NextResponse.json({ error: 'Mill data is required' }, { status: 400 })
    }

    console.log('4. Checking Anthropic API key...')
    console.log('5. API key exists:', !!process.env.ANTHROPIC_API_KEY)
    console.log('6. API key starts with sk-ant:', process.env.ANTHROPIC_API_KEY?.startsWith('sk-ant-'))

    const prompt = `You are FreightFlow, an AI freight coordination system for lumber mills. You need to analyze this lumber mill's profile and generate an intelligent freight configuration.

MILL PROFILE:
- Name: ${millData.name}
- Mill Type: ${millData.millType}
- Monthly Capacity: ${millData.capacity} board feet
- Location: ${millData.city}, ${millData.state}
- Employees: ${millData.employees}
- Current Carriers: ${millData.currentCarriers?.join(', ') || 'Not specified'}
- Monthly Shipments: ${millData.monthlyShipments || 'Not specified'}
- Average Shipment Size: ${millData.averageShipmentSize || 'Not specified'} board feet
- Seasonal Variation: ${millData.seasonalVariation || 'Not specified'}%

LUMBER INDUSTRY CONTEXT:
- Sawmills: Process logs into dimensional lumber, often ship large volumes, need rail for long distances
- Planing Mills: Secondary processing, smaller refined shipments, need LTL carriers
- Integrated Mills: Full processing, very high volumes, need rail + intermodal
- Specialty Mills: Custom millwork, high-value products, need white-glove handling

AVAILABLE CARRIERS:
1. FedEx Freight (LTL, White Glove) - Premium service, good tracking
2. UPS Freight (LTL, FTL) - Reliable, good for standard shipments  
3. Old Dominion (LTL, Construction) - Great for construction lumber
4. XPO Logistics (LTL, FTL, Expedited) - Flexible services
5. BNSF Railway (Rail, Intermodal) - Cost-effective for high volume
6. Local/Regional carriers - Good for short distances

Generate a FreightFlow configuration with exactly this JSON structure:

{
  "routingRules": [
    {
      "id": "rule_id",
      "name": "Rule Name",
      "conditions": "When condition description",
      "action": "What FreightFlow will do",
      "priority": 1,
      "reasoning": "Why this rule makes sense for this specific mill"
    }
  ],
  "carrierPreferences": [
    {
      "name": "Carrier Name",
      "serviceTypes": ["LTL", "FTL", "Rail"],
      "preferenceScore": 8,
      "reasoning": "Why this carrier is good for this mill",
      "contractRates": true
    }
  ],
  "rateOptimization": {
    "primary_objective": "cost",
    "cost_weight": 0.6,
    "speed_weight": 0.2,
    "reliability_weight": 0.2,
    "reasoning": "Why this optimization strategy fits this mill"
  },
  "specialHandling": {
    "oversizedCapability": true,
    "temperatureControl": false,
    "hazmatCapability": false,
    "reasoning": "Special handling needs explanation"
  },
  "automationSettings": {
    "autoBooking": true,
    "autoTracking": true, 
    "autoNotifications": true,
    "reasoning": "Automation level explanation"
  }
}

REQUIREMENTS:
1. Generate 2-4 routing rules that make sense for this mill type and size
2. Rank 4-5 carriers with scores 1-10 based on fit for this mill
3. Set optimization weights that total 1.0
4. Consider lumber industry specifics (board feet, seasonal patterns, lumber grades)
5. Make everything specific to THIS mill - reference their capacity, type, location
6. Provide detailed reasoning that shows lumber industry expertise
7. Only return valid JSON, no extra text

Generate the FreightFlow configuration now:`

    console.log('7. Creating Anthropic API call...')
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      temperature: 0.3,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    console.log('8. Got response from Anthropic')
    const responseText = response.content[0].type === 'text' ? response.content[0].text : ''
    console.log('9. Response text:', responseText.substring(0, 200) + '...')
    
    // Try to parse the JSON response
    try {
      console.log('10. Attempting to parse JSON...')
      const config = JSON.parse(responseText)
      console.log('11. JSON parsed successfully')
      return NextResponse.json(config)
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      console.error('Full Response:', responseText)
      
      // Fallback to smart simulation if JSON parsing fails
      console.log('12. Using fallback configuration due to JSON parse error')
      const fallbackConfig = generateFallbackConfig(millData)
      return NextResponse.json(fallbackConfig)
    }

  } catch (error) {
    console.error('Anthropic API Error:', error)
    
    // Fallback to smart simulation if API fails
    console.log('13. API failed, using fallback configuration')
    
    // millData is now in scope since it's declared at the top
    const fallbackConfig = generateFallbackConfig(millData || {})
    return NextResponse.json(fallbackConfig)
  }
}

// Fallback configuration if AI fails
function generateFallbackConfig(millData: any) {
  console.log('Generating fallback config for:', millData?.name || 'Unknown Mill')
  
  const isLargeMill = parseInt(millData?.capacity || '0') > 2000000
  const isSpecialtyMill = millData?.millType === 'SPECIALTY_MILL'

  return {
    routingRules: [
      {
        id: 'volume_rail',
        name: 'High Volume Rail Routing',
        conditions: 'Weight > 40,000 lbs AND Distance > 500 miles',
        action: 'Route to rail carriers for cost efficiency',
        priority: 1,
        reasoning: `With ${parseInt(millData?.capacity || '0').toLocaleString()} BF/month capacity, rail becomes cost-effective for large shipments`
      },
      {
        id: 'local_ltl',
        name: 'Regional LTL Optimization',
        conditions: 'Distance < 300 miles AND Weight < 20,000 lbs',
        action: 'Prioritize regional LTL carriers',
        priority: 2,
        reasoning: `Local/regional carriers often provide better service for ${millData?.state || 'regional'} area deliveries`
      }
    ],
    carrierPreferences: [
      {
        name: 'FedEx Freight',
        serviceTypes: ['LTL', 'White Glove'],
        preferenceScore: isSpecialtyMill ? 9 : 7,
        reasoning: isSpecialtyMill ? 'Excellent for high-value specialty products' : 'Reliable LTL service with good tracking',
        contractRates: isLargeMill
      },
      {
        name: 'BNSF Railway',
        serviceTypes: ['Rail', 'Intermodal'],
        preferenceScore: isLargeMill ? 9 : 5,
        reasoning: isLargeMill ? 'Cost-effective for high-volume shipments' : 'Good for large shipments when time allows',
        contractRates: isLargeMill
      },
      {
        name: 'Old Dominion',
        serviceTypes: ['LTL', 'Construction Materials'],
        preferenceScore: millData?.millType === 'SAWMILL' ? 8 : 6,
        reasoning: millData?.millType === 'SAWMILL' ? 'Specialized in construction lumber transport' : 'Regional LTL coverage',
        contractRates: false
      },
      {
        name: 'XPO Logistics',
        serviceTypes: ['LTL', 'FTL', 'Expedited'],
        preferenceScore: 7,
        reasoning: 'Good balance of services and competitive pricing',
        contractRates: isLargeMill
      }
    ],
    rateOptimization: {
      primary_objective: isSpecialtyMill ? 'reliability' : isLargeMill ? 'cost' : 'balanced',
      cost_weight: isLargeMill ? 0.6 : isSpecialtyMill ? 0.2 : 0.4,
      speed_weight: isSpecialtyMill ? 0.4 : isLargeMill ? 0.2 : 0.3,
      reliability_weight: isSpecialtyMill ? 0.4 : isLargeMill ? 0.2 : 0.3,
      reasoning: isSpecialtyMill 
        ? 'Specialty mills prioritize reliability to protect high-value custom products'
        : isLargeMill 
        ? 'Large mills benefit most from cost optimization due to volume'
        : 'Balanced approach optimizes for both cost and service'
    },
    specialHandling: {
      oversizedCapability: millData?.millType === 'SAWMILL' || millData?.millType === 'INTEGRATED_MILL',
      temperatureControl: false,
      hazmatCapability: false,
      reasoning: millData?.millType === 'SAWMILL' 
        ? 'Sawmills often ship oversized beams and structural lumber'
        : 'Standard lumber dimensions, no special handling required'
    },
    automationSettings: {
      autoBooking: true,
      autoTracking: true,
      autoNotifications: parseInt(millData?.employees || '0') > 50,
      reasoning: parseInt(millData?.employees || '0') > 50 
        ? 'Large operation benefits from full automation to reduce manual workload'
        : 'Automated booking and tracking with manual notification review'
    }
  }
}