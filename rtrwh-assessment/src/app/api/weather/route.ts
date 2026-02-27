// Weather API Routes
import { NextRequest, NextResponse } from 'next/server';
import { fetchWeatherData } from '@/lib/services/weather';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');
  const roofArea = parseFloat(searchParams.get('roofArea') || '100');
  
  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: 'Invalid coordinates. Please provide valid lat and lng parameters.' },
      { status: 400 }
    );
  }
  
  try {
    const weatherData = await fetchWeatherData(lat, lng, roofArea);
    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
