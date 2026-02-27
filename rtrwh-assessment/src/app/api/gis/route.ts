// GIS/Aquifer API Routes
import { NextRequest, NextResponse } from 'next/server';
import { fetchGISData, fetchAquiferInfo, fetchGroundwaterLevel, fetchRechargePotential } from '@/lib/services/aquifer';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');
  const district = searchParams.get('district') || '';
  const state = searchParams.get('state') || '';
  const type = searchParams.get('type') || 'full'; // full, aquifer, groundwater, recharge
  
  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: 'Invalid coordinates. Please provide valid lat and lng parameters.' },
      { status: 400 }
    );
  }
  
  try {
    switch (type) {
      case 'aquifer':
        const aquifer = await fetchAquiferInfo(lat, lng, state);
        return NextResponse.json(aquifer);
        
      case 'groundwater':
        const groundwater = await fetchGroundwaterLevel(lat, lng, district);
        return NextResponse.json(groundwater);
        
      case 'recharge':
        const recharge = await fetchRechargePotential(lat, lng);
        return NextResponse.json(recharge);
        
      default:
        const gisData = await fetchGISData(lat, lng, district, state);
        return NextResponse.json(gisData);
    }
  } catch (error) {
    console.error('GIS API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GIS data' },
      { status: 500 }
    );
  }
}
