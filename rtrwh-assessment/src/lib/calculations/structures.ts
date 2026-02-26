import type { StructureRecommendation } from '../types';

export function recommendStructures(
  roofArea: number,
  openSpace: number,
  waterPotential: number,
  dwellers: number
): StructureRecommendation[] {
  const structures: StructureRecommendation[] = [];
  const dailyNeed = dwellers * 135;
  const threeDayStorage = dailyNeed * 3;
  
  if (openSpace >= 4 && roofArea >= 20) {
    const tankCapacity = Math.min(Math.max(threeDayStorage, 2000), 15000);
    const diameter = Math.sqrt((tankCapacity * 4) / (Math.PI * 1000)) * 1.2;
    
    structures.push({
      type: 'storage_tank',
      name: 'Storage Tank',
      nameHi: 'भंडारण टैंक',
      dimensions: {
        diameter: Math.round(diameter * 10) / 10,
        capacity: tankCapacity
      },
      suitability: openSpace >= 15 ? 'high' : openSpace >= 8 ? 'medium' : 'low',
      description: 'Above-ground or underground tank for storing rainwater for direct use. Ideal for households with moderate water needs.',
      descriptionHi: 'सीधे उपयोग के लिए वर्षा जल संग्रहण के लिए ऊपर-भूमि या भूमिगत टैंक। मध्यम जल आवश्यकता वाले घरों के लिए आदर्श।',
      benefits: [
        'Direct water supply for household use',
        'Reduces dependency on municipal water',
        'Low maintenance requirements',
        'Quick installation'
      ],
      benefitsHi: [
        'घरेलू उपयोग के लिए सीधा जल आपूर्ति',
        'नगरपालिका जल पर निर्भरता कम करता है',
        'कम रखरखाव आवश्यकताएं',
        'त्वरित स्थापना'
      ]
    });
  }
  
  if (openSpace >= 6 && waterPotential > 30000) {
    const pitDepth = Math.min(6, Math.max(3, waterPotential / 50000));
    
    structures.push({
      type: 'recharge_pit',
      name: 'Recharge Pit',
      nameHi: 'रिचार्ज पिट',
      dimensions: {
        diameter: 1.5,
        depth: Math.round(pitDepth * 10) / 10,
        capacity: Math.round(Math.PI * 0.75 * pitDepth * 1000)
      },
      suitability: waterPotential > 80000 ? 'high' : 'medium',
      description: 'A pit filled with filter media that allows rainwater to percolate and recharge groundwater. Best for areas with declining water table.',
      descriptionHi: 'फ़िल्टर मीडिया से भरा एक गड्ढा जो वर्षा जल को रिसने और भूजल को पुनर्भरित करने की अनुमति देता है। घटते जल स्तर वाले क्षेत्रों के लिए सबसे अच्छा।',
      benefits: [
        'Recharges groundwater aquifer',
        'Improves water table level',
        'Reduces urban flooding',
        'Low operational cost'
      ],
      benefitsHi: [
        'भूजल जलभृत को पुनर्भरित करता है',
        'जल स्तर में सुधार करता है',
        'शहरी बाढ़ को कम करता है',
        'कम संचालन लागत'
      ]
    });
  }
  
  if (openSpace >= 15 && roofArea >= 80) {
    const trenchLength = Math.min(openSpace * 0.5, 20);
    const trenchCapacity = trenchLength * 1 * 2 * 1000;
    
    structures.push({
      type: 'recharge_trench',
      name: 'Recharge Trench',
      nameHi: 'रिचार्ज खाई',
      dimensions: {
        length: Math.round(trenchLength * 10) / 10,
        width: 1,
        depth: 2,
        capacity: trenchCapacity
      },
      suitability: roofArea >= 150 ? 'high' : 'medium',
      description: 'A long trench filled with filter media for larger roof areas. Effective for both storage and groundwater recharge.',
      descriptionHi: 'बड़े छत क्षेत्रों के लिए फ़िल्टर मीडिया से भरी एक लंबी खाई। भंडारण और भूजल पुनर्भरण दोनों के लिए प्रभावी।',
      benefits: [
        'Handles large water volumes',
        'Dual purpose - storage and recharge',
        'Can be integrated with landscaping',
        'Long lifespan'
      ],
      benefitsHi: [
        'बड़ी मात्रा में पानी संभालता है',
        'दोहरा उद्देश्य - भंडारण और पुनर्भरण',
        'लैंडस्केपिंग के साथ एकीकृत किया जा सकता है',
        'लंबा जीवनकाल'
      ]
    });
  }
  
  if (openSpace >= 8 && roofArea >= 100 && waterPotential > 100000) {
    structures.push({
      type: 'recharge_shaft',
      name: 'Recharge Shaft',
      nameHi: 'रिचार्ज शाफ्ट',
      dimensions: {
        diameter: 0.5,
        depth: 15,
        capacity: 15000
      },
      suitability: 'high',
      description: 'A deep vertical shaft for direct groundwater recharge. Ideal for areas with deep water table and limited surface space.',
      descriptionHi: 'सीधे भूजल पुनर्भरण के लिए एक गहरा ऊर्ध्वाधर शाफ्ट। गहरे जल स्तर और सीमित सतही स्थान वाले क्षेत्रों के लिए आदर्श।',
      benefits: [
        'Reaches deep aquifers',
        'Minimal surface space required',
        'High recharge efficiency',
        'Suitable for urban areas'
      ],
      benefitsHi: [
        'गहरे जलभृतों तक पहुंचता है',
        'न्यूनतम सतही स्थान आवश्यक',
        'उच्च पुनर्भरण दक्षता',
        'शहरी क्षेत्रों के लिए उपयुक्त'
      ]
    });
  }
  
  return structures;
}
