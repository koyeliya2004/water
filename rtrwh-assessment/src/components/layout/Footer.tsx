"use client";

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Droplets } from 'lucide-react';

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-gray-50">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-water-600" />
            <span className="font-semibold text-water-700">RTRWH Assessment</span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {t('footer.madeWith')}
          </p>
          
          <p className="text-sm text-muted-foreground">
            © {year} RTRWH. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
