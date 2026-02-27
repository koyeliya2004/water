// Weather Service - OpenWeather API Integration
import type { 
  WeatherDataResponse, 
  CurrentWeather, 
  WeatherForecast, 
  HourlyForecast, 
  WeatherAlert,
  HarvestingForecast 
} from '@/lib/types/weather';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface OpenWeatherCurrentResponse {
  coord: { lon: number; lat: number };
  weather: Array<{ id: number; main: string; description: string; icon: string }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: { speed: number; deg: number; gust?: number };
  clouds: { all: number };
  rain?: { '1h'?: number; '3h'?: number };
  snow?: { '1h'?: number; '3h'?: number };
  dt: number;
  sys: { type: number; id: number; country: string; sunrise: number; sunset: number };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

interface OpenWeatherForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
      sea_level?: number;
      grnd_level?: number;
    };
    weather: Array<{ id: number; main: string; description: string; icon: string }>;
    clouds: { all: number };
    wind: { speed: number; gust: number; deg: number };
    visibility: number;
    pop: number;
    rain?: { '3h'?: number };
    snow?: { '3h'?: number };
    sys: { pod: string };
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: { lat: number; lon: number };
    country: string;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

interface OpenWeatherOneCallResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust?: number;
    weather: Array<{ id: number; main: string; description: string; icon: string }>;
    rain?: { '1h'?: number };
  };
  hourly: Array<{
    dt: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust?: number;
    weather: Array<{ id: number; main: string; description: string; icon: string }>;
    pop: number;
    rain?: { '1h'?: number };
  }>;
  daily: Array<{
    dt: number;
    sunrise: number;
    sunset: number;
    moonrise: number;
    moonset: number;
    moon_phase: number;
    summary: string;
    temp: {
      day: number;
      min: number;
      max: number;
      night: number;
      eve: number;
      morn: number;
    };
    feels_like: { day: number; night: number; eve: number; morn: number };
    pressure: number;
    humidity: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust?: number;
    weather: Array<{ id: number; main: string; description: string; icon: string }>;
    clouds: number;
    pop: number;
    rain?: number;
    snow?: number;
    uvi: number;
  }>;
  alerts: Array<{
    sender_name: string;
    event: string;
    start: number;
    end: number;
    description: string;
    tags: string[];
  }>;
}

