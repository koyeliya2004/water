// Weather API Types - OpenWeather Integration

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  cloudiness: number;
  visibility: number;
  precipitation: number;
  condition: string;
  conditionDescription: string;
  icon: string;
  sunrise: number;
  sunset: number;
}

export interface WeatherForecast {
  date: string;
  timestamp: number;
  temperature: {
    min: number;
    max: number;
    day: number;
    night: number;
  };
  feelsLike: {
    day: number;
    night: number;
  };
  pressure: number;
  humidity: number;
  windSpeed: number;
  windGust: number;
  cloudiness: number;
  precipitation: {
    probability: number;
    amount: number;
    rain: number;
    snow: number;
  };
  condition: string;
  conditionDescription: string;
  icon: string;
  uvIndex: number;
  harvestingPotential: number;
}

export interface HourlyForecast {
  timestamp: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitation: {
    probability: number;
    amount: number;
  };
  condition: string;
  icon: string;
}

export interface WeatherAlert {
  id: string;
  type: 'rain' | 'storm' | 'heat' | 'cold' | 'flood' | 'drought';
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  startTime: number;
  endTime: number;
  relevantToHarvesting: boolean;
}

export interface HistoricalRainfall {
  date: string;
  rainfall: number;
  temperature: number;
  humidity: number;
}

export interface WeatherDataResponse {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: WeatherForecast[];
  alerts: WeatherAlert[];
  lastUpdated: string;
}

export interface HarvestingForecast {
  date: string;
  potential: number;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}
