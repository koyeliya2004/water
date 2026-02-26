import type { StructureRecommendation, CostEstimate } from '../types';

const STORAGE_TANK_RATES = {
  materialPerLiter: 8,
  installation: 5000,
  maintenanceAnnual: 1000
};

const RECHARGE_PIT_RATES = {
  material: 18000,
  installation: 4000,
  maintenanceAnnual: 600
};

const RECHARGE_TRENCH_RATES = {
  materialPerMeter: 1000,
  installation: 3000,
  maintenanceAnnualPerMeter: 150
};

const RECHARGE_SHAFT_RATES = {
  material: 35000,
  installation: 8000,
  maintenanceAnnual: 1200
};

export const COST_RATES = {
  storage_tank: STORAGE_TANK_RATES,
  recharge_pit: RECHARGE_PIT_RATES,
  recharge_trench: RECHARGE_TRENCH_RATES,
  recharge_shaft: RECHARGE_SHAFT_RATES
};

export const WATER_RATE_PER_KL = 15;

export function calculateCostEstimate(
  structure: StructureRecommendation,
  waterPotential: number
): CostEstimate {
  let materialCost: number;
  let maintenanceAnnual: number;
  let installationCost: number;
  
  switch (structure.type) {
    case 'storage_tank':
      materialCost = structure.dimensions.capacity * STORAGE_TANK_RATES.materialPerLiter;
      maintenanceAnnual = STORAGE_TANK_RATES.maintenanceAnnual;
      installationCost = STORAGE_TANK_RATES.installation;
      break;
    case 'recharge_pit':
      materialCost = RECHARGE_PIT_RATES.material;
      maintenanceAnnual = RECHARGE_PIT_RATES.maintenanceAnnual;
      installationCost = RECHARGE_PIT_RATES.installation;
      break;
    case 'recharge_trench':
      const length = structure.dimensions.length || 10;
      materialCost = length * RECHARGE_TRENCH_RATES.materialPerMeter;
      maintenanceAnnual = length * RECHARGE_TRENCH_RATES.maintenanceAnnualPerMeter;
      installationCost = RECHARGE_TRENCH_RATES.installation;
      break;
    case 'recharge_shaft':
      materialCost = RECHARGE_SHAFT_RATES.material;
      maintenanceAnnual = RECHARGE_SHAFT_RATES.maintenanceAnnual;
      installationCost = RECHARGE_SHAFT_RATES.installation;
      break;
    default:
      materialCost = 20000;
      maintenanceAnnual = 1000;
      installationCost = 5000;
  }
  
  const totalCost = materialCost + installationCost;
  const waterSavingsAnnual = (waterPotential / 1000) * WATER_RATE_PER_KL;
  const paybackPeriod = totalCost / waterSavingsAnnual;
  const roi = (waterSavingsAnnual / totalCost) * 100;
  
  return {
    structureType: structure.type,
    structureName: structure.name,
    structureNameHi: structure.nameHi,
    materialCost: Math.round(materialCost),
    installationCost,
    totalCost: Math.round(totalCost),
    maintenanceAnnual: Math.round(maintenanceAnnual),
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
    waterSavingsAnnual: Math.round(waterSavingsAnnual),
    roi: Math.round(roi * 10) / 10
  };
}

export function calculateTotalInvestment(costs: CostEstimate[]): number {
  return costs.reduce((sum, cost) => sum + cost.totalCost, 0);
}

export function calculateTotalAnnualSavings(costs: CostEstimate[]): number {
  const uniqueSavings = new Set(costs.map(c => c.waterSavingsAnnual));
  return Math.max(...Array.from(uniqueSavings));
}
