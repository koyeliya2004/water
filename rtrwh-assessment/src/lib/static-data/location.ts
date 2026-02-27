// Static Location Data - Rainfall Zones and Climate Zones

export const RAINFALL_ZONES = [
  {
    id: 'excess',
    name: 'Excess Rainfall Zone',
    nameHi: 'अधिक वर्षा',
    avgAnnualRainfall: 2500,
    range: '>2000 mm',
    description: 'Very high rainfall areas, primarily in the northeastern states and coastal regions.',
    states: ['Arunachal Pradesh', 'Meghalaya', 'Assam', 'Sikkim', 'Mizoram', 'Nagaland', 'Tripura', 'Kerala', 'Coastal Karnataka', 'Coastal Maharashtra', 'Coastal Andhra Pradesh', 'Coastal Odisha', 'Andaman & Nicobar Islands'],
    color: '#0ea5e9',
    suitability: 'Excellent',
    recommendedCapacity: 'Large (10000-50000L)'
  },
  {
    id: 'high',
    name: 'High Rainfall Zone',
    nameHi: 'उच्च वर्षा',
    avgAnnualRainfall: 1750,
    range: '1500-2000 mm',
    description: 'High rainfall areas in the Western Ghats, Eastern Ghats, and some interior regions.',
    states: ['Maharashtra', 'Goa', 'Tamil Nadu', 'Coastal Andhra Pradesh', 'Odisha', 'West Bengal', 'Jharkhand', 'Chhattisgarh'],
    color: '#22c55e',
    suitability: 'Very Good',
    recommendedCapacity: 'Medium-Large (5000-20000L)'
  },
  {
    id: 'moderate',
    name: 'Moderate Rainfall Zone',
    nameHi: 'मध्यम वर्षा',
    avgAnnualRainfall: 1250,
    range: '1000-1500 mm',
    description: 'Moderate rainfall covering most of central and northern India.',
    states: ['Uttar Pradesh', 'Madhya Pradesh', 'Gujarat', 'Telangana', 'Inland Karnataka', 'Inland Andhra Pradesh', 'Bihar'],
    color: '#eab308',
    suitability: 'Good',
    recommendedCapacity: 'Medium (3000-10000L)'
  },
  {
    id: 'low',
    name: 'Low Rainfall Zone',
    nameHi: 'कम वर्षा',
    avgAnnualRainfall: 750,
    range: '500-1000 mm',
    description: 'Low rainfall areas in the semi-arid regions of northwest and central India.',
    states: ['Punjab', 'Haryana', 'Rajasthan', 'Inland Gujarat', 'Northern Karnataka', 'Northern Maharashtra'],
    color: '#f97316',
    suitability: 'Moderate',
    recommendedCapacity: 'Small-Medium (2000-5000L)'
  },
  {
    id: 'deficient',
    name: 'Deficient Rainfall Zone',
    nameHi: 'न्यूनतम वर्षा',
    avgAnnualRainfall: 300,
    range: '<500 mm',
    description: 'Arid and semi-arid regions with very low rainfall, mainly in western Rajasthan and Ladakh.',
    states: ['Western Rajasthan', 'Ladakh', 'Kashmir', 'Parts of Gujarat'],
    color: '#ef4444',
    suitability: 'Challenging',
    recommendedCapacity: 'Large Storage (Maximization Focus)'
  }
];

