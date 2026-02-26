import { NextRequest, NextResponse } from 'next/server';
import { calculateRainwaterPotential, calculateFeasibility, getRainfallForLocation } from '@/lib/calculations/rainwater';
import { recommendStructures } from '@/lib/calculations/structures';
import { calculateCostEstimate } from '@/lib/calculations/costs';

export async function POST(req: NextRequest) {
  try {
    const input = await req.json();
    
    // Get rainfall data for location
    const rainfall = input.location?.annualRainfall || 
      getRainfallForLocation(input.location?.address || '');
    
    // Calculate water potential
    const waterPotential = calculateRainwaterPotential(
      input.roofArea,
      rainfall,
      input.roofType
    );
    
    // Calculate feasibility
    const feasibility = calculateFeasibility(
      input.roofArea,
      input.openSpace,
      input.dwellers,
      waterPotential,
      input.roofType
    );
    
    // Get structure recommendations
    const structures = recommendStructures(
      input.roofArea,
      input.openSpace,
      waterPotential,
      input.dwellers
    );
    
    // Calculate costs for each structure
    const costs = structures.map(s => calculateCostEstimate(s, waterPotential));
    
    return NextResponse.json({
      input,
      feasibility,
      structures,
      costs,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Assessment error:', error);
    return NextResponse.json(
      { error: 'Assessment failed. Please check your inputs.' },
      { status: 500 }
    );
  }
}
