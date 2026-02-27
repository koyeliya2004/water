// Location Intelligence Service
import type { 
  LocationAnalysis, 
  LocationCoordinates, 
  LocationAddress,
  RainfallZone,
  ClimateZone
} from '@/lib/types/location';
import { RAINFALL_ZONES, CLIMATE_ZONES } from '@/lib/static-data/location';

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const locationCache = new Map<string, { data: LocationAnalysis; timestamp: number }>();

function getCachedLocation(key: string): LocationAnalysis | null {
  const cached = locationCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedLocation(key: string, data: LocationAnalysis): void {
  locationCache.set(key, { data, timestamp: Date.now() });
}

export async function analyzeLocation(
  lat: number,
  lng: number,
  address?: LocationAddress
): Promise<LocationAnalysis> {
  const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  const cached = getCachedLocation(cacheKey);
  if (cached) {
    return cached;
  }

  // Determine rainfall zone based on coordinates
  const rainfallZone = determineRainfallZone(lat, lng);
  
  // Determine climate zone
  const climateZone = determineClimateZone(lat, lng);
  
  // Determine topography
  const topography = determineTopography(lat, lng);
  
  // Determine soil type
  const soilType = determineSoilType(lat, lng);
  
  // Determine urban/rural classification
  const isUrban = determineUrbanClassification(lat, lng);
  
  // Calculate altitude (simplified)
  const altitude = estimateAltitude(lat, lng);
  
  const analysis: LocationAnalysis = {
    coordinates: { lat, lng },
    address: address || {
      address: 'Unknown Location',
      country: 'India'
    },
    rainfallZone,
    rainfallZoneInfo: getRainfallZoneInfo(rainfallZone),
    isUrban,
    urbanClassification: isUrban ? 'city' : undefined,
    topography,
    soilType,
    climateZone,
    altitude,
    distanceToWaterBody: estimateDistanceToWater(lat, lng)
  };
  
  setCachedLocation(cacheKey, analysis);
  return analysis;
}

function determineRainfallZone(lat: number, lng: number): string {
  // Northeast India - highest rainfall
  if (lat > 24 && lng > 88 && lng < 95) {
    return 'excess';
  }
  
  // Coastal regions
  if ((lng < 73 && lat < 22) || (lng > 80 && lat < 22)) {
    return 'high';
  }
  
  // Western coast (Konkan, Malabar)
  if (lng > 72 && lng < 76 && lat > 14 && lat < 22) {
    return 'excess';
  }
  
  // Peninsular interior
  if (lat > 14 && lat < 24 && lng > 74 && lng < 88) {
    return 'moderate';
  }
  
  // Indo-Gangetic plain
  if (lat > 22 && lat < 32 && lng > 72 && lng < 90) {
    return 'moderate';
  }
  
  // Rajasthan desert
  if (lat > 23 && lat < 30 && lng > 68 && lng < 76) {
    return 'deficient';
  }
  
  // Default
  return 'moderate';
}

function determineClimateZone(lat: number, lng: number): string {
  // Tropical
  if (lat < 15) {
    return 'Tropical Wet';
  }
  
  // Subtropical
  if (lat >= 15 && lat < 28) {
    return 'Subtropical Humid';
  }
  
  // Temperate
  if (lat >= 28 && lat < 35) {
    return 'Temperate';
  }
  
  // Alpine
  if (lat >= 35) {
    return 'Alpine';
  }
  
  return 'Subtropical Humid';
}

function determineTopography(lat: number, lng: number): LocationAnalysis['topography'] {
  // Himalayas
  if (lat > 28 && lng > 75 && lng < 95) {
    return 'hilly';
  }
  
  // Coastal plains
  if (lng < 73 || (lng > 80 && lat < 24)) {
    return 'coastal';
  }
  
  // Thar desert
  if (lat > 23 && lat < 30 && lng > 68 && lng < 76) {
    return 'desert';
  }
  
  // Peninsular plateau
  if (lat < 24 && lng > 72 && lng < 88) {
    return 'plateau';
  }
  
  return 'plain';
}

function determineSoilType(lat: number, lng: number): string {
  // Alluvial plains
  if (lat > 22 && lat < 32 && lng > 72 && lng < 90) {
    return 'Alluvial Soil';
  }
  
  // Black cotton soil (Deccan trap)
  if (lat > 14 && lat < 24 && lng > 74 && lng < 82) {
    return 'Black Clay Soil';
  }
  
  // Red soil (Peninsular)
  if (lat > 10 && lat < 22 && lng > 75 && lng < 88) {
    return 'Red Loamy Soil';
  }
  
  // Laterite (coastal)
  if ((lng < 74 || lng > 80) && lat < 22) {
    return 'Laterite Soil';
  }
  
  return 'Mixed Soil';
}

function determineUrbanClassification(lat: number, lng: number): boolean {
  // Known metropolitan areas
  const metroAreas = [
    { lat: 28.6139, lng: 77.2090, radius: 50 }, // Delhi
    { lat: 19.0760, lng: 72.8777, radius: 40 }, // Mumbai
    { lat: 12.9716, lng: 77.5946, radius: 30 }, // Bangalore
    { lat: 13.0827, lng: 80.2707, radius: 30 }, // Chennai
    { lat: 22.5726, lng: 88.3639, radius: 30 }, // Kolkata
    { lat: 17.3850, lng: 78.4867, radius: 25 }, // Hyderabad
    { lat: 18.5204, lng: 73.8567, radius: 25 }, // Pune
    { lat: 23.0225, lng: 72.5714, radius: 25 }, // Ahmedabad
    { lat: 26.9124, lng: 75.7873, radius: 20 }, // Jaipur
    { lat: 26.8467, lng: 80.9462, radius: 20 }  // Lucknow
  ];
  
  for (const metro of metroAreas) {
    const distance = Math.sqrt(
      Math.pow(lat - metro.lat, 2) + Math.pow(lng - metro.lng, 2)
    );
    
    // Convert degrees to approximate km (rough approximation)
    if (distance * 111 < metro.radius) {
      return true;
    }
  }
  
  return false;
}

function estimateAltitude(lat: number, lng: number): number {
  // Simplified altitude estimation
  // Himalayas
  if (lat > 28 && lng > 75 && lng < 95) {
    return 1500 + Math.random() * 2000;
  }
  
  // Peninsular plateau
  if (lat < 24 && lng > 72 && lng < 88) {
    return 500 + Math.random() * 500;
  }
  
  // Indo-Gangetic plain
  if (lat > 22 && lat < 32 && lng > 72 && lng < 90) {
    return 100 + Math.random() * 200;
  }
  
  // Coastal
  if (lng < 73 || (lng > 80 && lat < 24)) {
    return 10 + Math.random() * 50;
  }
  
  // Desert
  if (lat > 23 && lat < 30 && lng > 68 && lng < 76) {
    return 200 + Math.random() * 300;
  }
  
  return 200;
}

function estimateDistanceToWater(lat: number, lng: number): number {
  // Simplified estimation - return in km
  // In reality, this would require GIS data
  
  // Coastal areas
  if (lng < 73 || (lng > 80 && lat < 24)) {
    return Math.random() * 10;
  }
  
  // Near major rivers (approximate)
  const riverDistricts = ['bihar', 'uttar pradesh', 'punjab', 'haryana'];
  
  // Random distance for inland
  return 5 + Math.random() * 30;
}

function getRainfallZoneInfo(zone: string): { zone: string; zoneHi: string; range: string } {
  const zones: Record<string, { zoneHi: string; range: string }> = {
    'excess': { zoneHi: 'अधिक वर्षा', range: '>2000 mm' },
    'high': { zoneHi: 'उच्च वर्षा', range: '1500-2000 mm' },
    'moderate': { zoneHi: 'मध्यम वर्षा', range: '1000-1500 mm' },
    'low': { zoneHi: 'कम वर्षा', range: '500-1000 mm' },
    'deficient': { zoneHi: 'न्यूनतम वर्षा', range: '<500 mm' }
  };
  
  return {
    zone,
    ...(zones[zone] || zones['moderate'])
  };
}

export async function findNearbyDistricts(
  lat: number,
  lng: number,
  radiusKm: number = 50
): Promise<string[]> {
  // Simplified - return nearby major cities
  const majorCities = [
    { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567 }
  ];
  
  const nearby = majorCities
    .map(city => ({
      ...city,
      distance: Math.sqrt(Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2)) * 111
    }))
    .filter(city => city.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map(city => city.name);
  
  return nearby;
}

export default {
  analyzeLocation,
  findNearbyDistricts
};
