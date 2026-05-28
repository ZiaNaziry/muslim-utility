'use client';
import React, { useState, useEffect } from 'react';
import { Lang, t } from '../lib/i18n';

interface HijriDate { day: string; month: { number: number; en: string; ar: string }; year: string; weekday: { en: string; ar: string }; }
interface GregorianDate { day: string; month: { number: number; en: string }; year: string; weekday: { en: string }; }

export const HijriConverter: React.FC<{ lang: Lang }> = ({ lang }) => {
  const [mode, setMode] = useState<'toHijri' | 'toGregorian'>('toHijri');
  const [inputDate, setInputDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [todayHijri, setTodayHijri] = useState<HijriDate | null>(null);
  const [result, setResult] = useState<{ hijri?: HijriDate; gregorian?: GregorianDate } | null>(null);
  const dir = lang === 'en' ? 'ltr' : 'rtl';

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('https://api.aladhan.com/v1/gToH');
        const data = await res.json();
        if (data.code === 200) setTodayHijri(data.data.hijri);
      } catch (e) { console.error('Failed to fetch today hijri:', e); }
    })();
  }, []);

  const convert = async () => {
    if (!inputDate) { setError(t(lang, 'selectDate')); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      let url: string;
      if (mode === 'toHijri') { const [y, m, d] = inputDate.split('-'); url = `https://api.aladhan.com/v1/gToH/${d}-${m}-${y}`; }
      else { const [y, m, d] = inputDate.split('-'); url = `https://api.aladhan.com/v1/hToG/${d}-${m}-${y}`; }
      const res = await fetch(url);
      const data = await res.json();
      if (data.code === 200) { setResult({ hijri: data.data.hijri, gregorian: data.data.gregorian }); }
      else { setError(t(lang, 'invalidDate')); }
    } catch { setError(t(lang, 'convertError')); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto" dir={dir}>
      <h2 className="text-2xl font-bold mb-1 animate-fade-in-up">{t(lang, 'hijriTitle')}</h2>
      <p className="text-base-content/60 mb-6 animate-fade-in-up animation-delay-100">{t(lang, 'hijriSubtitle')}</p>

      {todayHijri && (
        <div className="card bg-primary/10 border border-primary/30 mb-6 animate-fade-in-up animation-delay-200">
          <div className="card-body p-4 text-center">
            <p className="text-base-content/60 text-sm">{t(lang, 'todayHijri')}</p>
            <p className="text-2xl font-bold text-primary">{todayHijri.day} {todayHijri.month.en} {todayHijri.year} AH</p>
            <p className="text-xl">{todayHijri.day} {todayHijri.month.ar} {todayHijri.year}</p>
            <p className="text-base-content/60">{todayHijri.weekday.en} — {todayHijri.weekday.ar}</p>
          </div>
        </div>
      )}

      <div className="tabs tabs-boxed mb-4 w-fit mx-auto animate-fade-in-up animation-delay-300">
        <button className={`tab ${mode === 'toHijri' ? 'tab-active' : ''}`} onClick={() => { setMode('toHijri'); setResult(null); setInputDate(''); }}>{t(lang, 'gregorianToHijri')}</button>
        <button className={`tab ${mode === 'toGregorian' ? 'tab-active' : ''}`} onClick={() => { setMode('toGregorian'); setResult(null); setInputDate(''); }}>{t(lang, 'hijriToGregorian')}</button>
      </div>

      <div className="card bg-base-200 mb-4 animate-fade-in-up animation-delay-400">
        <div className="card-body p-4">
          {mode === 'toHijri' ? (
            <div><label className="label text-sm">{t(lang, 'gregorianDate')}</label><input type="date" className="input input-bordered w-full" value={inputDate} onChange={(e) => setInputDate(e.target.value)} /></div>
          ) : (
            <div><label className="label text-sm">{t(lang, 'hijriDate')}</label><input type="text" className="input input-bordered w-full" placeholder="1446-06-15" value={inputDate} onChange={(e) => setInputDate(e.target.value)} /></div>
          )}
          <button className="btn btn-primary w-full mt-3" onClick={convert} disabled={loading}>{loading ? <span className="loading loading-spinner loading-sm" /> : t(lang, 'convert')}</button>
        </div>
      </div>

      {error && <div className="alert alert-error mb-4 animate-scale-in"><span>{error}</span></div>}

      {result && (
        <div className="card bg-base-200 animate-scale-in">
          <div className="card-body p-4">
            <h3 className="font-bold text-lg mb-3">{t(lang, 'result')}</h3>
            {result.hijri && (
              <div className="p-3 rounded-lg bg-base-300/50 mb-3">
                <p className="text-base-content/60 text-sm">{t(lang, 'hijriConverter')}</p>
                <p className="text-xl font-bold">{result.hijri.day} {result.hijri.month.en} {result.hijri.year} AH</p>
                <p className="text-primary">{result.hijri.month.ar} — {result.hijri.weekday.ar}</p>
              </div>
            )}
            {result.gregorian && (
              <div className="p-3 rounded-lg bg-base-300/50">
                <p className="text-base-content/60 text-sm">{t(lang, 'gregorianDate')}</p>
                <p className="text-xl font-bold">{result.gregorian.day} {result.gregorian.month.en} {result.gregorian.year}</p>
                <p className="text-base-content/60">{result.gregorian.weekday.en}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
