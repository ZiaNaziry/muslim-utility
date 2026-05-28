import React, { useState } from 'react';
import { Lang, t } from '../lib/i18n';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;
function toRadians(deg: number) { return deg * Math.PI / 180; }
function toDegrees(rad: number) { return rad * 180 / Math.PI; }

function calculateQibla(lat: number, lng: number): number {
  const phiK = toRadians(KAABA_LAT); const lambdaK = toRadians(KAABA_LNG);
  const phi = toRadians(lat); const lambda = toRadians(lng);
  const num = Math.sin(lambdaK - lambda);
  const den = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
  let qibla = toDegrees(Math.atan2(num, den));
  if (qibla < 0) qibla += 360;
  return qibla;
}

function getCardinalDirection(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.round(deg / 22.5) % 16];
}

const CITY_PRESETS = [
  { name: 'Kabul', lat: 34.5553, lng: 69.2075 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'New York', lat: 40.7128, lng: -74.006 },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
  { name: 'Istanbul', lat: 41.0082, lng: 28.9784 },
  { name: 'Kuala Lumpur', lat: 3.139, lng: 101.6869 },
  { name: 'Jakarta', lat: -6.2088, lng: 106.8456 },
  { name: 'Islamabad', lat: 33.6844, lng: 73.0479 },
  { name: 'Cairo', lat: 30.0444, lng: 31.2357 },
  { name: 'Dhaka', lat: 23.8103, lng: 90.4125 },
];

export const QiblaFinder: React.FC<{ lang: Lang }> = ({ lang }) => {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [result, setResult] = useState<{ angle: number; cardinal: string; distance: number } | null>(null);
  const [cityName, setCityName] = useState('');
  const dir = lang === 'en' ? 'ltr' : 'rtl';

  const calculate = (latitude: number, longitude: number, name?: string) => {
    const angle = calculateQibla(latitude, longitude);
    const cardinal = getCardinalDirection(angle);
    const R = 6371;
    const dLat = toRadians(KAABA_LAT - latitude);
    const dLon = toRadians(KAABA_LNG - longitude);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(latitude)) * Math.cos(toRadians(KAABA_LAT)) * Math.sin(dLon / 2) ** 2;
    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    setResult({ angle, cardinal, distance });
    setCityName(name || t(lang, 'customLocation'));
  };

  const handleManual = () => { const la = parseFloat(lat); const ln = parseFloat(lng); if (!isNaN(la) && !isNaN(ln)) calculate(la, ln); };
  const handlePreset = (city: typeof CITY_PRESETS[0]) => { setLat(String(city.lat)); setLng(String(city.lng)); calculate(city.lat, city.lng, city.name); };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto" dir={dir}>
      <h2 className="text-2xl font-bold mb-1 animate-fade-in-up">{t(lang, 'qiblaTitle')}</h2>
      <p className="text-base-content/60 mb-6 animate-fade-in-up animation-delay-100">{t(lang, 'qiblaSubtitle')}</p>

      <div className="card bg-base-200 mb-4 animate-fade-in-up animation-delay-200">
        <div className="card-body p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {t(lang, 'selectCity')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {CITY_PRESETS.map((city) => (
              <button key={city.name} onClick={() => handlePreset(city)} className="btn btn-sm btn-outline hover:btn-primary transition-all">{city.name}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="card bg-base-200 mb-4 animate-fade-in-up animation-delay-300">
        <div className="card-body p-4">
          <h3 className="font-semibold mb-3">{t(lang, 'orEnterCoords')}</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div><label className="label text-sm">{t(lang, 'latitude')}</label><input className="input input-bordered w-full" type="number" step="any" placeholder="34.5553" value={lat} onChange={(e) => setLat(e.target.value)} /></div>
            <div><label className="label text-sm">{t(lang, 'longitude')}</label><input className="input input-bordered w-full" type="number" step="any" placeholder="69.2075" value={lng} onChange={(e) => setLng(e.target.value)} /></div>
          </div>
          <button className="btn btn-primary w-full" onClick={handleManual}>{t(lang, 'findQibla')}</button>
        </div>
      </div>

      {result && (
        <div className="card bg-primary/10 border border-primary/30 animate-scale-in">
          <div className="card-body p-6 items-center text-center">
            <p className="text-base-content/60 text-sm mb-2">{cityName}</p>
            <div className="relative w-48 h-48 mb-4">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="90" fill="none" className="stroke-base-content/20" strokeWidth="2" />
                <text x="100" y="20" textAnchor="middle" className="fill-base-content/60" fontSize="14" fontWeight="bold">N</text>
                <text x="185" y="105" textAnchor="middle" className="fill-base-content/60" fontSize="14">E</text>
                <text x="100" y="195" textAnchor="middle" className="fill-base-content/60" fontSize="14">S</text>
                <text x="15" y="105" textAnchor="middle" className="fill-base-content/60" fontSize="14">W</text>
                <line x1="100" y1="100" x2={100 + 70 * Math.sin(toRadians(result.angle))} y2={100 - 70 * Math.cos(toRadians(result.angle))} className="stroke-primary" strokeWidth="3" strokeLinecap="round" />
                <circle cx={100 + 78 * Math.sin(toRadians(result.angle))} cy={100 - 78 * Math.cos(toRadians(result.angle))} r="8" className="fill-primary/20 stroke-primary" strokeWidth="1" />
                <circle cx="100" cy="100" r="5" className="fill-primary" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-primary">{result.angle.toFixed(2)}&deg;</p>
            <p className="text-lg font-semibold">{result.cardinal} {t(lang, 'fromNorth')}</p>
            <p className="text-base-content/60 mt-2">{t(lang, 'distanceToKaaba')}: {result.distance.toFixed(0)} km ({(result.distance * 0.621371).toFixed(0)} mi)</p>
          </div>
        </div>
      )}
    </div>
  );
};
