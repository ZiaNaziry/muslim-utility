export type ToolId = 'zakat' | 'prayer' | 'dhikr' | 'hijri' | 'qibla';

export interface Tool {
 id: ToolId;
 name: string;
 nameAr: string;
 icon: string;
 description: string;
}

export const TOOLS: Tool[] = [
 { id: 'zakat', name: 'Zakat Calculator', nameAr: 'حاسبة الزكاة', icon: '', description: 'Calculate your annual Zakat obligation' },
 { id: 'prayer', name: 'Prayer Times', nameAr: 'أوقات الصلاة', icon: '', description: 'Get accurate prayer times for your city' },
 { id: 'dhikr', name: 'Dhikr Counter', nameAr: 'عداد الأذكار', icon: '', description: 'Digital tasbeeh counter' },
 { id: 'hijri', name: 'Hijri Converter', nameAr: 'التقويم الهجري', icon: '', description: 'Convert between Hijri and Gregorian dates' },
 { id: 'qibla', name: 'Qibla Finder', nameAr: 'اتجاه القبلة', icon: '', description: 'Find the Qibla direction from your location' },
];
