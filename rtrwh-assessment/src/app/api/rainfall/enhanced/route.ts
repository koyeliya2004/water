// Enhanced Rainfall API Routes
import { NextRequest, NextResponse } from 'next/server';
import { fetchRainfallData, fetchMonthlyRainfall, fetchSeasonalRainfall, fetchDroughtRisk } from '@/lib/services/rainfall';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const district = searchParams.get('district') || '';
  const state = searchParams.get('state') || '';
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const type = searchParams.get('type') || 'full';
  
  if (!district && !state) {
    return NextResponse.json(
      { error: 'Please provide district or state parameter.' },
      { status: 400 }
    );
  }
  
  try {
    const resolvedDistrict = district || 'Unknown';
    const resolvedState = state || 'Unknown';
    const resolvedLat = lat ? parseFloat(lat) : undefined;
    const resolvedLng = lng ? parseFloat(lng) : undefined;
    
    switch (type) {
      case 'monthly':
        const monthly = await fetchMonthlyRainfall(resolvedDistrict, resolvedState);
        return NextResponse.json(monthly);
        
      case 'seasonal':
        const seasonal = await fetchSeasonalRainfall(resolvedDistrict, resolvedState);
        return NextResponse.json(seasonal);
        
      case 'drought':
        const drought = await fetchDroughtRisk(resolvedDistrict, resolvedState);
        return NextResponse.json(drought);
        
      default:
        const rainfallData = await fetchRainfallData(resolvedDistrict, resolvedState, resolvedLat, resolvedLng);
        return NextResponse.json(rainfallData);
    }
  } catch (error) {
    console.error('Rainfall API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rainfall data' },
      { status: 500 }
    );
  }
}
