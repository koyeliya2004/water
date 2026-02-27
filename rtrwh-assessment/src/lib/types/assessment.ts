// Enhanced Assessment Types - Phase 2 Integration

import type { 
  WeatherDataResponse, 
  HarvestingForecast 
} from './weather';
import type { 
  GISDataResponse 
} from './aquifer';
import type { 
  RainfallDataResponse 
} from './rainfall';
import type { 
  LocationAnalysis 
} from './location';

// Extended Assessment Input with Phase 2 data
export interface EnhancedAssessmentInput {
  // Basic Input (from Phase 1)
  name: string;
  location: {
    address: string;
    city?: string;
    state?: string;
    district?: string;
    coordinates?: { lat: number; lng: number };
    annualRainfall?: number;
  };
  roofArea: number;
  roofType: 'flat' | 'sloped';
  openSpace: number;
  dwellers: number;
  
  // Phase 2 Enhanced Input
  includeWeather?: boolean;
  includeAquifer?: boolean;
  includeHistoricalRainfall?: boolean;
}

// Weather Integration Results
export interface WeatherIntegration {
  enabled: boolean;
  currentWeather?: WeatherDataResponse['current'];
  forecast?: WeatherDataResponse['daily'];
  alerts?: WeatherDataResponse['alerts'];
  harvestingPotential?: HarvestingForecast[];
  lastUpdated?: string;
}

// GIS/Aquifer Integration Results
export interface AquiferIntegration {
  enabled: boolean;
  data?: GISDataResponse;
  lastUpdated?: string;
}

// Enhanced Rainfall Analysis
export interface RainfallIntegration {
  enabled: boolean;
  data?: RainfallDataResponse;
  historicalAnalysis?: {
    avgAnnualRainfall: number;
    trend: string;
    droughtRisk: string;
  };
  lastUpdated?: string;
}

// Location Intelligence
export interface LocationIntelligence {
  analysis?: LocationAnalysis;
  lastUpdated?: string;
}

// Extended Feasibility Result
export interface EnhancedFeasibilityResult {
  // Phase 1 results
  score: number;
  rating: 'Excellent' | 'Good' | 'Moderate' | 'Poor';
  annualWaterPotential: number;
  runoffCoefficient: number;
  dailyWaterPerPerson: number;
  dailyTotalDemand: number;
  supplyRatio: number;
  
  // Phase 2 enhanced results
  weatherAdjustedPotential?: number;
  seasonalDistribution?: {
    monsoon: number;
    postMonsoon: number;
    winter: number;
    preMonsoon: number;
  };
  reliabilityScore?: number;
  riskFactors?: {
    drought: number;
    flood: number;
    contamination: number;
  };
}

// Enhanced Structure Recommendation
export interface EnhancedStructureRecommendation {
  type: 'storage_tank' | 'recharge_pit' | 'recharge_trench' | 'recharge_shaft' | 'percolation_tank' | 'check_dam';
  name: string;
  nameHi: string;
  dimensions: {
    length?: number;
    width?: number;
    depth?: number;
    diameter?: number;
    capacity: number;
  };
  suitability: 'high' | 'medium' | 'low';
  description: string;
  descriptionHi: string;
  benefits: string[];
  benefitsHi: string[];
  
  // Phase 2 enhancements
  optimalPlacement?: string;
  estimatedRecharge?: number;
  maintenanceNotes?: string;
  maintenanceNotesHi?: string;
}

// Complete Enhanced Assessment Result
export interface EnhancedAssessmentResult {
  id: string;
  input: EnhancedAssessmentInput;
  
  // Phase 1 Results
  feasibility: EnhancedFeasibilityResult;
  structures: EnhancedStructureRecommendation[];
  
  // Phase 2 Results
  weather?: WeatherIntegration;
  aquifer?: AquiferIntegration;
  rainfall?: RainfallIntegration;
  location?: LocationIntelligence;
  
  // Summary
  summary: {
    totalWaterPotential: number;
    recommendedStorageCapacity: number;
    estimatedAnnualSavings: number;
    paybackPeriod: number;
    environmentalImpact: {
      waterConserved: number;
      groundwaterRecharged: number;
      carbonSaved: number;
    };
  };
  
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  
  timestamp: string;
}

// API Response Types
export interface AssessmentApiResponse {
  success: boolean;
  data?: EnhancedAssessmentResult;
  error?: string;
  warnings?: string[];
}