export const CLIMATE_ZONES = [
  {
    id: 'tropical-wet',
    name: 'Tropical Wet',
    nameHi: 'उष्ण कटिबंधीय आर्द्र',
    characteristics: 'Hot and humid throughout the year with no winter',
    temperature: { min: 20, max: 35 },
    states: ['Tamil Nadu', 'Kerala', 'Coastal Karnataka', 'Coastal Maharashtra', 'Coastal Andhra Pradesh', 'Coastal Odisha', 'Andaman & Nicobar Islands', 'Lakshadweep'],
    rainfallPattern: 'Heavy monsoon with dry season'
  },
  {
    id: 'tropical-dry',
    name: 'Tropical Dry',
    nameHi: 'उष्ण कटिबंधीय शुष्क',
    characteristics: 'Hot with moderate rainfall, semi-arid to arid',
    temperature: { min: 20, max: 40 },
    states: ['Rajasthan', 'Gujarat', 'Haryana', 'Punjab'],
    rainfallPattern: 'Monsoon with long dry season'
  },
  {
    id: 'subtropical-humid',
    name: 'Subtropical Humid',
    nameHi: 'उपोष्ण कटिबंधीय आर्द्र',
    characteristics: 'Hot summers and cool winters with moderate rainfall',
    temperature: { min: 10, max: 38 },
    states: ['Uttar Pradesh', 'Bihar', 'West Bengal', 'Madhya Pradesh', 'Chhattisgarh', 'Jharkhand', 'Odisha', 'Maharashtra', 'Telangana', 'Andhra Pradesh'],
    rainfallPattern: 'Monsoon with distinct winter rain in east'
  },
  {
    id: 'subtropical-dry',
    name: 'Subtropical Dry',
    nameHi: 'उपोष्ण कटिबंधीय शुष्क',
    characteristics: 'Hot summers and cold winters with low rainfall',
    temperature: { min: 2, max: 38 },
    states: ['Punjab', 'Haryana', 'Rajasthan', 'Delhi', 'Uttarakhand', 'Jammu & Kashmir'],
    rainfallPattern: 'Monsoon with snow in winter'
  },
  {
    id: 'temperate',
    name: 'Temperate',
    nameHi: 'समशीतोष्ण',
    characteristics: 'Moderate temperatures with distinct seasons',
    temperature: { min: 5, max: 30 },
    states: ['Himachal Pradesh', 'Uttarakhand', 'Jammu & Kashmir', 'Sikkim', 'Arunachal Pradesh', 'Parts of Assam'],
    rainfallPattern: 'Monsoon with winter precipitation'
  },
  {
    id: 'alpine',
    name: 'Alpine',
    nameHi: 'अल्पाइन',
    characteristics: 'Cold climate with snow cover for most of the year',
    temperature: { min: -20, max: 20 },
    states: ['High Himalayas in Himachal Pradesh', 'Uttarakhand', 'Jammu & Kashmir'],
    rainfallPattern: 'Scarce, mainly from western disturbances'
  }
];

export const MAJOR_RIVERS = [
  { name: 'Ganga', basin: 'Indo-Gangetic', states: ['Uttarakhand', 'Uttar Pradesh', 'Bihar', 'West Bengal', 'Delhi'] },
  { name: 'Yamuna', basin: 'Ganga', states: ['Delhi', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh'] },
  { name: 'Brahmaputra', basin: 'Brahmaputra', states: ['Assam', 'Arunachal Pradesh'] },
  { name: 'Godavari', basin: 'Godavari', states: ['Maharashtra', 'Telangana', 'Andhra Pradesh'] },
  { name: 'Krishna', basin: 'Krishna', states: ['Maharashtra', 'Karnataka', 'Telangana', 'Andhra Pradesh'] },
  { name: 'Mahanadi', basin: 'Mahanadi', states: ['Chhattisgarh', 'Odisha'] },
  { name: 'Narmada', basin: 'Narmada', states: ['Madhya Pradesh', 'Maharashtra', 'Gujarat'] },
  { name: 'Tapti', basin: 'Tapti', states: ['Madhya Pradesh', 'Maharashtra', 'Gujarat'] },
  { name: 'Kaveri', basin: 'Kaveri', states: ['Karnataka', 'Tamil Nadu'] }
];

export const COASTAL_STATES = [
  'Gujarat', 'Maharashtra', 'Goa', 'Karnataka', 'Kerala', 'Tamil Nadu', 'Andhra Pradesh', 'Odisha', 'West Bengal'
];

export const ISLAND_TERRITORIES = [
  'Andaman and Nicobar Islands', 'Lakshadweep'
];
