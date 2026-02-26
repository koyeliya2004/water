"use client";

import React, { useState } from 'react';
import { AssessmentForm } from '@/components/assessment/AssessmentForm';
import { ResultsDashboard } from '@/components/assessment/ResultsDashboard';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n/context';
import { calculateRainwaterPotential, calculateFeasibility, getRainfallForLocation } from '@/lib/calculations/rainwater';
import { recommendStructures } from '@/lib/calculations/structures';
import { calculateCostEstimate } from '@/lib/calculations/costs';
import { saveAssessment } from '@/lib/storage';
import type { AssessmentInput, AssessmentResult } from '@/lib/types';
import { ArrowLeft, Download } from 'lucide-react';

export default function AssessPage() {
  const { t, language } = useI18n();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const handleSubmit = async (input: AssessmentInput) => {
    setIsCalculating(true);
    
    // Simulate a brief delay for UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get rainfall data
    const rainfall = input.location.annualRainfall || getRainfallForLocation(input.location.address);
    
    // Calculate water potential
    const waterPotential = calculateRainwaterPotential(
      input.roofArea,
      rainfall,
      input.roofType
    );
    
    // Calculate feasibility
    const feasibility = calculateFeasibility(
      input.roofArea,
      input.openSpace,
      input.dwellers,
      waterPotential,
      input.roofType
    );
    
    // Get structure recommendations
    const structures = recommendStructures(
      input.roofArea,
      input.openSpace,
      waterPotential,
      input.dwellers
    );
    
    // Calculate costs for each structure
    const costs = structures.map(s => calculateCostEstimate(s, waterPotential));
    
    // Create and save assessment
    const newResult = saveAssessment({
      input,
      feasibility,
      structures,
      costs
    });
    
    setResult(newResult);
    setIsCalculating(false);
  };
  
  const handleReset = () => {
    setResult(null);
  };
  
  const handleDownload = () => {
    if (!result) return;
    
    // Create a simple text report
    const report = generateTextReport(result, language);
    
    // Create blob and download
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RTRWH_Assessment_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="container py-8 sm:py-12">
      {!result ? (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">{t('app.title')}</h1>
            <p className="text-muted-foreground">{t('app.description')}</p>
          </div>
          
          <AssessmentForm onSubmit={handleSubmit} isCalculating={isCalculating} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{t('results.title')}</h1>
              <p className="text-muted-foreground">{t('results.subtitle')}</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t('form.startNew')}
              </Button>
              <Button onClick={handleDownload} className="flex items-center gap-2 bg-water-600 hover:bg-water-700">
                <Download className="w-4 h-4" />
                {t('download.report')}
              </Button>
            </div>
          </div>
          
          <ResultsDashboard result={result} />
        </div>
      )}
    </div>
  );
}

function generateTextReport(result: AssessmentResult, language: 'en' | 'hi'): string {
  const { input, feasibility, structures, costs } = result;
  const date = new Date(result.timestamp).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN');
  
  if (language === 'hi') {
    return `
════════════════════════════════════════════════════════════
           छत वर्षा जल संग्रहण मूल्यांकन रिपोर्ट
════════════════════════════════════════════════════════════

दिनांक: ${date}
नाम: ${input.name}
स्थान: ${input.location.address}

────────────────────────────────────────────────────────────
                    संपत्ति विवरण
────────────────────────────────────────────────────────────
छत क्षेत्र: ${input.roofArea} वर्ग मीटर
छत का प्रकार: ${input.roofType === 'flat' ? 'सपाट' : 'ढलान वाली'}
खुली जगह: ${input.openSpace} वर्ग मीटर
निवासियों की संख्या: ${input.dwellers}

────────────────────────────────────────────────────────────
                    व्यवहार्यता विश्लेषण
────────────────────────────────────────────────────────────
स्कोर: ${feasibility.score}/100
रेटिंग: ${feasibility.rating === 'Excellent' ? 'उत्कृष्ट' : feasibility.rating === 'Good' ? 'अच्छा' : feasibility.rating === 'Moderate' ? 'मध्यम' : 'कमज़ोर'}
वार्षिक जल क्षमता: ${feasibility.annualWaterPotential.toLocaleString('hi-IN')} लीटर
दैनिक जल मांग: ${feasibility.dailyTotalDemand} लीटर

────────────────────────────────────────────────────────────
                  अनुशंसित संरचनाएं
────────────────────────────────────────────────────────────
${structures.map((s, i) => `
${i + 1}. ${s.nameHi}
   क्षमता: ${s.dimensions.capacity.toLocaleString('hi-IN')} लीटर
   उपयुक्तता: ${s.suitability === 'high' ? 'उच्च' : s.suitability === 'medium' ? 'मध्यम' : 'कम'}
   विवरण: ${s.descriptionHi}
`).join('')}

────────────────────────────────────────────────────────────
                     लागत अनुमान
────────────────────────────────────────────────────────────
${costs.map((c, i) => `
${i + 1}. ${c.structureNameHi}
   सामग्री लागत: ₹${c.materialCost.toLocaleString('hi-IN')}
   स्थापना लागत: ₹${c.installationCost.toLocaleString('hi-IN')}
   कुल लागत: ₹${c.totalCost.toLocaleString('hi-IN')}
   वार्षिक बचत: ₹${c.waterSavingsAnnual.toLocaleString('hi-IN')}
   वापसी अवधि: ${c.paybackPeriod} वर्ष
`).join('')}

════════════════════════════════════════════════════════════
               जल संरक्षण की दिशा में एक कदम
════════════════════════════════════════════════════════════
`;
  }
  
  return `
════════════════════════════════════════════════════════════
         Rooftop Rainwater Harvesting Assessment Report
════════════════════════════════════════════════════════════

Date: ${date}
Name: ${input.name}
Location: ${input.location.address}

────────────────────────────────────────────────────────────
                    Property Details
────────────────────────────────────────────────────────────
Roof Area: ${input.roofArea} sq meters
Roof Type: ${input.roofType === 'flat' ? 'Flat' : 'Sloped'}
Open Space: ${input.openSpace} sq meters
Number of Dwellers: ${input.dwellers}

────────────────────────────────────────────────────────────
                   Feasibility Analysis
────────────────────────────────────────────────────────────
Score: ${feasibility.score}/100
Rating: ${feasibility.rating}
Annual Water Potential: ${feasibility.annualWaterPotential.toLocaleString()} liters
Daily Water Demand: ${feasibility.dailyTotalDemand} liters
Supply Coverage: ${Math.round(feasibility.supplyRatio * 100)}%

────────────────────────────────────────────────────────────
                 Recommended Structures
────────────────────────────────────────────────────────────
${structures.map((s, i) => `
${i + 1}. ${s.name}
   Capacity: ${s.dimensions.capacity.toLocaleString()} liters
   Suitability: ${s.suitability.charAt(0).toUpperCase() + s.suitability.slice(1)}
   Description: ${s.description}
`).join('')}

────────────────────────────────────────────────────────────
                     Cost Estimate
────────────────────────────────────────────────────────────
${costs.map((c, i) => `
${i + 1}. ${c.structureName}
   Material Cost: ₹${c.materialCost.toLocaleString()}
   Installation Cost: ₹${c.installationCost.toLocaleString()}
   Total Cost: ₹${c.totalCost.toLocaleString()}
   Annual Savings: ₹${c.waterSavingsAnnual.toLocaleString()}
   Payback Period: ${c.paybackPeriod} years
`).join('')}

════════════════════════════════════════════════════════════
              A Step Towards Water Conservation
════════════════════════════════════════════════════════════
`;
}