// Cache for weather data
const weatherCache = new Map<string, { data: WeatherDataResponse; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

function getCachedData(key: string): WeatherDataResponse | null {
  const cached = weatherCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: WeatherDataResponse): void {
  weatherCache.set(key, { data, timestamp: Date.now() });
}

// Convert OpenWeather data to our format
function parseCurrentWeather(data: OpenWeatherCurrentResponse): CurrentWeather {
  return {
    temperature: Math.round(data.main.temp - 273.15),
    feelsLike: Math.round(data.main.feels_like - 273.15),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: Math.round(data.wind.speed * 3.6 * 10) / 10, // m/s to km/h
    windDirection: data.wind.deg,
    cloudiness: data.clouds.all,
    visibility: data.visibility,
    precipitation: (data.rain?.['1h'] || data.rain?.['3h'] || 0) * 10,
    condition: data.weather[0]?.main || 'Unknown',
    conditionDescription: data.weather[0]?.description || '',
    icon: data.weather[0]?.icon || '01d',
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset
  };
}

function parseHourlyForecast(data: OpenWeatherOneCallResponse['hourly'][0]): HourlyForecast {
  return {
    timestamp: data.dt * 1000,
    temperature: Math.round(data.temp - 273.15),
    feelsLike: Math.round(data.feels_like - 273.15),
    humidity: data.humidity,
    precipitation: {
      probability: Math.round(data.pop * 100),
      amount: (data.rain?.['1h'] || 0) * 10
    },
    condition: data.weather[0]?.main || 'Unknown',
    icon: data.weather[0]?.icon || '01d'
  };
}

function parseDailyForecast(data: OpenWeatherOneCallResponse['daily'][0], roofArea: number = 100): WeatherForecast {
  const precipitationAmount = data.rain || 0;
  const precipitationProbability = Math.round(data.pop * 100);
  
  // Calculate harvesting potential in liters
  const harvestingPotential = calculateHarvestingPotential(precipitationAmount, precipitationProbability, roofArea);
  
  return {
    date: new Date(data.dt * 1000).toISOString().split('T')[0],
    timestamp: data.dt * 1000,
    temperature: {
      min: Math.round(data.temp.min - 273.15),
      max: Math.round(data.temp.max - 273.15),
      day: Math.round(data.temp.day - 273.15),
      night: Math.round(data.temp.night - 273.15)
    },
    feelsLike: {
      day: Math.round(data.feels_like.day - 273.15),
      night: Math.round(data.feels_like.night - 273.15)
    },
    pressure: data.pressure,
    humidity: data.humidity,
    windSpeed: Math.round(data.wind_speed * 3.6 * 10) / 10,
    windGust: Math.round((data.wind_gust || 0) * 3.6 * 10) / 10,
    cloudiness: data.clouds,
    precipitation: {
      probability: precipitationProbability,
      amount: precipitationAmount,
      rain: precipitationAmount,
      snow: data.snow || 0
    },
    condition: data.weather[0]?.main || 'Unknown',
    conditionDescription: data.weather[0]?.description || '',
    icon: data.weather[0]?.icon || '01d',
    uvIndex: data.uvi,
    harvestingPotential
  };
}

function parseWeatherAlerts(data: OpenWeatherOneCallResponse['alerts']): WeatherAlert[] {
  if (!data || data.length === 0) return [];
  
  return data.map((alert, index) => {
    const relevantToHarvesting = alert.event.toLowerCase().includes('rain') || 
                                   alert.event.toLowerCase().includes('storm') ||
                                   alert.event.toLowerCase().includes('flood') ||
                                   alert.event.toLowerCase().includes('drought');
    
    return {
      id: `alert-${index}`,
      type: mapAlertType(alert.event),
      severity: mapAlertSeverity(alert.event),
      title: alert.event,
      titleHi: getHindiAlertTitle(alert.event),
      description: alert.description,
      descriptionHi: getHindiAlertDescription(alert.event),
      startTime: alert.start * 1000,
      endTime: alert.end * 1000,
      relevantToHarvesting
    };
  });
}

function mapAlertType(event: string): WeatherAlert['type'] {
  const eventLower = event.toLowerCase();
  if (eventLower.includes('rain') || eventLower.includes('storm')) return 'rain';
  if (eventLower.includes('flood')) return 'flood';
  if (eventLower.includes('heat')) return 'heat';
  if (eventLower.includes('cold') || eventLower.includes('freeze')) return 'cold';
  if (eventLower.includes('drought')) return 'drought';
  return 'rain';
}

function mapAlertSeverity(event: string): WeatherAlert['severity'] {
  const eventLower = event.toLowerCase();
  if (eventLower.includes('extreme') || eventLower.includes('severe')) return 'severe';
  if (eventLower.includes('moderate')) return 'moderate';
  return 'minor';
}

function getHindiAlertTitle(event: string): string {
  const titles: Record<string, string> = {
    'Rain': 'वर्षा',
    'Storm': 'तूफान',
    'Heat Wave': 'लू',
    'Cold Wave': 'शीत लहर',
    'Flood': 'बाढ़',
    'Drought': 'सूखा'
  };
  return titles[event] || event;
}

function getHindiAlertDescription(event: string): string {
  const descriptions: Record<string, string> = {
    'Rain': 'वर्षा की संभावना है। वर्षा जल संग्रहण के लिए अनुकूल स्थिति।',
    'Storm': 'तूफान की चेतावनी। सुरक्षा सावधानी बरतें।',
    'Heat Wave': 'लू की चेतावनी। पर्याप्त पानी पिएं।',
    'Cold Wave': 'शीत लहर की चेतावनी। गर्म रहें।',
    'Flood': 'बाढ़ की चेतावनी। सावधानी बरतें।',
    'Drought': 'सूखे की स्थिति। जल संरक्षण पर ध्यान दें।'
  };
  return descriptions[event] || event;
}

function calculateHarvestingPotential(precipitationAmount: number, probability: number, roofArea: number): number {
  // Basic formula: precipitation (mm) * roof area (m²) * probability factor * runoff coefficient
  const runoffCoefficient = 0.8;
  const probabilityFactor = probability / 100;
  return Math.round(precipitationAmount * roofArea * runoffCoefficient * probabilityFactor);
}

export async function fetchWeatherData(
  lat: number, 
  lng: number,
  roofArea: number = 100
): Promise<WeatherDataResponse> {
  const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    return cached;
  }

  if (!OPENWEATHER_API_KEY) {
    console.warn('OpenWeather API key not configured, using fallback data');
    return getFallbackWeatherData(lat, lng);
  }

  try {
    // Use One Call API 3.0 for comprehensive data
    const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&exclude=minutely&appid=${OPENWEATHER_API_KEY}`;
    
    const response = await fetch(oneCallUrl, {
      next: { revalidate: 30 * 60 } // Cache for 30 minutes
    });

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data: OpenWeatherOneCallResponse = await response.json();

    const result: WeatherDataResponse = {
      current: {
        temperature: Math.round(data.current.temp - 273.15),
        feelsLike: Math.round(data.current.feels_like - 273.15),
        humidity: data.current.humidity,
        pressure: data.current.pressure,
        windSpeed: Math.round(data.current.wind_speed * 3.6 * 10) / 10,
        windDirection: data.current.wind_deg,
        cloudiness: data.current.clouds,
        visibility: data.current.visibility,
        precipitation: (data.current.rain?.['1h'] || 0) * 10,
        condition: data.current.weather[0]?.main || 'Unknown',
        conditionDescription: data.current.weather[0]?.description || '',
        icon: data.current.weather[0]?.icon || '01d',
        sunrise: data.current.sunrise,
        sunset: data.current.sunset
      },
      hourly: data.hourly.slice(0, 24).map(parseHourlyForecast),
      daily: data.daily.slice(0, 7).map(day => parseDailyForecast(day, roofArea)),
      alerts: parseWeatherAlerts(data.alerts),
      lastUpdated: new Date().toISOString()
    };

    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return getFallbackWeatherData(lat, lng);
  }
}

export async function fetchCurrentWeather(lat: number, lng: number): Promise<CurrentWeather | null> {
  if (!OPENWEATHER_API_KEY) {
    return getFallbackCurrentWeather();
  }

  try {
    const url = `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}`;
    const response = await fetch(url, { next: { revalidate: 15 * 60 } });
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data: OpenWeatherCurrentResponse = await response.json();
    return parseCurrentWeather(data);
  } catch (error) {
    console.error('Error fetching current weather:', error);
    return null;
  }
}

export async function fetch7DayForecast(lat: number, lng: number, roofArea: number = 100): Promise<WeatherForecast[]> {
  const weatherData = await fetchWeatherData(lat, lng, roofArea);
  return weatherData.daily;
}

export function generateHarvestingForecast(
  forecast: WeatherForecast[],
  roofArea: number = 100
): HarvestingForecast[] {
  return forecast.map(day => {
    const potential = day.harvestingPotential;
    let confidence: 'high' | 'medium' | 'low';
    let reason: string;

    if (day.precipitation.probability >= 70) {
      confidence = 'high';
      reason = 'High precipitation probability';
    } else if (day.precipitation.probability >= 40) {
      confidence = 'medium';
      reason = 'Moderate precipitation probability';
    } else {
      confidence = 'low';
      reason = 'Low precipitation probability';
    }

    if (potential > 1000) {
      reason += ', significant rainfall expected';
    } else if (potential > 500) {
      reason += ', moderate rainfall expected';
    } else {
      reason += ', minimal rainfall expected';
    }

    return {
      date: day.date,
      potential,
      confidence,
      reason
    };
  });
}

// Fallback data for when API is unavailable
function getFallbackWeatherData(lat: number, lng: number): WeatherDataResponse {
  const today = new Date();
  const daily: WeatherForecast[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    // Simulate monsoon season pattern (June-September in India)
    const month = date.getMonth();
    const isMonsoon = month >= 5 && month <= 8;
    const baseProbability = isMonsoon ? 70 : 20;
    const randomVariation = Math.random() * 30 - 15;
    const probability = Math.max(0, Math.min(100, baseProbability + randomVariation));
    
    const amount = isMonsoon ? 
      (probability / 100) * 15 + Math.random() * 10 : 
      (probability / 100) * 5;
    
    daily.push({
      date: date.toISOString().split('T')[0],
      timestamp: date.getTime(),
      temperature: {
        min: Math.round(22 + Math.random() * 5),
        max: Math.round(32 + Math.random() * 8),
        day: Math.round(28 + Math.random() * 6),
        night: Math.round(24 + Math.random() * 4)
      },
      feelsLike: {
        day: Math.round(30 + Math.random() * 6),
        night: Math.round(26 + Math.random() * 4)
      },
      pressure: Math.round(1008 + Math.random() * 15),
      humidity: Math.round(60 + Math.random() * 30),
      windSpeed: Math.round(10 + Math.random() * 15),
      windGust: Math.round(15 + Math.random() * 20),
      cloudiness: Math.round(probability),
      precipitation: {
        probability: Math.round(probability),
        amount: Math.round(amount * 10) / 10,
        rain: Math.round(amount * 10) / 10,
        snow: 0
      },
      condition: probability > 60 ? 'Rain' : probability > 30 ? 'Clouds' : 'Clear',
      conditionDescription: probability > 60 ? 'light rain' : probability > 30 ? 'scattered clouds' : 'clear sky',
      icon: probability > 60 ? '10d' : probability > 30 ? '03d' : '01d',
      uvIndex: Math.round(6 + Math.random() * 4),
      harvestingPotential: calculateHarvestingPotential(amount, probability, 100)
    });
  }

  return {
    current: getFallbackCurrentWeather(),
    hourly: [],
    daily,
    alerts: [],
    lastUpdated: new Date().toISOString()
  };
}

function getFallbackCurrentWeather(): CurrentWeather {
  return {
    temperature: 28,
    feelsLike: 30,
    humidity: 65,
    pressure: 1013,
    windSpeed: 12,
    windDirection: 180,
    cloudiness: 40,
    visibility: 10000,
    precipitation: 0,
    condition: 'Clouds',
    conditionDescription: 'scattered clouds',
    icon: '03d',
    sunrise: 6 * 3600,
    sunset: 18 * 3600
  };
}

export default {
  fetchWeatherData,
  fetchCurrentWeather,
  fetch7DayForecast,
  generateHarvestingForecast
};
