// Aquifer/GIS Service - CGWB Data Integration
import type { 
  GISDataResponse, 
  AquiferInfo, 
  GroundwaterLevel, 
  RechargePotential,
  SoilType,
  Topography,

} from '@/lib/types/aquifer';
import { GROUNDWATER_DATA } from '@/lib/static-data/aquifer';

// Cache for GIS data
const gisCache = new Map<string, { data: GISDataResponse; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours for GIS data

function getCachedGISData(key: string): GISDataResponse | null {
  const cached = gisCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedGISData(key: string, data: GISDataResponse): void {
  gisCache.set(key, { data, timestamp: Date.now() });
}

// Determine aquifer type based on location (coordinates)
function determineAquiferType(lat: number, lng: number, state: string): AquiferInfo {
  // India aquifer classification based on geological regions
  const stateLower = state?.toLowerCase() || '';
  
  // Hard rock aquifers (Peninsular India)
  const hardRockStates = ['maharashtra', 'karnataka', 'tamil nadu', 'telangana', 'andhra pradesh', 'gujarat', 'rajasthan', 'madhya pradesh'];
  
  // Alluvial aquifers (Indo-Gangetic Plain)
  const alluvialStates = ['punjab', 'haryana', 'uttar pradesh', 'bihar', 'west bengal', 'delhi', 'uttarakhand'];
  
  // Coastal aquifers
  const coastalStates = ['goa', 'kerala', 'odisha', 'maharashtra (coastal)', 'tamil nadu (coastal)'];
  
  // Sedimentary aquifers
  const sedimentaryStates = ['gujarat', 'rajasthan', 'west bengal'];
  
  let aquiferType: AquiferInfo['type'] = 'unknown';
  let aquiferName = 'Unknown Aquifer';
  
  if (hardRockStates.some(s => stateLower.includes(s))) {
    aquiferType = 'hard-rock';
    aquiferName = 'Peninsular Hard Rock Aquifer';
  } else if (alluvialStates.some(s => stateLower.includes(s))) {
    aquiferType = 'alluvial';
    aquiferName = 'Indo-Gangetic Alluvial Aquifer';
  } else if (coastalStates.some(s => stateLower.includes(s))) {
    aquiferType = 'coastal';
    aquiferName = 'Coastal Alluvial Aquifer';
  } else if (sedimentaryStates.some(s => stateLower.includes(s))) {
    aquiferType = 'sedimentary';
    aquiferName = 'Sedimentary Basin Aquifer';
  }
  
  // Override based on coordinates
  if (lat >= 22 && lat <= 35 && lng >= 68 && lng <= 90) {
    if (lng < 78) {
      aquiferType = 'alluvial';
      aquiferName = 'Indo-Gangetic Alluvial Aquifer';
    } else if (lat > 28 && lng > 88) {
      aquiferType = 'alluvial';
      aquiferName = 'Brahmaputra Alluvial Aquifer';
    }
  }
  
  // Peninsular region (south of Vindhyas)
  if (lat < 24) {
    aquiferType = 'hard-rock';
    aquiferName = 'Peninsular Hard Rock Aquifer';
  }
  
  const yields: Record<string, number> = {
    'alluvial': 15,
    'hard-rock': 3,
    'coastal': 8,
    'sedimentary': 10,
    'volcanic': 2,
    'unknown': 5
  };
  
  return {
    type: aquiferType,
    name: aquiferName,
    description: getAquiferDescription(aquiferType),
    yield: yields[aquiferType] || 5,
    yieldUnit: 'lps',
    specificCapacity: aquiferType === 'alluvial' ? 100 : 20,
    specificCapacityUnit: 'lpm/m',
    transmissivity: aquiferType === 'alluvial' ? 1000 : 50,
    transmissivityUnit: 'm²/day',
    depthRange: getAquiferDepthRange(aquiferType),
    suitability: aquiferType === 'alluvial' ? 'excellent' : aquiferType === 'hard-rock' ? 'good' : 'moderate'
  };
}

function getAquiferDescription(type: string): string {
  const descriptions: Record<string, string> = {
    'alluvial': 'The Indo-Gangetic alluvial aquifer is one of the most productive groundwater systems in the world. High yields and good water quality make it ideal for rainwater harvesting recharge.',
    'hard-rock': 'Peninsular hard rock aquifers have limited storage but can provide sustained yields. Recharge structures should be designed considering the fractured rock geometry.',
    'coastal': 'Coastal aquifers are vulnerable to seawater intrusion. Rainwater harvesting is particularly beneficial in these areas to prevent salinization.',
    'sedimentary': 'Sedimentary basins often contain multi-layer aquifer systems with varying water quality. Recharge should target specific permeable zones.',
    'volcanic': 'Volcanic rock aquifers have low permeability but can store significant groundwater. Specialized recharge techniques may be required.',
    'unknown': 'Aquifer characteristics for this area are not well documented. Local geological surveys are recommended.'
  };
  return descriptions[type] || descriptions['unknown'];
}

function getAquiferDepthRange(type: string): { min: number; max: number } {
  const ranges: Record<string, { min: number; max: number }> = {
    'alluvial': { min: 30, max: 200 },
    'hard-rock': { min: 30, max: 150 },
    'coastal': { min: 20, max: 100 },
    'sedimentary': { min: 50, max: 300 },
    'volcanic': { min: 40, max: 150 },
    'unknown': { min: 30, max: 150 }
  };
  return ranges[type] || ranges['unknown'];
}

function determineGroundwaterLevel(district: string, state: string): GroundwaterLevel {
  const key = `${district}, ${state}`.toLowerCase();
  
  // Check static data first
  for (const [dataKey, data] of Object.entries(GROUNDWATER_DATA)) {
    if (key.includes(dataKey) || dataKey.includes(key.split(',')[0].trim())) {
      return data;
    }
  }
  
  // Default based on region
  const monsoonSeason = new Date().getMonth() >= 8; // September
  const isNorthIndia = ['punjab', 'haryana', 'rajasthan', 'delhi', 'uttar pradesh', 'uttarakhand']
    .some(s => state.toLowerCase().includes(s));
  
  if (isNorthIndia) {
    return {
      preMonsoon: 15 + Math.random() * 10,
      postMonsoon: 8 + Math.random() * 5,
      annual: 12 + Math.random() * 8,
      trend: 'depleting',
      trendRate: -0.3 - Math.random() * 0.5,
      trendPeriod: '2015-2024',
      lastUpdated: '2024-01',
      dataQuality: 'good'
    };
  }
  
  return {
    preMonsoon: monsoonSeason ? 10 + Math.random() * 8 : 12 + Math.random() * 10,
    postMonsoon: monsoonSeason ? 5 + Math.random() * 4 : 8 + Math.random() * 5,
    annual: 8 + Math.random() * 8,
    trend: 'stable',
    trendRate: -0.1 + Math.random() * 0.3,
    trendPeriod: '2015-2024',
    lastUpdated: '2024-01',
    dataQuality: 'fair'
  };
}

function determineRechargePotential(
  lat: number, 
  lng: number, 
  soilType: string, 
  topography: Topography
): RechargePotential {
  // Calculate factors
  const soilFactor = getSoilInfiltrationFactor(soilType);
  const slopeFactor = getSlopeInfiltrationFactor(topography.slope);
  const vegetationFactor = 0.7; // Assume moderate vegetation
  const geologyFactor = 0.8; // Assume favorable geology
  
  const score = Math.round(
    (soilFactor * 0.3 + slopeFactor * 0.25 + vegetationFactor * 0.2 + geologyFactor * 0.25) * 100
  );
  
  let category: RechargePotential['category'];
  if (score >= 80) category = 'excellent';
  else if (score >= 60) category = 'good';
  else if (score >= 40) category = 'moderate';
  else if (score >= 20) category = 'poor';
  else category = 'very-poor';
  
  const structures = getRecommendedRechargeStructures(category, topography.type);
  const estimatedRecharge = Math.round(score * 5000); // liters per year per m²
  
  return {
    index: score,
    category,
    score,
    factors: {
      soil: Math.round(soilFactor * 100),
      slope: Math.round(slopeFactor * 100),
      vegetation: Math.round(vegetationFactor * 100),
      geology: Math.round(geologyFactor * 100)
    },
    recommendedStructures: structures,
    estimatedRecharge
  };
}

function getSoilInfiltrationFactor(soilType: string): number {
  const infiltrationRates: Record<string, number> = {
    'sandy': 0.9,
    'loamy sand': 0.8,
    'sandy loam': 0.7,
    'loam': 0.6,
    'silt loam': 0.5,
    'clay loam': 0.4,
    'sandy clay': 0.35,
    'silt': 0.45,
    'clay': 0.25
  };
  
  const key = soilType.toLowerCase().replace(/[^a-z]/g, '');
  for (const [type, rate] of Object.entries(infiltrationRates)) {
    if (key.includes(type.replace(/[^a-z]/g, ''))) {
      return rate;
    }
  }
  return 0.5; // Default
}

function getSlopeInfiltrationFactor(slope: number): number {
  if (slope < 1) return 0.9;
  if (slope < 3) return 0.8;
  if (slope < 5) return 0.7;
  if (slope < 10) return 0.5;
  if (slope < 15) return 0.3;
  return 0.2;
}

function getRecommendedRechargeStructures(
  category: RechargePotential['category'],
  topography: Topography['type']
): string[] {
  const structures: string[] = [];
  
  if (category === 'excellent' || category === 'good') {
    structures.push('Recharge Pit', 'Recharge Trench', 'Percolation Tank');
    if (topography === 'plain') {
      structures.push('Check Dam', 'Farm Pond');
    }
  } else if (category === 'moderate') {
    structures.push('Recharge Pit', 'Recharge Shaft');
    if (topography === 'hilly' || topography === 'plateau') {
      structures.push('Contour Bund');
    }
  } else {
    structures.push('Recharge Shaft', 'Borehole Recharge');
  }
  
  return structures;
}

function determineSoilType(lat: number, lng: number, district: string): SoilType {
  // Simplified soil type determination based on region
  const alluvialRegions = ['punjab', 'haryana', 'uttar pradesh', 'bihar', 'west bengal', 'delhi'];
  const blackSoilRegions = ['maharashtra', 'madhya pradesh', 'gujarat', 'telangana'];
  const redSoilRegions = ['karnataka', 'tamil nadu', 'andhra pradesh', 'odisha'];
  const lateriteRegions = ['kerala', 'goa', 'maharashtra (coastal)', 'assam'];
  
  const region = district?.toLowerCase() || '';
  
  if (alluvialRegions.some(r => region.includes(r))) {
    return {
      name: 'Alluvial Soil',
      code: 'AL',
      infiltrationRate: 25,
      waterRetention: 35,
      suitability: 'excellent',
      description: 'Highly fertile alluvial soil with good infiltration. Ideal for recharge structures.'
    };
  }
  
  if (blackSoilRegions.some(r => region.includes(r))) {
    return {
      name: 'Black Clay Soil (Regur)',
      code: 'BC',
      infiltrationRate: 5,
      waterRetention: 50,
      suitability: 'moderate',
      description: 'Black cotton soil with low infiltration but high water retention. Requires specialized recharge techniques.'
    };
  }
  
  if (redSoilRegions.some(r => region.includes(r))) {
    return {
      name: 'Red Loamy Soil',
      code: 'RL',
      infiltrationRate: 15,
      waterRetention: 30,
      suitability: 'good',
      description: 'Red soil with moderate infiltration. Suitable for most recharge structures.'
    };
  }
  
  if (lateriteRegions.some(r => region.includes(r))) {
    return {
      name: 'Laterite Soil',
      code: 'LT',
      infiltrationRate: 20,
      waterRetention: 25,
      suitability: 'good',
      description: 'Porous laterite soil with good infiltration. Well-suited for recharge.'
    };
  }
  
  // Default
  return {
    name: 'Mixed Soil',
    code: 'MX',
    infiltrationRate: 12,
    waterRetention: 32,
    suitability: 'moderate',
    description: 'Mixed soil type. Site-specific assessment recommended.'
  };
}

function determineTopography(lat: number, lng: number): Topography {
  // Simplified topography based on coordinates
  // Himalayas in north
  if (lat > 28 && lng > 75 && lng < 95) {
    return {
      type: 'hilly',
      slope: 15 + Math.random() * 20,
      elevation: 1500 + Math.random() * 2000,
      description: 'Mountainous terrain in the Himalayan region. Steep slopes require careful recharge structure placement.'
    };
  }
  
  // Coastal regions
  if ((lng < 72 && lat < 22) || (lng > 80 && lat > 8 && lat < 24)) {
    return {
      type: 'coastal',
      slope: 1 + Math.random() * 3,
      elevation: 10 + Math.random() * 50,
      description: 'Coastal plain with low relief. Generally suitable for recharge but consider seawater intrusion.'
    };
  }
  
  // Thar desert
  if (lat > 23 && lat < 30 && lng > 68 && lng < 76) {
    return {
      type: 'desert',
      slope: 2 + Math.random() * 5,
      elevation: 200 + Math.random() * 300,
      description: 'Arid desert region with limited rainfall. Rainwater storage is crucial.'
    };
  }
  
  // Peninsular plateau
  if (lat < 24 && lng > 72 && lng < 88) {
    return {
      type: 'plateau',
      slope: 3 + Math.random() * 8,
      elevation: 500 + Math.random() * 800,
      description: 'Plateau region with undulating terrain. Suitable for recharge with moderate slope management.'
    };
  }
  
  // Default - plains
  return {
    type: 'plain',
    slope: 1 + Math.random() * 3,
    elevation: 100 + Math.random() * 200,
    description: 'Indo-Gangetic plain with flat to gently undulating terrain. Highly suitable for recharge structures.'
  };
}

export async function fetchGISData(
  lat: number,
  lng: number,
  district?: string,
  state?: string
): Promise<GISDataResponse> {
  const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  const cached = getCachedGISData(cacheKey);
  if (cached) {
    return cached;
  }

  // Determine location info
  const resolvedDistrict = district || 'Unknown District';
  const resolvedState = state || 'Unknown State';
  
  // Get aquifer info
  const aquifer = determineAquiferType(lat, lng, resolvedState);
  
  // Get groundwater level
  const groundwater = determineGroundwaterLevel(resolvedDistrict, resolvedState);
  
  // Determine soil type
  const soil = determineSoilType(lat, lng, resolvedDistrict);
  
  // Determine topography
  const topography = determineTopography(lat, lng);
  
  // Calculate recharge potential
  const recharge = determineRechargePotential(lat, lng, soil.name, topography);
  
  const result: GISDataResponse = {
    coordinates: { lat, lng },
    location: {
      district: resolvedDistrict,
      state: resolvedState
    },
    aquifer,
    groundwater,
    recharge,
    soil,
    topography,
    lastUpdated: new Date().toISOString()
  };
  
  setCachedGISData(cacheKey, result);
  return result;
}

export async function fetchAquiferInfo(lat: number, lng: number, state?: string): Promise<AquiferInfo> {
  const gisData = await fetchGISData(lat, lng);
  return gisData.aquifer;
}

export async function fetchGroundwaterLevel(lat: number, lng: number, district?: string): Promise<GroundwaterLevel> {
  const gisData = await fetchGISData(lat, lng, district);
  return gisData.groundwater;
}

export async function fetchRechargePotential(lat: number, lng: number): Promise<RechargePotential> {
  const gisData = await fetchGISData(lat, lng);
  return gisData.recharge;
}

export default {
  fetchGISData,
  fetchAquiferInfo,
  fetchGroundwaterLevel,
  fetchRechargePotential
};
