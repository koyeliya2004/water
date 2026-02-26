import type { FeasibilityResult } from '../types';

export const RUNOFF_COEFFICIENTS = {
  flat: { min: 0.7, max: 0.8, default: 0.75 },
  sloped: { min: 0.8, max: 0.9, default: 0.85 }
};

export const RAINFALL_DATA: Record<string, number> = {
  'Delhi': 611,
  'New Delhi': 611,
  'Mumbai': 2422,
  'Chennai': 1443,
  'Kolkata': 1648,
  'Bangalore': 970,
  'Bengaluru': 970,
  'Hyderabad': 813,
  'Pune': 722,
  'Ahmedabad': 721,
  'Jaipur': 556,
  'Lucknow': 969,
  'Kanpur': 889,
  'Nagpur': 1045,
  'Indore': 1005,
  'Thane': 2422,
  'Bhopal': 1114,
  'Visakhapatnam': 1202,
  'Patna': 1193,
  'Vadodara': 927,
  'Ghaziabad': 700,
  'Ludhiana': 680,
  'Agra': 695,
  'Nashik': 1030,
  'Faridabad': 611,
  ' Meerut': 850,
  'Rajkot': 614,
  'Varanasi': 1016,
  'Srinagar': 710,
  'Aurangabad': 725,
  'Dhanbad': 1278,
  'Amritsar': 670,
  'Navi Mumbai': 2422,
  'Allahabad': 1000,
  'Ranchi': 1326,
  'Howrah': 1648,
  'Coimbatore': 689,
  'Jabalpur': 1219,
  'Gwalior': 970,
  'Vijayawada': 1061,
  'Jodhpur': 318,
  'Madurai': 847,
  'Raipur': 1277,
  'Kota': 730,
  'Guwahati': 1739,
  'Chandigarh': 1059,
  'Solapur': 612,
  'Hubli-Dharwad': 838,
  'Bareilly': 982,
  'Moradabad': 925,
  'Mysore': 780,
  'Gurgaon': 611,
  'Aligarh': 760,
  'Jalandhar': 661,
  'Tiruchirappalli': 872,
  'Bhubaneswar': 1449,
  'Salem': 987,
  'Mira-Bhayandar': 2422,
  'Warangal': 972,
  'Thiruvananthapuram': 1823,
  'Bhiwandi': 2422,
  'Saharanpur': 998,
  'Guntur': 911,
  'Amravati': 933,
  'Bikaner': 281,
  'Noida': 700,
  'default': 1000
};

export const DAILY_WATER_PER_PERSON = 135;

export function getRainfallForLocation(location: string): number {
  const normalizedLocation = location.trim().toLowerCase();
  
  for (const [city, rainfall] of Object.entries(RAINFALL_DATA)) {
    if (normalizedLocation.includes(city.toLowerCase()) || city.toLowerCase().includes(normalizedLocation)) {
      return rainfall;
    }
  }
  
  for (const [city, rainfall] of Object.entries(RAINFALL_DATA)) {
    const cityParts = city.toLowerCase().split(' ');
    for (const part of cityParts) {
      if (normalizedLocation.includes(part) && part.length > 3) {
        return rainfall;
      }
    }
  }
  
  return RAINFALL_DATA.default;
}

export function calculateRainwaterPotential(
  roofArea: number,
  annualRainfall: number,
  roofType: 'flat' | 'sloped'
): number {
  const runoffCoeff = RUNOFF_COEFFICIENTS[roofType].default;
  return roofArea * annualRainfall * runoffCoeff;
}

export function calculateFeasibility(
  roofArea: number,
  openSpace: number,
  dwellers: number,
  waterPotential: number,
  roofType: 'flat' | 'sloped'
): FeasibilityResult {
  const runoffCoefficient = RUNOFF_COEFFICIENTS[roofType].default;
  const dailyTotalDemand = dwellers * DAILY_WATER_PER_PERSON;
  const annualDemand = dailyTotalDemand * 365;
  const supplyRatio = waterPotential / annualDemand;
  const dailyWaterPerPerson = DAILY_WATER_PER_PERSON;
  
  let score = 0;
  
  const waterScore = Math.min(35, (waterPotential / 150000) * 35);
  score += waterScore;
  
  const roofScore = Math.min(20, (roofArea / 150) * 20);
  score += roofScore;
  
  const spaceScore = Math.min(20, (openSpace / 30) * 20);
  score += spaceScore;
  
  const efficiencyScore = Math.min(25, supplyRatio * 25);
  score += efficiencyScore;
  
  let rating: 'Excellent' | 'Good' | 'Moderate' | 'Poor';
  if (score >= 75) {
    rating = 'Excellent';
  } else if (score >= 55) {
    rating = 'Good';
  } else if (score >= 35) {
    rating = 'Moderate';
  } else {
    rating = 'Poor';
  }
  
  return {
    score: Math.round(score),
    rating,
    annualWaterPotential: Math.round(waterPotential),
    runoffCoefficient,
    dailyWaterPerPerson,
    dailyTotalDemand,
    supplyRatio: Math.round(supplyRatio * 100) / 100
  };
}
