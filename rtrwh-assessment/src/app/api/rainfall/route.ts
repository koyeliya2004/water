import { NextRequest, NextResponse } from 'next/server';
import { getRainfallForLocation, RAINFALL_DATA } from '@/lib/calculations/rainwater';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get('location');
  
  if (location) {
    const rainfall = getRainfallForLocation(location);
    return NextResponse.json({ location, rainfall });
  }
  
  // Return all rainfall data if no location specified
  return NextResponse.json({
    cities: RAINFALL_DATA
  });
}
