import React, { useState, useEffect } from 'react';
import { Lang, t } from '../lib/i18n';

type Page = 'home' | 'zakat' | 'prayer' | 'dhikr' | 'hijri' | 'qibla' | 'support';

interface HomePageProps {
  lang: Lang;
  onNavigate: (page: Page) => void;
}

const TOOL_CARDS: { page: Page; nameKey: string; descKey: string; color: string; svgPath: string }[] = [
  { page: 'zakat', nameKey: 'zakatCalc', descKey: 'zakatSubtitle', color: 'from-emerald-500/20 to-emerald-700/10', svgPath: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { page: 'prayer', nameKey: 'prayerTimes', descKey: 'prayerSubtitle', color: 'from-blue-500/20 to-blue-700/10', svgPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { page: 'dhikr', nameKey: 'dhikrCounter', descKey: 'dhikrSubtitle', color: 'from-purple-500/20 to-purple-700/10', svgPath: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  { page: 'hijri', nameKey: 'hijriConverter', descKey: 'hijriSubtitle', color: 'from-amber-500/20 to-amber-700/10', svgPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { page: 'qibla', nameKey: 'qiblaFinder', descKey: 'qiblaSubtitle', color: 'from-rose-500/20 to-rose-700/10', svgPath: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
  { page: 'support', nameKey: 'support', descKey: 'supportSubtitle', color: 'from-pink-500/20 to-pink-700/10', svgPath: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
];

interface DailyVerse {
  english: string;
  arabic: string;
  surahName: string;
  ayahNumber: number;
  surahNumber: number;
  ayahInSurah: number;
}

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

const FEATURES: Record<Lang, { title: string; desc: string; svgPath: string }[]> = {
  en: [
    { title: 'Privacy First', desc: 'No tracking, no data collection', svgPath: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { title: 'Multilingual', desc: 'English, Arabic & Farsi support', svgPath: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'Mobile Friendly', desc: 'Works perfectly on any device', svgPath: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
  ],
  ar: [
    { title: 'الخصوصية أولاً', desc: 'لا تتبع، لا جمع بيانات', svgPath: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { title: 'متعدد اللغات', desc: 'دعم الإنجليزية والعربية والفارسية', svgPath: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'متوافق مع الجوال', desc: 'يعمل بشكل مثالي على أي جهاز', svgPath: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
  ],
  fa: [
    { title: 'حریم خصوصی', desc: 'بدون ردیابی، بدون جمع‌آوری داده', svgPath: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { title: 'چند زبانه', desc: 'پشتیبانی از انگلیسی، عربی و فارسی', svgPath: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'سازگار با موبایل', desc: 'روی هر دستگاهی کار می‌کند', svgPath: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
  ],
};

const FALLBACK_QUOTES: Record<Lang, { text: string; source: string }[]> = {
  en: [
    { text: 'Indeed, with hardship comes ease.', source: 'Quran 94:6' },
    { text: 'And whoever puts their trust in Allah, He will be enough for them.', source: 'Quran 65:3' },
    { text: 'So remember Me; I will remember you.', source: 'Quran 2:152' },
    { text: 'Allah does not burden a soul beyond that it can bear.', source: 'Quran 2:286' },
    { text: 'Be patient. Indeed, the promise of Allah is truth.', source: 'Quran 30:60' },
    { text: 'And He found you lost and guided you.', source: 'Quran 93:7' },
    { text: 'My mercy encompasses all things.', source: 'Quran 7:156' },
  ],
  ar: [
    { text: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', source: 'القرآن ٩٤:٦' },
    { text: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', source: 'القرآن ٦٥:٣' },
    { text: 'فَاذْكُرُونِي أَذْكُرْكُمْ', source: 'القرآن ٢:١٥٢' },
    { text: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا', source: 'القرآن ٢:٢٨٦' },
    { text: 'فَاصْبِرْ إِنَّ وَعْدَ اللَّهِ حَقٌّ', source: 'القرآن ٣٠:٦٠' },
    { text: 'وَوَجَدَكَ ضَالًّا فَهَدَىٰ', source: 'القرآن ٩٣:٧' },
    { text: 'وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ', source: 'القرآن ٧:١٥٦' },
  ],
  fa: [
    { text: 'همانا با سختی آسانی است', source: 'قرآن ۹۴:۶' },
    { text: 'و هر کس بر خدا توکل کند، خدا او را کافی است', source: 'قرآن ۶۵:۳' },
    { text: 'پس مرا یاد کنید تا شما را یاد کنم', source: 'قرآن ۲:۱۵۲' },
    { text: 'خداوند هیچ کس را بیش از توانش تکلیف نمی‌کند', source: 'قرآن ۲:۲۸۶' },
    { text: 'صبر کن که وعده خدا حق است', source: 'قرآن ۳۰:۶۰' },
    { text: 'و تو را گمراه یافت پس هدایتت کرد', source: 'قرآن ۹۳:۷' },
    { text: 'و رحمت من همه چیز را فرا گرفته است', source: 'قرآن ۷:۱۵۶' },
  ],
};

export const HomePage: React.FC<HomePageProps> = ({ lang, onNavigate }) => {
  const dir = lang === 'en' ? 'ltr' : 'rtl';
  const [dailyVerse, setDailyVerse] = useState<DailyVerse | null>(null);
  const [verseLoading, setVerseLoading] = useState(true);

  const quoteIdx = new Date().getDate() % FALLBACK_QUOTES[lang].length;
  const quote = FALLBACK_QUOTES[lang][quoteIdx];
  const features = FEATURES[lang];

  useEffect(() => {
    const ayahNumber = (getDayOfYear() % 6236) + 1;
    fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/en.asad,ar.alafasy`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200 && data.data?.length >= 2) {
          const en = data.data[0];
          const ar = data.data[1];
          setDailyVerse({ english: en.text, arabic: ar.text, surahName: en.surah.englishName, ayahNumber: en.numberInSurah, surahNumber: en.surah.number, ayahInSurah: en.numberInSurah });
        }
      })
      .catch(() => {})
      .finally(() => setVerseLoading(false));
  }, []);

  return (
    <div dir={dir}>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative text-center py-12 md:py-20 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight animate-fade-in-up">
            {t(lang, 'homeTitle')}
          </h1>
          <p className="text-xl md:text-2xl font-bold text-base-content/90 mb-2 animate-fade-in-up animation-delay-100">
            بسم الله الرحمن الرحيم
          </p>
          <p className="text-base-content/60 text-lg max-w-xl mx-auto mb-8 animate-fade-in-up animation-delay-200">
            {t(lang, 'homeSubtitle')}
          </p>

          {/* Daily Verse */}
          <div className="max-w-lg mx-auto bg-base-200/60 backdrop-blur-sm rounded-2xl p-6 border border-base-300/50 animate-fade-in-up animation-delay-300 hover:border-primary/30 transition-colors duration-300">
            <div className="flex items-center justify-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-sm font-medium text-primary">{t(lang, 'dailyReminder')}</p>
            </div>
            {verseLoading ? (
              <div className="flex justify-center py-4"><span className="loading loading-dots loading-md text-primary"></span></div>
            ) : dailyVerse ? (
              <>
                <p className="text-lg font-semibold text-base-content leading-relaxed mb-2" dir="rtl">{dailyVerse.arabic}</p>
                <p className="text-base text-base-content/80 leading-relaxed italic">&quot;{dailyVerse.english}&quot;</p>
                <p className="text-sm text-base-content/50 mt-2">— {dailyVerse.surahName} ({dailyVerse.surahNumber}:{dailyVerse.ayahInSurah})</p>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-base-content leading-relaxed italic">&quot;{quote.text}&quot;</p>
                <p className="text-sm text-base-content/50 mt-2">— {quote.source}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tools */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-8 animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{t(lang, 'ourTools')}</h2>
          <p className="text-base-content/60">{t(lang, 'homeDesc')}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 mb-16">
          {TOOL_CARDS.map((tool, i) => (
            <button
              key={tool.page}
              onClick={() => onNavigate(tool.page)}
              className={`group card bg-base-200 hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer border border-base-300 hover:border-primary/30 animate-fade-in-up animation-delay-${(i + 1) * 100}`}
            >
              <div className={`card-body items-center text-center bg-gradient-to-br ${tool.color} rounded-2xl p-4 sm:p-6`}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-base-100/50 flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-7 sm:h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={tool.svgPath} />
                  </svg>
                </div>
                <h3 className="card-title text-base-content text-sm sm:text-lg">{t(lang, tool.nameKey)}</h3>
                <p className="text-base-content/60 text-xs sm:text-sm hidden sm:block">{t(lang, tool.descKey)}</p>
                <div className="mt-2 sm:mt-3">
                  <span className="btn btn-primary btn-xs sm:btn-sm btn-outline group-hover:btn-primary group-hover:text-primary-content transition-all">
                    {t(lang, 'openTool')}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="mb-16 animate-fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{t(lang, 'whyUs')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={i} className={`text-center p-6 bg-base-200 rounded-2xl border border-base-300 hover:border-primary/20 transition-all duration-300 hover:shadow-lg animate-fade-in-up animation-delay-${(i + 1) * 100}`}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.svgPath} />
                  </svg>
                </div>
                <h4 className="font-bold text-sm mb-1">{f.title}</h4>
                <p className="text-xs text-base-content/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
