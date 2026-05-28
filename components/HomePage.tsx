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
    { text: '\u0625\u0650\u0646\u0651\u064e \u0645\u064e\u0639\u064e \u0627\u0644\u0652\u0639\u064f\u0633\u0652\u0631\u0650 \u064a\u064f\u0633\u0652\u0631\u064b\u0627', source: '\u0627\u0644\u0642\u0631\u0622\u0646 \u0669\u0664:\u0666' },
    { text: '\u0648\u064e\u0645\u064e\u0646 \u064a\u064e\u062a\u064e\u0648\u064e\u0643\u0651\u064e\u0644\u0652 \u0639\u064e\u0644\u064e\u0649 \u0627\u0644\u0644\u0651\u064e\u0647\u0650 \u0641\u064e\u0647\u064f\u0648\u064e \u062d\u064e\u0633\u0652\u0628\u064f\u0647\u064f', source: '\u0627\u0644\u0642\u0631\u0622\u0646 \u0666\u0665:\u0663' },
    { text: '\u0641\u064e\u0627\u0630\u0652\u0643\u064f\u0631\u064f\u0648\u0646\u0650\u064a \u0623\u064e\u0630\u0652\u0643\u064f\u0631\u0652\u0643\u064f\u0645\u0652', source: '\u0627\u0644\u0642\u0631\u0622\u0646 \u0662:\u0661\u0665\u0662' },
    { text: '\u0644\u064e\u0627 \u064a\u064f\u0643\u064e\u0644\u0651\u0650\u0641\u064f \u0627\u0644\u0644\u0651\u064e\u0647\u064f \u0646\u064e\u0641\u0652\u0633\u064b\u0627 \u0625\u0650\u0644\u0651\u064e\u0627 \u0648\u064f\u0633\u0652\u0639\u064e\u0647\u064e\u0627', source: '\u0627\u0644\u0642\u0631\u0622\u0646 \u0662:\u0662\u0668\u0666' },
    { text: '\u0641\u064e\u0627\u0635\u0652\u0628\u0650\u0631\u0652 \u0625\u0650\u0646\u0651\u064e \u0648\u064e\u0639\u0652\u062f\u064e \u0627\u0644\u0644\u0651\u064e\u0647\u0650 \u062d\u064e\u0642\u0651\u064c', source: '\u0627\u0644\u0642\u0631\u0622\u0646 \u0663\u0660:\u0666\u0660' },
    { text: '\u0648\u064e\u0648\u064e\u062c\u064e\u062f\u064e\u0643\u064e \u0636\u064e\u0627\u0644\u0651\u064b\u0627 \u0641\u064e\u0647\u064e\u062f\u064e\u0649\u0670', source: '\u0627\u0644\u0642\u0631\u0622\u0646 \u0669\u0663:\u0667' },
    { text: '\u0648\u064e\u0631\u064e\u062d\u0652\u0645\u064e\u062a\u0650\u064a \u0648\u064e\u0633\u0650\u0639\u064e\u062a\u0652 \u0643\u064f\u0644\u0651\u064e \u0634\u064e\u064a\u0652\u0621\u064d', source: '\u0627\u0644\u0642\u0631\u0622\u0646 \u0667:\u0661\u0665\u0666' },
  ],
  fa: [
    { text: '\u0647\u0645\u0627\u0646\u0627 \u0628\u0627 \u0633\u062e\u062a\u06cc \u0622\u0633\u0627\u0646\u06cc \u0627\u0633\u062a', source: '\u0642\u0631\u0622\u0646 \u06f9\u06f4:\u06f6' },
    { text: '\u0648 \u0647\u0631 \u06a9\u0633 \u0628\u0631 \u062e\u062f\u0627 \u062a\u0648\u06a9\u0644 \u06a9\u0646\u062f\u060c \u062e\u062f\u0627 \u0627\u0648 \u0631\u0627 \u06a9\u0627\u0641\u06cc \u0627\u0633\u062a', source: '\u0642\u0631\u0622\u0646 \u06f6\u06f5:\u06f3' },
    { text: '\u067e\u0633 \u0645\u0631\u0627 \u06cc\u0627\u062f \u06a9\u0646\u06cc\u062f \u062a\u0627 \u0634\u0645\u0627 \u0631\u0627 \u06cc\u0627\u062f \u06a9\u0646\u0645', source: '\u0642\u0631\u0622\u0646 \u06f2:\u06f1\u06f5\u06f2' },
    { text: '\u062e\u062f\u0627\u0648\u0646\u062f \u0647\u06cc\u0686 \u06a9\u0633 \u0631\u0627 \u0628\u06cc\u0634 \u0627\u0632 \u062a\u0648\u0627\u0646\u0634 \u062a\u06a9\u0644\u06cc\u0641 \u0646\u0645\u06cc\u200c\u06a9\u0646\u062f', source: '\u0642\u0631\u0622\u0646 \u06f2:\u06f2\u06f8\u06f6' },
    { text: '\u0635\u0628\u0631 \u06a9\u0646 \u06a9\u0647 \u0648\u0639\u062f\u0647 \u062e\u062f\u0627 \u062d\u0642 \u0627\u0633\u062a', source: '\u0642\u0631\u0622\u0646 \u06f3\u06f0:\u06f6\u06f0' },
    { text: '\u0648 \u062a\u0648 \u0631\u0627 \u06af\u0645\u0631\u0627\u0647 \u06cc\u0627\u0641\u062a \u067e\u0633 \u0647\u062f\u0627\u06cc\u062a\u062a \u06a9\u0631\u062f', source: '\u0642\u0631\u0622\u0646 \u06f9\u06f3:\u06f7' },
    { text: '\u0648 \u0631\u062d\u0645\u062a \u0645\u0646 \u0647\u0645\u0647 \u0686\u06cc\u0632 \u0631\u0627 \u0641\u0631\u0627 \u06af\u0631\u0641\u062a\u0647 \u0627\u0633\u062a', source: '\u0642\u0631\u0622\u0646 \u06f7:\u06f1\u06f5\u06f6' },
  ],
};

