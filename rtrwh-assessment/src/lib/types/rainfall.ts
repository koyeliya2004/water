// Enhanced Rainfall Data Types - IMD Integration

export interface MonthlyRainfall {
  month: number;
  monthName: string;
  monthNameHi: string;
  rainfall: number; // mm
  normalRainfall: number; // mm (30-year average)
  percentage: number; // % of annual
  deviation: number; // % from normal
  isMonsoon: boolean;
}

export interface SeasonalRainfall {
  season: 'pre-monsoon' | 'monsoon' | 'post-monsoon' | 'winter';
  seasonName: string;
  seasonNameHi: string;
  rainfall: number; // mm
  normalRainfall: number; // mm
  percentage: number; // % of annual
  days: number; // rainy days
}

export interface RainfallIntensity {
  category: 'very-light' | 'light' | 'moderate' | 'heavy' | 'very-heavy' | 'extreme';
  categoryHi: string;
  range: string;
  percentage: number; // % of total rainfall
  daysPerYear: number;
}

export interface DroughtProbability {
  mild: number; // probability %
  moderate: number;
  severe: number;
  lastDroughtYear?: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface ExceedanceProbability {
  rainfall: number; // mm
  probability: number; // % chance per year
}

export interface RainfallTrend {
  period: string;
  change: number; // mm per decade
  trend: 'increasing' | 'decreasing' | 'stable';
  significance: 'high' | 'medium' | 'low';
}

export interface HistoricalRainfallRecord {
  year: number;
  annualRainfall: number; // mm
  normalRainfall: number; // mm
  deviation: number; // % from normal
  monsoonRainfall: number; // mm
  isDrought: boolean;
  isExcess: boolean;
}

export interface DistrictRainfall {
  district: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  annual: number; // mm
  monthly: MonthlyRainfall[];
  seasonal: SeasonalRainfall[];
  intensity: RainfallIntensity[];
  drought: DroughtProbability;
  trend: RainfallTrend;
  lastUpdated: string;
}

export interface RainfallDataResponse {
  location: {
    district: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  annual: number;
  monthly: MonthlyRainfall[];
  seasonal: SeasonalRainfall[];
  intensity: RainfallIntensity[];
  drought: DroughtProbability;
  trend: RainfallTrend;
  historical: HistoricalRainfallRecord[];
  lastUpdated: string;
}

export type RainfallZone = 'excess' | 'high' | 'moderate' | 'low' | 'deficient' | 'scarcity';

export interface RainfallZoneInfo {
  zone: RainfallZone;
  zoneHi: string;
  range: string;
  description: string;
  color: string;
}
