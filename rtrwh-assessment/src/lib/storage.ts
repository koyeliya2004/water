import type { AssessmentResult } from './types';
import { generateId } from './utils';

const STORAGE_KEY = 'rtrwh-assessments';

export function saveAssessment(result: Omit<AssessmentResult, 'id' | 'timestamp'>): AssessmentResult {
  const assessments = getAssessments();
  const newAssessment: AssessmentResult = {
    ...result,
    id: generateId(),
    timestamp: new Date().toISOString()
  };
  
  assessments.unshift(newAssessment);
  
  if (assessments.length > 50) {
    assessments.pop();
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
  return newAssessment;
}

export function getAssessments(): AssessmentResult[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getAssessmentById(id: string): AssessmentResult | undefined {
  const assessments = getAssessments();
  return assessments.find(a => a.id === id);
}

export function deleteAssessment(id: string): void {
  const assessments = getAssessments();
  const filtered = assessments.filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function clearAllAssessments(): void {
  localStorage.removeItem(STORAGE_KEY);
}
