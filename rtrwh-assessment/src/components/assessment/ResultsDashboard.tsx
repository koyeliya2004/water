"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useI18n } from '@/lib/i18n/context';
import { formatNumber, formatCurrency, formatLiters, getScoreColor } from '@/lib/utils';
import type { AssessmentResult } from '@/lib/types';
import { StructureCard } from './StructureCard';
import { CostTable } from './CostTable';
import { 
  Droplets, 
  TrendingUp, 
  Users, 
  Percent, 
  IndianRupee,
  Calendar,
  Award
} from 'lucide-react';

interface ResultsDashboardProps {
  result: AssessmentResult;
}

export function ResultsDashboard({ result }: ResultsDashboardProps) {
  const { t, language } = useI18n();
  const { input, feasibility, structures, costs } = result;
  
  const ratingTranslations: Record<string, string> = {
    'Excellent': t('rating.excellent'),
    'Good': t('rating.good'),
    'Moderate': t('rating.moderate'),
    'Poor': t('rating.poor')
  };
  
  const totalInvestment = costs.reduce((sum, c) => sum + c.totalCost, 0);
  const annualSavings = costs.length > 0 ? costs[0].waterSavingsAnnual : 0;
  
  return (
    <div className="space-y-6">
      {/* Feasibility Overview */}
      <Card className="border-water-200 bg-gradient-to-br from-water-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-water-600" />
            {t('results.feasibility')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Score */}
            <div className="bg-white rounded-lg p-4 border shadow-sm">
              <div className="text-center">
                <div className="relative inline-block">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      className="fill-none stroke-gray-200"
                      strokeWidth="8"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      className={`fill-none ${getScoreColor(feasibility.score)} transition-all duration-1000`}
                      strokeWidth="8"
                      strokeDasharray={`${(feasibility.score / 100) * 251.2} 251.2`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{feasibility.score}</span>
                  </div>
                </div>
                <Badge 
                  variant={feasibility.rating === 'Excellent' ? 'success' : feasibility.rating === 'Good' ? 'info' : feasibility.rating === 'Moderate' ? 'warning' : 'destructive'}
                  className="mt-2"
                >
                  {ratingTranslations[feasibility.rating]}
                </Badge>
              </div>
            </div>
            
            {/* Water Potential */}
            <div className="bg-white rounded-lg p-4 border shadow-sm">
              <div className="flex items-center gap-2 text-water-600 mb-2">
                <Droplets className="w-5 h-5" />
                <span className="text-sm text-muted-foreground">{t('results.waterPotential')}</span>
              </div>
              <p className="text-2xl font-bold text-water-700">
                {formatLiters(feasibility.annualWaterPotential)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'hi' ? 'वार्षिक' : 'per year'}
              </p>
            </div>
            
            {/* Daily Demand */}
            <div className="bg-white rounded-lg p-4 border shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Users className="w-5 h-5" />
                <span className="text-sm text-muted-foreground">{t('results.dailyDemand')}</span>
              </div>
              <p className="text-2xl font-bold">
                {formatNumber(feasibility.dailyTotalDemand)} L
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'hi' ? 'प्रति दिन' : 'per day'}
              </p>
            </div>
            
            {/* Supply Ratio */}
            <div className="bg-white rounded-lg p-4 border shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Percent className="w-5 h-5" />
                <span className="text-sm text-muted-foreground">{t('results.supplyRatio')}</span>
              </div>
              <p className="text-2xl font-bold">
                {Math.round(feasibility.supplyRatio * 100)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'hi' 
                  ? `${input.dwellers} लोगों के लिए` 
                  : `of needs for ${input.dwellers} people`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Structures */}
      <Card>
        <CardHeader>
          <CardTitle>{t('results.structures')}</CardTitle>
          <CardDescription>
            {language === 'hi' 
              ? `${input.roofArea} वर्ग मीटर छत और ${input.openSpace} वर्ग मीटर खुली जगह के लिए अनुशंसित`
              : `Recommended for ${input.roofArea} m² roof and ${input.openSpace} m² open space`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {structures.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {structures.map((structure, index) => (
                <StructureCard key={index} structure={structure} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>{t('results.noStructures')}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Cost Analysis */}
      {costs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('results.costEstimate')}</CardTitle>
            <CardDescription>
              {language === 'hi'
                ? 'अनुमानित लागत और वित्तीय लाभ'
                : 'Estimated costs and financial benefits'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CostTable costs={costs} />
            
            <Separator className="my-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <IndianRupee className="w-5 h-5" />
                  <span className="text-sm text-muted-foreground">{t('results.totalInvestment')}</span>
                </div>
                <p className="text-xl font-bold">{formatCurrency(totalInvestment)}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm text-muted-foreground">{t('results.annualSavings')}</span>
                </div>
                <p className="text-xl font-bold text-green-600">{formatCurrency(annualSavings)}</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm text-muted-foreground">{t('results.paybackPeriod')}</span>
                </div>
                <p className="text-xl font-bold text-blue-600">
                  {costs.length > 0 ? costs[0].paybackPeriod : 0} {language === 'hi' ? 'वर्ष' : 'years'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
