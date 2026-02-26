import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(Math.round(num));
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatLiters(liters: number): string {
  if (liters >= 1000000) {
    return `${(liters / 1000000).toFixed(2)} ML`;
  } else if (liters >= 1000) {
    return `${(liters / 1000).toFixed(1)} KL`;
  }
  return `${Math.round(liters)} L`;
}

export function generateId(): string {
  return `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getSuitabilityColor(suitability: 'high' | 'medium' | 'low'): string {
  switch (suitability) {
    case 'high':
      return 'text-green-600 bg-green-50';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50';
    case 'low':
      return 'text-red-600 bg-red-50';
  }
}

export function getRatingColor(rating: string): string {
  switch (rating) {
    case 'Excellent':
      return 'text-green-600';
    case 'Good':
      return 'text-blue-600';
    case 'Moderate':
      return 'text-yellow-600';
    case 'Poor':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
}
