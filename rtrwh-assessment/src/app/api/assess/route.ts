import { NextRequest, NextResponse } from 'next/server';
import { calculateRainwaterPotential, calculateFeasibility, getRainfallForLocation } from '@/lib/calculations/rainwater';
import { recommendStructures } from '@/lib/calculations/structures';
import { calculateCostEstimate } from '@/lib/calculations/costs';
import { fetchWeatherData, generateHarvestingForecast } from '@/lib/services/weather';
import { fetchGISData } from '@/lib/services/aquifer';
import { fetchRainfallData } from '@/lib/services/rainfall';
import { analyzeLocation } from '@/lib/services/location';
import type { EnhancedAssessmentResult, EnhancedFeasibilityResult, EnhancedAssessmentInput } from '@/lib/types/assessment';
import type { CostEstimate, LocationData } from '@/lib/types';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function POST(req: NextRequest) {
  try {
    const input: EnhancedAssessmentInput = await req.json();
    
    const {
      location,
      roofArea,
      roofType,
      openSpace,
      dwellers,
      includeWeather = false,
      includeAquifer = false,
      includeHistoricalRainfall = false
    } = input;
    
    const typedLocation: LocationData = location as LocationData;
    
    // Get rainfall data for location
    const rainfall = typedLocation.annualRainfall || 
      getRainfallForLocation(location.address || location.city || '');
    
    // Calculate water potential
    const waterPotential = calculateRainwaterPotential(
      roofArea,
      rainfall,
      roofType
    );
    
    // Calculate feasibility
    const feasibility = calculateFeasibility(
      roofArea,
      openSpace,
      dwellers,
      waterPotential,
      roofType
    );
    
    // Get structure recommendations
    const structures = recommendStructures(
      roofArea,
      openSpace,
      waterPotential,
      dwellers
    );
    
    // Calculate costs for each structure
    const costs = structures.map(s => calculateCostEstimate(s, waterPotential));
    
    // Build the result object
    const result: EnhancedAssessmentResult = {
      id: generateUUID(),
      input,
      feasibility: feasibility as EnhancedFeasibilityResult,
      structures: structures.map(s => ({
        ...s,
        optimalPlacement: getOptimalPlacement(s.type, input.roofType),
        estimatedRecharge: calculateEstimatedRecharge(s.type, waterPotential),
        maintenanceNotes: getMaintenanceNotes(s.type),
        maintenanceNotesHi: getMaintenanceNotesHi(s.type)
      })),
      weather: undefined,
      aquifer: undefined,
      rainfall: undefined,
      location: undefined,
      summary: {
        totalWaterPotential: waterPotential,
        recommendedStorageCapacity: calculateRecommendedStorage(roofArea, dwellers, rainfall),
        estimatedAnnualSavings: calculateAnnualSavings(waterPotential),
        paybackPeriod: calculatePaybackPeriod(costs, waterPotential),
        environmentalImpact: {
          waterConserved: waterPotential,
          groundwaterRecharged: Math.round(waterPotential * 0.3),
          carbonSaved: Math.round(waterPotential * 0.15) // kg CO2
        }
      },
      recommendations: {
        immediate: getImmediateRecommendations(feasibility, rainfall),
        shortTerm: getShortTermRecommendations(roofArea, dwellers),
        longTerm: getLongTermRecommendations(feasibility.rating)
      },
      timestamp: new Date().toISOString()
    };
    
    // Phase 2: Fetch additional data if requested
    const coordinates = location.coordinates;
    
    if (includeWeather && coordinates) {
      try {
        const weatherData = await fetchWeatherData(coordinates.lat, coordinates.lng, roofArea);
        const harvestingForecast = generateHarvestingForecast(weatherData.daily, roofArea);
        
        result.weather = {
          enabled: true,
          currentWeather: weatherData.current,
          forecast: weatherData.daily,
          alerts: weatherData.alerts,
          harvestingPotential: harvestingForecast,
          lastUpdated: weatherData.lastUpdated
        };
        
        // Adjust water potential based on forecast
        const monsoonPotential = harvestingForecast
          .filter(f => f.date.includes('-06') || f.date.includes('-07') || f.date.includes('-08') || f.date.includes('-09'))
          .reduce((sum, f) => sum + f.potential, 0);
        
        if (monsoonPotential > 0) {
          (result.feasibility as EnhancedFeasibilityResult).weatherAdjustedPotential = Math.round(
            (waterPotential + monsoonPotential) / 2
          );
        }
      } catch (error) {
        console.error('Weather integration error:', error);
      }
    }
    
    if (includeAquifer && coordinates) {
      try {
        const gisData = await fetchGISData(
          coordinates.lat,
          coordinates.lng,
          location.district,
          location.state
        );
        
        result.aquifer = {
          enabled: true,
          data: gisData,
          lastUpdated: gisData.lastUpdated
        };
        
        // Add reliability score based on aquifer data
        const reliabilityScore = calculateReliabilityScore(gisData);
        (result.feasibility as EnhancedFeasibilityResult).reliabilityScore = reliabilityScore;
      } catch (error) {
        console.error('Aquifer integration error:', error);
      }
    }
    
    if (includeHistoricalRainfall) {
      try {
        const rainfallData = await fetchRainfallData(
          location.district || location.city || 'Unknown',
          location.state || 'Unknown',
          coordinates?.lat,
          coordinates?.lng
        );
        
        result.rainfall = {
          enabled: true,
          data: rainfallData,
          historicalAnalysis: {
            avgAnnualRainfall: rainfallData.annual,
            trend: rainfallData.trend.trend,
            droughtRisk: rainfallData.drought.moderate > 15 ? 'High' : rainfallData.drought.moderate > 5 ? 'Moderate' : 'Low'
          },
          lastUpdated: rainfallData.lastUpdated
        };
        
        // Add seasonal distribution
        const seasonal = rainfallData.seasonal.reduce((acc, s) => {
          acc[s.season.replace('-', '') as 'monsoon' | 'postmonsoon' | 'winter' | 'premonsoon'] = s.rainfall;
          return acc;
        }, {} as Record<string, number>);
        
        (result.feasibility as EnhancedFeasibilityResult).seasonalDistribution = {
          monsoon: seasonal['monsoon'] || 0,
          postMonsoon: seasonal['postmonsoon'] || 0,
          winter: seasonal['winter'] || 0,
          preMonsoon: seasonal['premonsoon'] || 0
        };
        
        // Add risk factors
        (result.feasibility as EnhancedFeasibilityResult).riskFactors = {
          drought: rainfallData.drought.moderate,
          flood: rainfallData.seasonal.find(s => s.season === 'monsoon')?.rainfall || 0 > 1000 ? 30 : 10,
          contamination: 20 // Default
        };
      } catch (error) {
        console.error('Rainfall integration error:', error);
      }
    }
    
    // Location intelligence
    if (coordinates) {
      try {
        const locationAnalysis = await analyzeLocation(
          coordinates.lat,
          coordinates.lng,
          {
            address: location.address,
            city: location.city,
            district: location.district,
            state: location.state
          }
        );
        
        result.location = {
          analysis: locationAnalysis,
          lastUpdated: new Date().toISOString()
        };
      } catch (error) {
        console.error('Location analysis error:', error);
      }
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Assessment error:', error);
    return NextResponse.json(
      { error: 'Assessment failed. Please check your inputs.' },
      { status: 500 }
    );
  }
}

function getOptimalPlacement(type: string, _roofType: string): string {
  const placements: Record<string, string> = {
    'storage_tank': 'Near the downpipe collection point, ideally at ground level or underground',
    'recharge_pit': 'At least 3m from building foundation, in areas with good soil percolation',
    'recharge_trench': 'Along the property boundary, following natural slope',
    'recharge_shaft': 'In central location with access to main drainage'
  };
  return placements[type] || 'Consult with a certified contractor';
}

function calculateEstimatedRecharge(type: string, potential: number): number {
  const rechargeRates: Record<string, number> = {
    'storage_tank': 0,
    'recharge_pit': potential * 0.4,
    'recharge_trench': potential * 0.5,
    'recharge_shaft': potential * 0.6
  };
  return Math.round(rechargeRates[type] || 0);
}

function getMaintenanceNotes(type: string): string {
  const notes: Record<string, string> = {
    'storage_tank': 'Clean filters monthly, check for algae growth, inspect inlet/outlet pipes quarterly',
    'recharge_pit': 'Inspect filter media every 6 months, replace if clogged, check inlet for debris',
    'recharge_trench': 'Remove sediment annually, check for vegetation growth, inspect outlet',
    'recharge_shaft': 'Annual inspection recommended, check for clogging, professional cleaning if needed'
  };
  return notes[type] || 'Follow manufacturer guidelines';
}

function getMaintenanceNotesHi(type: string): string {
  const notesHi: Record<string, string> = {
    'storage_tank': 'मासिक रूप से फ़िल्टर साफ करें, शैवाल वृद्धि की जांच करें, त्रैमासिक रूप से इनलेट/आउटलेट पाइप की जांच करें',
    'recharge_pit': 'हर 6 महीने में फ़िल्टर मीडिया का निरीक्षण करें, यदि बंद हो तो बदलें, इनलेट के लिए मलबे की जांच करें',
    'recharge_trench': 'वार्षिक रूप से तलछट हटाएं, वनस्पति वृद्धि की जांच करें, आउलेट का निरीक्षण करें',
    'recharge_shaft': 'वार्षिक निरीक्षण अनुशंसित, बंद होने की जांच करें, आवश्यकतानुसार पेशेवर सफाई करें'
  };
  return notesHi[type] || 'निर्माता के दिशानिर्देशों का पालन करें';
}

function calculateRecommendedStorage(roofArea: number, dwellers: number, rainfall: number): number {
  const dailyNeed = dwellers * 135;
  const daysOfStorage = rainfall > 1500 ? 7 : rainfall > 1000 ? 5 : 3;
  const capacity = Math.min(Math.max(dailyNeed * daysOfStorage, 2000), 50000);
  return Math.round(capacity / 1000) * 1000;
}

function calculateAnnualSavings(potential: number): number {
  const waterRate = 30; // INR per 1000 liters
  return Math.round(potential * waterRate / 1000);
}

function calculatePaybackPeriod(costs: CostEstimate[], potential: number): number {
  if (costs.length === 0 || potential === 0) return 0;
  const minCost = Math.min(...costs.map(c => c.totalCost));
  const annualSavings = calculateAnnualSavings(potential);
  if (annualSavings === 0) return 0;
  return Math.round(minCost / annualSavings * 10) / 10;
}

function calculateReliabilityScore(gisData: { aquifer?: { suitability?: string }; groundwater?: { trend?: string }; recharge?: { score?: number } }): number {
  const aquiferScore = gisData?.aquifer?.suitability === 'excellent' ? 90 :
                       gisData?.aquifer?.suitability === 'good' ? 70 :
                       gisData?.aquifer?.suitability === 'moderate' ? 50 : 30;
  
  const groundwaterScore = gisData?.groundwater?.trend === 'rising' ? 90 :
                           gisData?.groundwater?.trend === 'stable' ? 70 : 40;
  
  const rechargeScore = gisData?.recharge?.score || 50;
  
  return Math.round((aquiferScore * 0.3 + groundwaterScore * 0.3 + rechargeScore * 0.4));
}

function getImmediateRecommendations(feasibility: { score: number }, rainfall: number): string[] {
  const recommendations: string[] = [];
  
  if (feasibility.score >= 75) {
    recommendations.push('Excellent potential! Proceed with installation at earliest');
  } else if (feasibility.score >= 55) {
    recommendations.push('Good potential. Plan installation for upcoming monsoon');
  } else {
    recommendations.push('Consider increasing roof area or exploring community solutions');
  }
  
  if (rainfall < 500) {
    recommendations.push('Low rainfall area - maximize storage capacity for dry season');
  }
  
  return recommendations;
}

function getShortTermRecommendations(roofArea: number, dwellers: number): string[] {
  const recommendations: string[] = [];
  
  if (roofArea < 100) {
    recommendations.push('Consider adding rain gutters to maximize collection');
  }
  
  if (dwellers > 5) {
    recommendations.push('Larger storage tank recommended for higher demand');
  }
  
  recommendations.push('Install first-flush diverter for cleaner water');
  recommendations.push('Connect downspouts to storage system');
  
  return recommendations;
}

function getLongTermRecommendations(rating: string): string[] {
  const recommendations: string[] = [];
  
  if (rating === 'Excellent' || rating === 'Good') {
    recommendations.push('Consider adding groundwater recharge structures');
    recommendations.push('Explore community rainwater harvesting programs');
  }
  
  recommendations.push('Maintain regular cleaning schedule for optimal performance');
  recommendations.push('Monitor water quality and install filters if needed');
  
  return recommendations;
}
