// Location Intelligence API Routes
import { NextRequest, NextResponse } from 'next/server';
import { analyzeLocation, findNearbyDistricts } from '@/lib/services/location';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');
  const radius = parseFloat(searchParams.get('radius') || '50');
  const type = searchParams.get('type') || 'analyze';
  
  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: 'Invalid coordinates. Please provide valid lat and lng parameters.' },
      { status: 400 }
    );
  }
  
  try {
    switch (type) {
      case 'nearby':
        const nearby = await findNearbyDistricts(lat, lng, radius);
        return NextResponse.json({ nearby });
        
      default:
        const analysis = await analyzeLocation(lat, lng);
        return NextResponse.json(analysis);
    }
  } catch (error) {
    console.error('Location API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze location' },
      { status: 500 }
    );
  }
}
