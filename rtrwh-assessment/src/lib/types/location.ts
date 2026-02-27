// Location Intelligence Types

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface LocationAddress {
  address: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

export interface LocationAnalysis {
  coordinates: LocationCoordinates;
  address: LocationAddress;
  rainfallZone: string;
  rainfallZoneInfo: {
    zone: string;
    zoneHi: string;
    range: string;
  };
  isUrban: boolean;
  urbanClassification?: 'metro' | 'city' | 'town';
  topography: 'plain' | 'hilly' | 'plateau' | 'coastal' | 'desert';
  soilType: string;
  climateZone: string;
  altitude: number;
  distanceToWaterBody: number;
}

export interface LocationSearchResult {
  displayName: string;
  displayNameHi: string;
  address: LocationAddress;
  coordinates: LocationCoordinates;
  importance: number;
}

export interface LocationDataResponse {
  coordinates: LocationCoordinates;
  address: LocationAddress;
  analysis: LocationAnalysis;
  nearbyDistricts: string[];
  lastUpdated: string;
}

export interface GeocodingResponse {
  results: LocationSearchResult[];
  status: 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST';
}

export interface RainfallZone {
  id: string;
  name: string;
  nameHi: string;
  states: string[];
  avgAnnualRainfall: number;
  description: string;
}

export interface ClimateZone {
  id: string;
  name: string;
  nameHi: string;
  states: string[];
  characteristics: string;
  temperature: {
    min: number;
    max: number;
  };
}
