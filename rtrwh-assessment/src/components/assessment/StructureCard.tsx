"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/lib/i18n/context';
import { formatLiters, getSuitabilityColor } from '@/lib/utils';
import type { StructureRecommendation } from '@/lib/types';
import { 
  Droplets, 
  Ruler, 
  CheckCircle2 
} from 'lucide-react';

interface StructureCardProps {
  structure: StructureRecommendation;
}

export function StructureCard({ structure }: StructureCardProps) {
  const { t, language } = useI18n();
  
  const structureIcons: Record<string, React.ReactNode> = {
    storage_tank: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
        <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
      </svg>
    ),
    recharge_pit: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4v16" />
        <path d="M8 8l4-4 4 4" />
      </svg>
    ),
    recharge_trench: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="8" width="16" height="8" rx="1" />
        <path d="M8 8v8M12 8v8M16 8v8" />
      </svg>
    ),
    recharge_shaft: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="8" y="4" width="8" height="16" rx="4" />
        <path d="M12 8v8" />
        <path d="M10 20h4" />
      </svg>
    )
  };
  
  const suitabilityLabels = {
    high: t('structure.high'),
    medium: t('structure.medium'),
    low: t('structure.low')
  };
  
  return (
    <Card className="border-l-4 border-l-water-500 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-water-100 rounded-lg text-water-600">
            {structureIcons[structure.type]}
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-lg">
                {language === 'hi' ? structure.nameHi : structure.name}
              </h4>
              <Badge className={getSuitabilityColor(structure.suitability)}>
                {suitabilityLabels[structure.suitability]}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {language === 'hi' ? structure.descriptionHi : structure.description}
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Droplets className="w-4 h-4 text-water-500" />
                <span className="text-muted-foreground">{t('structure.capacity')}:</span>
                <span className="font-medium">{formatLiters(structure.dimensions.capacity)}</span>
              </div>
              
              {structure.dimensions.diameter && (
                <div className="flex items-center gap-1">
                  <Ruler className="w-4 h-4 text-gray-400" />
                  <span className="text-muted-foreground">
                    {language === 'hi' ? 'व्यास' : 'Diameter'}:
                  </span>
                  <span className="font-medium">{structure.dimensions.diameter} m</span>
                </div>
              )}
              
              {structure.dimensions.depth && (
                <div className="flex items-center gap-1">
                  <Ruler className="w-4 h-4 text-gray-400" />
                  <span className="text-muted-foreground">
                    {language === 'hi' ? 'गहराई' : 'Depth'}:
                  </span>
                  <span className="font-medium">{structure.dimensions.depth} m</span>
                </div>
              )}
              
              {structure.dimensions.length && (
                <div className="flex items-center gap-1">
                  <Ruler className="w-4 h-4 text-gray-400" />
                  <span className="text-muted-foreground">
                    {language === 'hi' ? 'लंबाई' : 'Length'}:
                  </span>
                  <span className="font-medium">{structure.dimensions.length} m</span>
                </div>
              )}
              
              {structure.dimensions.width && (
                <div className="flex items-center gap-1">
                  <Ruler className="w-4 h-4 text-gray-400" />
                  <span className="text-muted-foreground">
                    {language === 'hi' ? 'चौड़ाई' : 'Width'}:
                  </span>
                  <span className="font-medium">{structure.dimensions.width} m</span>
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">{t('structure.benefits')}:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {(language === 'hi' ? structure.benefitsHi : structure.benefits).map((benefit, i) => (
                  <li key={i} className="flex items-start gap-1 text-xs">
                    <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