export const HomePage: React.FC<HomePageProps> = ({ lang, onNavigate }) => {
  const dir = lang === 'en' ? 'ltr' : 'rtl';
  const [dailyVerse, setDailyVerse] = useState<DailyVerse | null>(null);
  const [verseLoading, setVerseLoading] = useState(true);

  const quoteIdx = new Date().getDate() % FALLBACK_QUOTES[lang].length;
  const quote = FALLBACK_QUOTES[lang][quoteIdx];

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
      {/* Hero - slim, just title and subtitle */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative text-center py-10 md:py-16 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight animate-fade-in-up">
            {t(lang, 'homeTitle')}
          </h1>
          <p className="text-xl md:text-2xl font-bold text-base-content/90 mb-2 animate-fade-in-up animation-delay-100">
            {'\u0628\u0633\u0645 \u0627\u0644\u0644\u0647 \u0627\u0644\u0631\u062d\u0645\u0646 \u0627\u0644\u0631\u062d\u064a\u0645'}
          </p>
          <p className="text-base-content/60 text-lg max-w-xl mx-auto animate-fade-in-up animation-delay-200">
            {t(lang, 'homeSubtitle')}
          </p>
        </div>
      </div>

      {/* Tools Grid - NOW ON TOP */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-8 animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{t(lang, 'ourTools')}</h2>
          <p className="text-base-content/60">{t(lang, 'homeDesc')}</p>
        </div>

        <div className="grid gap-3 sm:gap-5 mb-12" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          {TOOL_CARDS.map((tool, i) => (
            <button
              key={tool.page}
              onClick={() => onNavigate(tool.page)}
              className={`group bg-base-200 rounded-2xl hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer border border-base-300 hover:border-primary/30 animate-fade-in-up overflow-hidden`}
              style={{ animationDelay: `${(i + 1) * 100}ms` }}
            >
              <div className={`flex flex-col items-center text-center justify-center bg-gradient-to-br ${tool.color} p-4 sm:p-6 min-h-[180px] sm:min-h-[220px]`}>
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

        {/* Daily Reminder - NOW AT BOTTOM */}
        <div className="max-w-2xl mx-auto bg-base-200/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-base-300/50 animate-fade-in-up hover:border-primary/30 transition-colors duration-300">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-base font-semibold text-primary">{t(lang, 'dailyReminder')}</p>
          </div>
          {verseLoading ? (
            <div className="flex justify-center py-4"><span className="loading loading-dots loading-md text-primary"></span></div>
          ) : dailyVerse ? (
            <>
              <p className="text-xl font-semibold text-base-content leading-relaxed mb-3 text-center" dir="rtl">{dailyVerse.arabic}</p>
              <p className="text-base text-base-content/80 leading-relaxed italic text-center">&quot;{dailyVerse.english}&quot;</p>
              <p className="text-sm text-base-content/50 mt-3 text-center">— {dailyVerse.surahName} ({dailyVerse.surahNumber}:{dailyVerse.ayahInSurah})</p>
            </>
          ) : (
            <>
              <p className="text-xl font-semibold text-base-content leading-relaxed italic text-center">&quot;{quote.text}&quot;</p>
              <p className="text-sm text-base-content/50 mt-3 text-center">— {quote.source}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
