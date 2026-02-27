// Static Rainfall Data - IMD District-wise Rainfall
export const RAINFALL_ZONES = [
  { zone: 'excess', range: '>2000mm', states: ['Arunachal Pradesh', 'Meghalaya', 'Assam', 'Sikkim', 'Kerala', 'Coastal Karnataka'] },
  { zone: 'high', range: '1500-2000mm', states: ['Maharashtra', 'Goa', 'Tamil Nadu', 'Coastal Andhra Pradesh', 'Odisha', 'West Bengal'] },
  { zone: 'moderate', range: '1000-1500mm', states: ['Uttar Pradesh', 'Madhya Pradesh', 'Gujarat', 'Telangana', 'Inland Karnataka'] },
  { zone: 'low', range: '500-1000mm', states: ['Punjab', 'Haryana', 'Rajasthan', 'Inland Gujarat'] },
  { zone: 'deficient', range: '<500mm', states: ['Ladakh', 'Parts of Rajasthan', 'Kashmir'] }
];

export const DISTRICT_RAINFALL_DATA: Record<string, {
  district: string;
  state: string;
  annual: number;
  monthly: number[];
  coordinates: { lat: number; lng: number };
}> = {
  'Delhi': {
    district: 'Delhi',
    state: 'Delhi',
    annual: 611,
    monthly: [7, 20, 15, 16, 47, 75, 237, 180, 85, 18, 5, 5],
    coordinates: { lat: 28.6139, lng: 77.2090 }
  },
  'Mumbai': {
    district: 'Mumbai',
    state: 'Maharashtra',
    annual: 2422,
    monthly: [1, 1, 1, 1, 16, 505, 840, 608, 328, 93, 23, 5],
    coordinates: { lat: 19.0760, lng: 72.8777 }
  },
  'Bangalore': {
    district: 'Bangalore',
    state: 'Karnataka',
    annual: 970,
    monthly: [3, 8, 16, 45, 120, 110, 110, 140, 190, 140, 55, 33],
    coordinates: { lat: 12.9716, lng: 77.5946 }
  },
  'Hyderabad': {
    district: 'Hyderabad',
    state: 'Telangana',
    annual: 813,
    monthly: [4, 6, 15, 25, 40, 75, 170, 180, 145, 95, 38, 20],
    coordinates: { lat: 17.3850, lng: 78.4867 }
  },
  'Chennai': {
    district: 'Chennai',
    state: 'Tamil Nadu',
    annual: 1443,
    monthly: [16, 22, 22, 24, 60, 50, 75, 110, 110, 290, 400, 260],
    coordinates: { lat: 13.0827, lng: 80.2707 }
  },
  'Kolkata': {
    district: 'Kolkata',
    state: 'West Bengal',
    annual: 1648,
    monthly: [15, 25, 30, 45, 120, 225, 325, 310, 255, 150, 45, 10],
    coordinates: { lat: 22.5726, lng: 88.3639 }
  },
  'Pune': {
    district: 'Pune',
    state: 'Maharashtra',
    annual: 722,
    monthly: [2, 3, 5, 10, 30, 110, 200, 175, 115, 55, 15, 7],
    coordinates: { lat: 18.5204, lng: 73.8567 }
  },
  'Ahmedabad': {
    district: 'Ahmedabad',
    state: 'Gujarat',
    annual: 721,
    monthly: [2, 3, 4, 6, 18, 80, 285, 220, 80, 15, 5, 3],
    coordinates: { lat: 23.0225, lng: 72.5714 }
  },
  'Jaipur': {
    district: 'Jaipur',
    state: 'Rajasthan',
    annual: 556,
    monthly: [8, 10, 10, 8, 20, 55, 165, 175, 65, 18, 12, 10],
    coordinates: { lat: 26.9124, lng: 75.7873 }
  },
  'Lucknow': {
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    annual: 969,
    monthly: [18, 22, 15, 8, 22, 120, 290, 280, 150, 35, 5, 4],
    coordinates: { lat: 26.8467, lng: 80.9462 }
  },
  'Chandigarh': {
    district: 'Chandigarh',
    state: 'Punjab',
    annual: 1059,
    monthly: [45, 55, 40, 20, 35, 75, 220, 260, 150, 45, 20, 35],
    coordinates: { lat: 30.7333, lng: 76.7794 }
  },
  'Guwahati': {
    district: 'Guwahati',
    state: 'Assam',
    annual: 1739,
    monthly: [18, 25, 45, 120, 210, 340, 360, 310, 210, 100, 30, 12],
    coordinates: { lat: 26.1445, lng: 91.7362 }
  },
  'Bhopal': {
    district: 'Bhopal',
    state: 'Madhya Pradesh',
    annual: 1114,
    monthly: [12, 15, 18, 12, 25, 140, 340, 330, 165, 45, 15, 7],
    coordinates: { lat: 23.2599, lng: 77.4126 }
  },
  'Thiruvananthapuram': {
    district: 'Thiruvananthapuram',
    state: 'Kerala',
    annual: 1823,
    monthly: [20, 25, 40, 90, 160, 280, 320, 280, 200, 180, 140, 88],
    coordinates: { lat: 8.5241, lng: 76.9366 }
  },
  'Coimbatore': {
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    annual: 689,
    monthly: [10, 15, 20, 40, 70, 40, 50, 60, 80, 140, 100, 64],
    coordinates: { lat: 11.0168, lng: 76.9558 }
  },
  'Surat': {
    district: 'Surat',
    state: 'Gujarat',
    annual: 1200,
    monthly: [3, 5, 8, 12, 25, 150, 450, 350, 150, 35, 10, 7],
    coordinates: { lat: 21.1702, lng: 72.8311 }
  },
  'Indore': {
    district: 'Indore',
    state: 'Madhya Pradesh',
    annual: 1005,
    monthly: [10, 12, 15, 10, 20, 120, 310, 315, 145, 38, 12, 8],
    coordinates: { lat: 22.7196, lng: 75.8577 }
  },
  'Nagpur': {
    district: 'Nagpur',
    state: 'Maharashtra',
    annual: 1045,
    monthly: [12, 15, 20, 15, 30, 150, 320, 290, 145, 38, 12, 8],
    coordinates: { lat: 21.1458, lng: 79.0882 }
  },
  'Patna': {
    district: 'Patna',
    state: 'Bihar',
    annual: 1193,
    monthly: [15, 18, 20, 15, 40, 150, 340, 320, 180, 45, 10, 8],
    coordinates: { lat: 25.5941, lng: 85.1376 }
  },
  'Bhubaneswar': {
    district: 'Bhubaneswar',
    state: 'Odisha',
    annual: 1449,
    monthly: [15, 22, 30, 35, 75, 180, 320, 340, 250, 140, 40, 12],
    coordinates: { lat: 20.2961, lng: 85.8245 }
  },
  'Ranchi': {
    district: 'Ranchi',
    state: 'Jharkhand',
    annual: 1326,
    monthly: [18, 22, 28, 40, 80, 200, 340, 330, 200, 55, 10, 8],
    coordinates: { lat: 23.3441, lng: 85.3095 }
  },
  'Jodhpur': {
    district: 'Jodhpur',
    state: 'Rajasthan',
    annual: 318,
    monthly: [5, 6, 6, 5, 12, 30, 95, 110, 40, 10, 5, 4],
    coordinates: { lat: 26.2389, lng: 73.0243 }
  },
  'Visakhapatnam': {
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    annual: 1202,
    monthly: [10, 15, 20, 30, 70, 110, 180, 190, 180, 220, 120, 57],
    coordinates: { lat: 17.6868, lng: 83.2185 }
  },
  'Varanasi': {
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    annual: 1016,
    monthly: [15, 18, 15, 10, 20, 110, 280, 270, 160, 35, 8, 5],
    coordinates: { lat: 25.3176, lng: 82.9739 }
  },
  'Srinagar': {
    district: 'Srinagar',
    state: 'Jammu and Kashmir',
    annual: 710,
    monthly: [55, 65, 75, 85, 55, 40, 60, 75, 50, 35, 25, 35],
    coordinates: { lat: 34.0837, lng: 74.7973 }
  },
  'Ludhiana': {
    district: 'Ludhiana',
    state: 'Punjab',
    annual: 680,
    monthly: [35, 40, 35, 22, 30, 65, 180, 170, 95, 20, 12, 20],
    coordinates: { lat: 30.9010, lng: 75.8573 }
  }
};

export const MONSOON_PATTERN = {
  'Southwest': { months: [5, 6, 7, 8, 9], contribution: 0.75 },
  'Northeast': { months: [4, 5, 6, 7, 8, 9, 10], contribution: 0.80 }
};
