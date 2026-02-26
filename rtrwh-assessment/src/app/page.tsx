"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n/context';
import { 
  Droplets, 
  BarChart3, 
  Building, 
  IndianRupee, 
  FileText,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Shield
} from 'lucide-react';

export default function HomePage() {
  const { t, language } = useI18n();
  
  const features = [
    {
      icon: BarChart3,
      title: t('features.feasibility.title'),
      description: t('features.feasibility.desc'),
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Building,
      title: t('features.structures.title'),
      description: t('features.structures.desc'),
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: IndianRupee,
      title: t('features.cost.title'),
      description: t('features.cost.desc'),
      color: 'text-amber-600 bg-amber-100'
    },
    {
      icon: FileText,
      title: t('features.report.title'),
      description: t('features.report.desc'),
      color: 'text-purple-600 bg-purple-100'
    }
  ];
  
  const stats = [
    { value: '100+', label: language === 'hi' ? 'शहरों का वर्षा डेटा' : 'Cities with Rainfall Data' },
    { value: '4', label: language === 'hi' ? 'प्रकार की संरचनाएं' : 'Structure Types' },
    { value: '2', label: language === 'hi' ? 'भाषाएं' : 'Languages' },
    { value: '100%', label: language === 'hi' ? 'मुफ्त' : 'Free' }
  ];
  
  const benefits = [
    { 
      icon: TrendingUp,
      title: language === 'hi' ? 'जल बचत' : 'Water Savings',
      desc: language === 'hi' ? 'वार्षिक जल क्षमता का अनुमान' : 'Estimate annual water potential'
    },
    {
      icon: Shield,
      title: language === 'hi' ? 'विश्वसनीय गणना' : 'Reliable Calculations',
      desc: language === 'hi' ? 'मानक सूत्रों का उपयोग' : 'Using standard formulas'
    },
    {
      icon: CheckCircle2,
      title: language === 'hi' ? 'आसान उपयोग' : 'Easy to Use',
      desc: language === 'hi' ? 'सरल 3-चरण प्रक्रिया' : 'Simple 3-step process'
    }
  ];
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-water-50 via-white to-water-100 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwZWE1ZTkiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-water-100 rounded-full text-water-700 text-sm font-medium mb-6">
              <Droplets className="w-4 h-4" />
              {language === 'hi' ? 'जल संरक्षण की दिशा में' : 'Towards Water Conservation'}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 text-balance">
              {t('hero.title')}
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 text-balance">
              {t('hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/assess">
                <Button size="lg" className="bg-water-600 hover:bg-water-700 text-lg px-8">
                  {t('hero.cta')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-8 bg-water-600">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center py-4">
                <p className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-water-100 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('features.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'hi' 
                ? 'विस्तृत विश्लेषण और सिफारिशें प्राप्त करें'
                : 'Get detailed analysis and recommendations'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-lg ${feature.color} mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">{t('about.title')}</h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t('about.desc')}
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-2 bg-water-100 rounded-lg">
                      <benefit.icon className="w-5 h-5 text-water-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Link href="/assess">
                  <Button className="bg-water-600 hover:bg-water-700">
                    {t('nav.assess')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-water-100 to-water-200 rounded-2xl p-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-water-100 rounded-lg">
                      <Droplets className="w-6 h-6 text-water-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'hi' ? 'वार्षिक जल क्षमता' : 'Annual Water Potential'}
                      </p>
                      <p className="text-2xl font-bold text-water-700">1,25,000 L</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {language === 'hi' ? 'व्यवहार्यता स्कोर' : 'Feasibility Score'}
                      </span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-water-500 rounded-full" />
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">
                            {language === 'hi' ? 'छत क्षेत्र' : 'Roof Area'}
                          </p>
                          <p className="font-semibold">150 m²</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            {language === 'hi' ? 'वापसी अवधि' : 'Payback Period'}
                          </p>
                          <p className="font-semibold">3.5 {language === 'hi' ? 'वर्ष' : 'years'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-water-600">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              {language === 'hi' 
                ? 'आज ही अपना मूल्यांकन शुरू करें'
                : 'Start Your Assessment Today'}
            </h2>
            <p className="text-water-100 mb-8">
              {language === 'hi'
                ? 'मात्र 2 मिनट में अपनी संपत्ति के लिए विस्तृत रिपोर्ट प्राप्त करें'
                : 'Get a detailed report for your property in just 2 minutes'}
            </p>
            <Link href="/assess">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                {t('hero.cta')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
