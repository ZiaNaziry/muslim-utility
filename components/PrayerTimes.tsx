'use client';
import React, { useState } from 'react';
import { t, Lang } from '../lib/i18n';

const methods = [
  { id: 2, label: 'ISNA' }, { id: 1, label: 'MWL' }, { id: 3, label: 'Egyptian' },
  { id: 4, label: 'Umm Al-Qura' }, { id: 5, label: 'Dubai' }, { id: 7, label: 'Tehran' }
];

export const PrayerTimes: React.FC<{ lang: Lang }> = ({ lang }) => {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [method, setMethod] = useState(2);
  const [prayers, setPrayers] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dir = lang === 'en' ? 'ltr' : 'rtl';

  const fetchPrayers = async () => {
    if (!city.trim() || !country.trim()) { setError(t(lang, 'enterCityCountry')); return; }
    setLoading(true); setError('');
    try {
      const url = 'https://api.aladhan.com/v1/timingsByCity?city=' + encodeURIComponent(city) + '&country=' + encodeURIComponent(country) + '&method=' + method;
      const res = await fetch(url);
      const data = await res.json();
      if (data.code === 200) {
        const ti = data.data.timings;
        const d = data.data.date;
        setPrayers({
          Fajr: ti.Fajr, Sunrise: ti.Sunrise, Dhuhr: ti.Dhuhr,
          Asr: ti.Asr, Maghrib: ti.Maghrib, Isha: ti.Isha,
          date: d.readable + ' — ' + d.hijri.day + ' ' + d.hijri.month.en + ' ' + d.hijri.year + ' AH'
        });
      } else { setError(t(lang, 'prayerError')); }
    } catch { setError(t(lang, 'prayerError')); }
    finally { setLoading(false); }
  };

  const prayerNames: Record<string, string> = {
    Fajr: t(lang, 'fajr'), Sunrise: t(lang, 'sunrise'), Dhuhr: t(lang, 'dhuhr'),
    Asr: t(lang, 'asr'), Maghrib: t(lang, 'maghrib'), Isha: t(lang, 'isha')
  };

  const prayerIcons: Record<string, string> = {
    Fajr: 'M12 3v2m0 14v2m9-9h-2M5 12H3m15.36-6.36l-1.42 1.42M7.05 18.36l-1.41 1.41m12.72 0l-1.41-1.41M7.05 5.64L5.64 4.22',
    Sunrise: 'M12 2v4m0 12v4m8-8h-4M8 12H4m13.66-5.66l-2.83 2.83M9.17 14.83l-2.83 2.83m11.32 0l-2.83-2.83M9.17 9.17L6.34 6.34',
    Dhuhr: 'M12 3v1m0 16v1m8-9h1M3 12H2m16.36-6.36l.71-.71M5.64 18.36l-.71.71m13.43 0l-.71-.71M5.64 5.64l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z',
    Asr: 'M12 3v1m0 16v1m8-9h1M3 12H2m16.36-6.36l.71-.71M5.64 18.36l-.71.71m13.43 0l-.71-.71M5.64 5.64l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z',
    Maghrib: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
    Isha: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
  };

  return (
    <div className="min-h-screen bg-base-100 transition-colors duration-300" dir={dir}>
      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 animate-fade-in-up">{t(lang, 'prayerTimes')}</h1>

        <div className="space-y-3 animate-fade-in-up" style={{animationDelay: '100ms'}}>
          <input className="input input-bordered w-full" placeholder={t(lang, 'city')} value={city} onChange={e => setCity(e.target.value)} />
          <input className="input input-bordered w-full" placeholder={t(lang, 'country')} value={country} onChange={e => setCountry(e.target.value)} />
          <select className="select select-bordered w-full" value={method} onChange={e => setMethod(+e.target.value)}>
            {methods.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
          <button onClick={fetchPrayers} className="btn btn-primary w-full" disabled={loading}>
            {loading ? <span className="loading loading-spinner loading-sm"></span> : t(lang, 'getPrayerTimes')}
          </button>
        </div>

        {error && <div className="alert alert-error mt-4 animate-scale-in"><span>{error}</span></div>}

        {prayers && (
          <div className="mt-6 space-y-2 animate-fade-in-up">
            <p className="text-sm opacity-70 text-center mb-3">{prayers.date}</p>
            {Object.entries(prayerNames).map(([key, name], i) => (
              <div key={key} className={'flex items-center justify-between p-3 rounded-lg bg-base-300/50 hover:bg-base-300 transition-colors animate-fade-in-up'} style={{animationDelay: (i + 1) * 100 + 'ms'}}>
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={prayerIcons[key]} />
                  </svg>
                  <span className="font-medium">{name}</span>
                </div>
                <span className="font-mono text-lg">{(prayers as any)[key]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
