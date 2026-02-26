"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useI18n } from '@/lib/i18n/context';
import { getRainfallForLocation } from '@/lib/calculations/rainwater';
import type { AssessmentInput } from '@/lib/types';
import { 
  User, 
  MapPin, 
  Home, 
  Users, 
  ChevronRight, 
  ChevronLeft, 
  Check,
  CloudRain
} from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  location: z.string().min(2, 'Location is required'),
  roofArea: z.number().min(20, 'Roof area must be at least 20 sq meters').max(10000),
  roofType: z.enum(['flat', 'sloped']),
  openSpace: z.number().min(2, 'Open space must be at least 2 sq meters').max(10000),
  dwellers: z.number().min(1, 'At least 1 dweller required').max(100),
});

type FormData = z.infer<typeof formSchema>;

interface AssessmentFormProps {
  onSubmit: (data: AssessmentInput) => void;
  isCalculating?: boolean;
}

export function AssessmentForm({ onSubmit, isCalculating = false }: AssessmentFormProps) {
  const { t, language } = useI18n();
  const [step, setStep] = useState(1);
  const [detectedRainfall, setDetectedRainfall] = useState<number | null>(null);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roofType: 'flat',
      dwellers: 4
    }
  });
  
  const watchLocation = watch('location');
  
  const handleLocationBlur = () => {
    if (watchLocation && watchLocation.length >= 2) {
      const rainfall = getRainfallForLocation(watchLocation);
      setDetectedRainfall(rainfall);
    }
  };
  
  const steps = [
    { id: 1, title: t('form.step1.title'), subtitle: t('form.step1.subtitle'), icon: User },
    { id: 2, title: t('form.step2.title'), subtitle: t('form.step2.subtitle'), icon: Home },
    { id: 3, title: t('form.step3.title'), subtitle: t('form.step3.subtitle'), icon: Check },
  ];
  
  const progress = (step / 3) * 100;
  
  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    
    if (step === 1) {
      fieldsToValidate = ['name', 'location'];
    } else if (step === 2) {
      fieldsToValidate = ['roofArea', 'roofType', 'openSpace', 'dwellers'];
    }
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
    }
  };
  
  const prevStep = () => {
    setStep(Math.max(1, step - 1));
  };
  
  const onFormSubmit = (data: FormData) => {
    const rainfall = getRainfallForLocation(data.location);
    onSubmit({
      name: data.name,
      location: {
        address: data.location,
        annualRainfall: rainfall
      },
      roofArea: data.roofArea,
      roofType: data.roofType,
      openSpace: data.openSpace,
      dwellers: data.dwellers
    });
  };
  
  const roofType = watch('roofType');
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                step > s.id 
                  ? 'bg-water-600 border-water-600 text-white' 
                  : step === s.id 
                    ? 'border-water-600 text-water-600' 
                    : 'border-gray-300 text-gray-300'
              }`}>
                {step > s.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <s.icon className="w-5 h-5" />
                )}
              </div>
              {i < steps.length - 1 && (
                <div className={`hidden sm:block w-24 h-1 mx-2 rounded transition-colors ${
                  step > s.id ? 'bg-water-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <Progress value={progress} className="h-2" />
        
        <div className="text-center">
          <CardTitle>{steps[step - 1].title}</CardTitle>
          <CardDescription>{steps[step - 1].subtitle}</CardDescription>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t('form.name')}
                </Label>
                <Input
                  id="name"
                  placeholder={t('form.namePlaceholder')}
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {t('form.location')}
                </Label>
                <Input
                  id="location"
                  placeholder={t('form.locationPlaceholder')}
                  {...register('location')}
                  onBlur={handleLocationBlur}
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location.message}</p>
                )}
                {detectedRainfall && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                    <CloudRain className="w-4 h-4" />
                    <span>
                      {language === 'hi' 
                        ? `इस क्षेत्र में वार्षिक वर्षा: ${detectedRainfall} मिमी` 
                        : `Detected annual rainfall for this area: ${detectedRainfall} mm`}
                    </span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">{t('form.locationHelp')}</p>
              </div>
            </div>
          )}
          
          {/* Step 2: Property Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="roofArea" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  {t('form.roofArea')}
                </Label>
                <Input
                  id="roofArea"
                  type="number"
                  placeholder={t('form.roofAreaPlaceholder')}
                  {...register('roofArea', { valueAsNumber: true })}
                  className={errors.roofArea ? 'border-red-500' : ''}
                />
                {errors.roofArea && (
                  <p className="text-sm text-red-500">{errors.roofArea.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  {t('form.roofType')}
                </Label>
                <RadioGroup
                  value={roofType}
                  onValueChange={(value) => setValue('roofType', value as 'flat' | 'sloped')}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors flex-1">
                    <RadioGroupItem value="flat" id="flat" />
                    <Label htmlFor="flat" className="cursor-pointer">{t('form.roofTypeFlat')}</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors flex-1">
                    <RadioGroupItem value="sloped" id="sloped" />
                    <Label htmlFor="sloped" className="cursor-pointer">{t('form.roofTypeSloped')}</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="openSpace">{t('form.openSpace')}</Label>
                <Input
                  id="openSpace"
                  type="number"
                  placeholder={t('form.openSpacePlaceholder')}
                  {...register('openSpace', { valueAsNumber: true })}
                  className={errors.openSpace ? 'border-red-500' : ''}
                />
                {errors.openSpace && (
                  <p className="text-sm text-red-500">{errors.openSpace.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dwellers" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {t('form.dwellers')}
                </Label>
                <Input
                  id="dwellers"
                  type="number"
                  placeholder={t('form.dwellersPlaceholder')}
                  {...register('dwellers', { valueAsNumber: true })}
                  className={errors.dwellers ? 'border-red-500' : ''}
                />
                {errors.dwellers && (
                  <p className="text-sm text-red-500">{errors.dwellers.message}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium">{t('form.step1.title')}</h4>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">{t('form.name')}:</span>
                    <span className="font-medium">{watch('name')}</span>
                    <span className="text-muted-foreground">{t('form.location')}:</span>
                    <span className="font-medium">{watch('location')}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium">{t('form.step2.title')}</h4>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">{t('form.roofArea')}:</span>
                    <span className="font-medium">{watch('roofArea')} m²</span>
                    <span className="text-muted-foreground">{t('form.roofType')}:</span>
                    <span className="font-medium">
                      {watch('roofType') === 'flat' ? t('form.roofTypeFlat') : t('form.roofTypeSloped')}
                    </span>
                    <span className="text-muted-foreground">{t('form.openSpace')}:</span>
                    <span className="font-medium">{watch('openSpace')} m²</span>
                    <span className="text-muted-foreground">{t('form.dwellers')}:</span>
                    <span className="font-medium">{watch('dwellers')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={step === 1 || isCalculating}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              {t('form.back')}
            </Button>
            
            {step < 3 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 bg-water-600 hover:bg-water-700"
              >
                {t('form.next')}
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isCalculating}
                className="flex items-center gap-2 bg-water-600 hover:bg-water-700"
              >
                {isCalculating ? t('form.loading') : t('form.submit')}
                {isCalculating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
