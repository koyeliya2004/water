"use client";

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency } from '@/lib/utils';
import type { CostEstimate } from '@/lib/types';

interface CostTableProps {
  costs: CostEstimate[];
}

export function CostTable({ costs }: CostTableProps) {
  const { t, language } = useI18n();
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-2 font-medium">{t('cost.structure')}</th>
            <th className="text-right py-3 px-2 font-medium">{t('cost.material')}</th>
            <th className="text-right py-3 px-2 font-medium">{t('cost.installation')}</th>
            <th className="text-right py-3 px-2 font-medium">{t('cost.total')}</th>
            <th className="text-right py-3 px-2 font-medium">{t('cost.maintenance')}</th>
            <th className="text-right py-3 px-2 font-medium">{t('cost.payback')}</th>
          </tr>
        </thead>
        <tbody>
          {costs.map((cost, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-3 px-2 font-medium">
                {language === 'hi' ? cost.structureNameHi : cost.structureName}
              </td>
              <td className="text-right py-3 px-2">{formatCurrency(cost.materialCost)}</td>
              <td className="text-right py-3 px-2">{formatCurrency(cost.installationCost)}</td>
              <td className="text-right py-3 px-2 font-semibold">{formatCurrency(cost.totalCost)}</td>
              <td className="text-right py-3 px-2">{formatCurrency(cost.maintenanceAnnual)}</td>
              <td className="text-right py-3 px-2">
                <span className={cost.paybackPeriod <= 5 ? 'text-green-600' : cost.paybackPeriod <= 10 ? 'text-blue-600' : 'text-yellow-600'}>
                  {cost.paybackPeriod} {language === 'hi' ? 'वर्ष' : 'yrs'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
