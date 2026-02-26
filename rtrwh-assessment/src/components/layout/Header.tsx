"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n/context';
import { 
  Droplets, 
  Globe,
  Menu,
  X
} from 'lucide-react';

export function Header() {
  const { t, language, setLanguage } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="p-2 bg-water-100 rounded-lg">
            <Droplets className="w-6 h-6 text-water-600" />
          </div>
          <span className="font-bold text-xl text-water-700">RTRWH</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-water-600 transition-colors">
            {t('nav.home')}
          </Link>
          <Link href="/assess" className="text-sm font-medium hover:text-water-600 transition-colors">
            {t('nav.assess')}
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-1"
          >
            <Globe className="w-4 h-4" />
            <span>{language === 'en' ? 'हि' : 'EN'}</span>
          </Button>
          
          <Link href="/assess" className="hidden sm:block">
            <Button className="bg-water-600 hover:bg-water-700">
              {t('nav.assess')}
            </Button>
          </Link>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="container py-4 space-y-2">
            <Link 
              href="/" 
              className="block px-4 py-2 hover:bg-gray-50 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.home')}
            </Link>
            <Link 
              href="/assess" 
              className="block px-4 py-2 hover:bg-gray-50 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.assess')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
