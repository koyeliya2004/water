// Static Aquifer Data - CGWB Reference Data
import type { AquiferZone, GroundwaterLevel } from '@/lib/types/aquifer';

export const AQUIFER_ZONES: AquiferZone[] = [
  {
    id: 'indo-gangetic',
    name: 'Indo-Gangetic Alluvial Basin',
    type: 'alluvial',
    states: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Bihar', 'West Bengal', 'Delhi', 'Uttarakhand'],
    districts: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Firozpur', 'Bathinda', 'Kapurthala', 'Moga'],
    avgYield: 15,
    depthRange: '30-200m'
  },
  {
    id: 'gujarat-alluvial',
    name: 'Gujarat Alluvial Basin',
    type: 'alluvial',
    states: ['Gujarat'],
    districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
    avgYield: 12,
    depthRange: '50-150m'
  },
  {
    id: 'brahmputra',
    name: 'Brahmaputra Alluvial Basin',
    type: 'alluvial',
    states: ['Assam', 'Arunachal Pradesh'],
    districts: ['Guwahati', 'Dibrugarh', 'Jorhat', 'Tezpur', 'Silchar'],
    avgYield: 18,
    depthRange: '20-100m'
  },
  {
    id: 'peninsular-hard-rock',
    name: 'Peninsular Hard Rock Aquifer',
    type: 'hard-rock',
    states: ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Andhra Pradesh'],
    districts: ['Mumbai', 'Pune', 'Nagpur', 'Bangalore', 'Hyderabad', 'Chennai', 'Coimbatore'],
    avgYield: 3,
    depthRange: '30-150m'
  },
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh Hard Rock',
    type: 'hard-rock',
    states: ['Madhya Pradesh'],
    districts: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
    avgYield: 4,
    depthRange: '30-120m'
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan Basin',
    type: 'sedimentary',
    states: ['Rajasthan'],
    districts: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'],
    avgYield: 8,
    depthRange: '50-250m'
  },
  {
    id: 'kerala',
    name: 'Kerala Coastal Alluvium',
    type: 'coastal',
    states: ['Kerala'],
    districts: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
    avgYield: 10,
    depthRange: '20-80m'
  },
  {
    id: 'odisha',
    name: 'Odisha Coastal',
    type: 'coastal',
    states: ['Odisha'],
    districts: ['Bhubaneswar', 'Cuttack', 'Berhampur', 'Sambalpur', 'Rourkela'],
    avgYield: 8,
    depthRange: '30-100m'
  }
];

export const GROUNDWATER_DATA: Record<string, GroundwaterLevel> = {
  'delhi': {
    preMonsoon: 25,
    postMonsoon: 18,
    annual: 22,
    trend: 'depleting',
    trendRate: -0.4,
    trendPeriod: '2015-2024',
    lastUpdated: '2024-01',
    dataQuality: 'good'
  },
  'mumbai': {
    preMonsoon: 8,
    postMonsoon: 4,
    annual: 6,
    trend: 'stable',
    trendRate: 0.05,
    trendPeriod: '2015-2024',
    lastUpdated: '2024-01',
    dataQuality: 'good'
  },
  'bangalore': {
    preMonsoon: 18,
    postMonsoon: 12,
    annual: 15,
    trend: 'depleting',
    trendRate: -0.6,
    trendPeriod: '2015-2024',
    lastUpdated: '2024-01',
    dataQuality: 'good'
  },
  'hyderabad': {
    preMonsoon: 22,
    postMonsoon: 15,
    annual: 19,
    trend: 'depleting',
    trendRate: -0.3,
    trendPeriod: '2015-2024',
    lastUpdated: '2024-01',
    dataQuality: 'good'
  },
  'chennai': {
    preMonsoon: 12,
    postMonsoon: 6,
    annual: 9,
    trend: 'stable',
    trendRate: 0.1,
    trendPeriod: '2015-2024',
    lastUpdated: '2024-01',
    dataQuality: 'good'
  },
  'kolkata': {
    preMonsoon: 6,
    postMonsoon: 3,
    annual: 4.5,
    trend: 'rising',
    trendRate: 0.15,
    trendPeriod: '2015-2024',
    lastUpdated: '2024-01',
    dataQuality: 'good'
  },
  'pune': {
    preMonsoon: 15,
    postMonsoon: 10,
    annual: 12.5,
    trend: 'depleting',
    trendRate: -0.25,
    trendPeriod: '2015-2024',
    lastUpdated: '2024-01',
    dataQuality: 'good'
  },
  'ahmedabad': {
    preMonsoon: 20,
    postMonsoon: 14,
    annual: 17,
    trend: 'stable',
    trendRate: -0.1,
    trendPeriod: '2015-2024',
    lastUpdated: '2024-01',
    dataQuality: 'good'
  },
  'jaipur': {
    preMonsoon: 28,
    postMonsoon: 22,
    annual: 25,
    trend: 'depleting',
    trendRate: -0.35,
    trendPeriod: '2015-2024',
    lastUpdated: '2024-01',
    dataQuality: 'good'
  },
  'chandigarh': {
    preMonsoon: 14,
    postMonsoon: 8,
    annual: 11,
    trend: 'stable',
    trendRate: -0.05,
    trendPeriod: '2015-2024',
    lastUpdated: '2024-01',
    dataQuality: 'good'
  }
};

export const SOIL_DATA = [
  {
    name: 'Alluvial Soil',
    code: 'AL',
    infiltrationRate: 25,
    waterRetention: 35,
    suitability: 'excellent',
    regions: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Bihar', 'West Bengal', 'Delhi']
  },
  {
    name: 'Black Clay Soil (Regur)',
    code: 'BC',
    infiltrationRate: 5,
    waterRetention: 50,
    suitability: 'moderate',
    regions: ['Maharashtra', 'Madhya Pradesh', 'Gujarat', 'Telangana']
  },
  {
    name: 'Red Loamy Soil',
    code: 'RL',
    infiltrationRate: 15,
    waterRetention: 30,
    suitability: 'good',
    regions: ['Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Odisha']
  },
  {
    name: 'Laterite Soil',
    code: 'LT',
    infiltrationRate: 20,
    waterRetention: 25,
    suitability: 'good',
    regions: ['Kerala', 'Goa', 'Maharashtra (Coastal)', 'Assam']
  },
  {
    name: 'Sandy Soil',
    code: 'SY',
    infiltrationRate: 40,
    waterRetention: 15,
    suitability: 'excellent',
    regions: ['Rajasthan', 'Gujarat (Coastal)', 'Odisha (Coastal)']
  },
  {
    name: 'Mountain Soil',
    code: 'MT',
    infiltrationRate: 30,
    waterRetention: 20,
    suitability: 'good',
    regions: ['Himachal Pradesh', 'Uttarakhand', 'Jammu & Kashmir']
  }
];

export const RECHARGE_ZONES = [
  {
    zone: 'excellent',
    rechargePotential: 'Very High',
    recommendedStructures: ['Recharge Pit', 'Recharge Trench', 'Percolation Tank', 'Check Dam']
  },
  {
    zone: 'good',
    rechargePotential: 'High',
    recommendedStructures: ['Recharge Pit', 'Recharge Trench', 'Soak Pit']
  },
  {
    zone: 'moderate',
    rechargePotential: 'Moderate',
    recommendedStructures: ['Recharge Shaft', 'Borehole Recharge', 'Percolation Well']
  },
  {
    zone: 'poor',
    rechargePotential: 'Low',
    recommendedStructures: ['Recharge Shaft', 'Deep Borehole Recharge']
  }
];
