'use client';

import React, { useState, useEffect } from 'react';
import { HomePage } from '../components/HomePage';
import { ZakatCalculator } from '../components/ZakatCalculator';
import { PrayerTimes } from '../components/PrayerTimes';
import { DhikrCounter } from '../components/DhikrCounter';
import { HijriConverter } from '../components/HijriConverter';
import { QiblaFinder } from '../components/QiblaFinder';
import { SupportPage } from '../components/SupportPage';
import { Lang, LANGS, t } from '../lib/i18n';

type Page = 'home' | 'zakat' | 'prayer' | 'dhikr' | 'hijri' | 'qibla' | 'support';

const THEMES = [
  { id: 'dark', label: 'Dark', icon: 'M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z' },
  { id: 'light', label: 'Light', icon: 'M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h1M2 12H1m16.95 7.95l-.71-.71M4.76 4.76l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z' },
  { id: 'emerald', label: 'Emerald', icon: 'M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2z' },
];

const NAV_ITEMS: { page: Page; labelKey: string; svgPath: string }[] = [
  { page: 'home', labelKey: 'home', svgPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1' },
  { page: 'zakat', labelKey: 'zakatCalc', svgPath: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { page: 'prayer', labelKey: 'prayerTimes', svgPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { page: 'dhikr', labelKey: 'dhikrCounter', svgPath: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  { page: 'hijri', labelKey: 'hijriConverter', svgPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { page: 'qibla', labelKey: 'qiblaFinder', svgPath: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
  { page: 'support', labelKey: 'support', svgPath: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
];

// Bottom nav shows only 5 items on mobile
const MOBILE_NAV: Page[] = ['home', 'zakat', 'prayer', 'dhikr', 'support'];

function SvgIcon({ path, className = 'w-5 h-5' }: { path: string; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState<Lang>('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dir = lang === 'en' ? 'ltr' : 'rtl';

  const navigateTo = (p: Page) => {
    setPage(p);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage lang={lang} onNavigate={navigateTo} />;
      case 'zakat': return <ZakatCalculator lang={lang} />;
      case 'prayer': return <PrayerTimes lang={lang} />;
      case 'dhikr': return <DhikrCounter lang={lang} />;
      case 'hijri': return <HijriConverter lang={lang} />;
      case 'qibla': return <QiblaFinder lang={lang} />;
      case 'support': return <SupportPage lang={lang} />;
      default: return <HomePage lang={lang} onNavigate={navigateTo} />;
    }
  };

  return (
    <div data-theme={theme} dir={dir} className={`min-h-screen bg-base-100 text-base-content flex flex-col transition-colors duration-300 ${mounted ? '' : 'opacity-0'}`}>
      {/* Navbar */}
      <div className="navbar bg-base-200/80 backdrop-blur-md shadow-lg sticky top-0 z-50 px-4 border-b border-base-300/50">
        <div className="navbar-start">
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn btn-ghost lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h8m-8 6h16"} />
              </svg>
            </label>
            {menuOpen && (
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-xl bg-base-200 rounded-box w-60 border border-base-300 animate-scale-in">
                {NAV_ITEMS.map((item) => (
                  <li key={item.page}>
                    <a
                      className={`flex items-center gap-3 py-3 ${page === item.page ? 'active bg-primary text-primary-content' : ''}`}
                      onClick={() => navigateTo(item.page)}
                    >
                      <SvgIcon path={item.svgPath} />
                      {t(lang, item.labelKey)}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <a
            className="btn btn-ghost text-lg font-bold cursor-pointer tracking-tight"
            onClick={() => navigateTo('home')}
          >
            {lang === 'en' ? 'Muslim Utilities' : lang === 'ar' ? 'أدوات المسلم' : 'ابزارهای مسلمان'}
          </a>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.page}>
                <a
                  className={`flex items-center gap-2 text-sm transition-all duration-200 ${page === item.page ? 'active bg-primary text-primary-content font-semibold' : 'hover:bg-base-300'}`}
                  onClick={() => navigateTo(item.page)}
                >
                  <SvgIcon path={item.svgPath} className="w-4 h-4" />
                  {t(lang, item.labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="navbar-end gap-1">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-sm gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline text-xs">{t(lang, 'language')}</span>
            </label>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-200 rounded-box w-40 border border-base-300">
              {LANGS.map((l) => (
                <li key={l.code}>
                  <a className={lang === l.code ? 'active' : ''} onClick={() => setLang(l.code)}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-sm gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={THEMES.find(th => th.id === theme)?.icon || THEMES[0].icon} />
              </svg>
              <span className="hidden sm:inline text-xs">{t(lang, 'theme')}</span>
            </label>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-200 rounded-box w-44 border border-base-300">
              {THEMES.map((th) => (
                <li key={th.id}>
                  <a className={`flex items-center gap-2 ${theme === th.id ? 'active' : ''}`} onClick={() => setTheme(th.id)}>
                    <SvgIcon path={th.icon} className="w-4 h-4" />
                    {th.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 pb-20 lg:pb-0">
        {renderPage()}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="btm-nav btm-nav-sm lg:hidden bg-base-200/90 backdrop-blur-md border-t border-base-300/50 z-50">
        {MOBILE_NAV.map((p) => {
          const item = NAV_ITEMS.find(n => n.page === p)!;
          return (
            <button
              key={p}
              className={`transition-colors duration-200 ${page === p ? 'active text-primary' : 'text-base-content/50'}`}
              onClick={() => navigateTo(p)}
            >
              <SvgIcon path={item.svgPath} className="w-5 h-5" />
              <span className="btm-nav-label text-xs">{t(lang, item.labelKey)}</span>
            </button>
          );
        })}
      </div>

      {/* Footer — hidden on mobile (bottom nav replaces it) */}
      <footer className="hidden lg:block bg-base-200 border-t border-base-300">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className="font-bold text-lg mb-2">{t(lang, 'homeTitle')}</h3>
              <p className="text-sm text-base-content/60">{t(lang, 'footerAboutDesc')}</p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-base-content/40">{t(lang, 'footerTools')}</h4>
              <div className="grid grid-cols-2 gap-1">
                {(['zakat', 'prayer', 'dhikr', 'hijri', 'qibla', 'support'] as Page[]).map((p) => (
                  <a key={p} className="text-sm text-base-content/60 hover:text-primary cursor-pointer transition-colors" onClick={() => navigateTo(p)}>
                    {t(lang, p === 'zakat' ? 'zakatCalc' : p === 'prayer' ? 'prayerTimes' : p === 'dhikr' ? 'dhikrCounter' : p === 'hijri' ? 'hijriConverter' : p === 'qibla' ? 'qiblaFinder' : 'support')}
                  </a>
                ))}
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm font-semibold text-base-content/70 italic">&quot;{t(lang, 'footerTagline')}&quot;</p>
            </div>
          </div>
          <div className="divider my-0"></div>
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-2">
            <p className="text-xs text-base-content/40">&copy; {new Date().getFullYear()} Muslim Utilities. {t(lang, 'footerRights')}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
