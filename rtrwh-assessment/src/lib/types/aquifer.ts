// Aquifer & GIS Data Types - CGWB Integration

export type AquiferType = 'alluvial' | 'hard-rock' | 'sedimentary' | 'volcanic' | 'coastal' | 'unknown';

export interface AquiferInfo {
  type: AquiferType;
  name: string;
  description: string;
  yield: number; // liters per second
  yieldUnit: 'lps' | 'lpm';
  specificCapacity: number;
  specificCapacityUnit: 'lpm/m' | 'lpm/m²';
  transmissivity: number;
  transmissivityUnit: 'm²/day';
  depthRange: {
    min: number;
    max: number;
  };
  suitability: 'excellent' | 'good' | 'moderate' | 'poor';
}

export interface GroundwaterLevel {
  preMonsoon: number; // meters below ground level
  postMonsoon: number;
  annual: number;
  trend: 'rising' | 'depleting' | 'stable';
  trendRate: number; // meters per year
  trendPeriod: string;
  lastUpdated: string;
  dataQuality: 'good' | 'fair' | 'poor';
}

export interface RechargePotential {
  index: number; // 0-100
  category: 'excellent' | 'good' | 'moderate' | 'poor' | 'very-poor';
  score: number;
  factors: {
    soil: number;
    slope: number;
    vegetation: number;
    geology: number;
  };
  recommendedStructures: string[];
  estimatedRecharge: number; // million liters per year
}

export interface SoilType {
  name: string;
  code: string;
  infiltrationRate: number; // mm/hour
  waterRetention: number; // percentage
  suitability: 'excellent' | 'good' | 'moderate' | 'poor';
  description: string;
}

export interface Topography {
  type: 'plain' | 'hilly' | 'plateau' | 'coastal' | 'desert';
  slope: number; // percentage
  elevation: number; // meters
  description: string;
}

export interface GISDataResponse {
  coordinates: {
    lat: number;
    lng: number;
  };
  location: {
    district: string;
    state: string;
    block?: string;
  };
  aquifer: AquiferInfo;
  groundwater: GroundwaterLevel;
  recharge: RechargePotential;
  soil: SoilType;
  topography: Topography;
  lastUpdated: string;
}

export interface AquiferZone {
  id: string;
  name: string;
  type: AquiferType;
  states: string[];
  districts: string[];
  avgYield: number;
  depthRange: string;
}
