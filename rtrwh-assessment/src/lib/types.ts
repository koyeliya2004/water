export interface AssessmentInput {
  name: string;
  location: LocationData;
  roofArea: number;
  roofType: 'flat' | 'sloped';
  openSpace: number;
  dwellers: number;
}

export interface LocationData {
  address: string;
  city?: string;
  state?: string;
  coordinates?: { lat: number; lng: number };
  annualRainfall?: number;
}

export interface FeasibilityResult {
  score: number;
  rating: 'Excellent' | 'Good' | 'Moderate' | 'Poor';
  annualWaterPotential: number;
  runoffCoefficient: number;
  dailyWaterPerPerson: number;
  dailyTotalDemand: number;
  supplyRatio: number;
}

export interface StructureDimensions {
  length?: number;
  width?: number;
  depth?: number;
  diameter?: number;
  capacity: number;
}

export interface StructureRecommendation {
  type: 'storage_tank' | 'recharge_pit' | 'recharge_trench' | 'recharge_shaft';
  name: string;
  nameHi: string;
  dimensions: StructureDimensions;
  suitability: 'high' | 'medium' | 'low';
  description: string;
  descriptionHi: string;
  benefits: string[];
  benefitsHi: string[];
}

export interface CostEstimate {
  structureType: string;
  structureName: string;
  structureNameHi: string;
  materialCost: number;
  installationCost: number;
  totalCost: number;
  maintenanceAnnual: number;
  paybackPeriod: number;
  waterSavingsAnnual: number;
  roi: number;
}

export interface AssessmentResult {
  id: string;
  input: AssessmentInput;
  feasibility: FeasibilityResult;
  structures: StructureRecommendation[];
  costs: CostEstimate[];
  timestamp: string;
}

export type Language = 'en' | 'hi';

export interface FormStep {
  id: number;
  title: string;
  titleHi: string;
  completed: boolean;
}
