import React, { useState } from 'react';
import { Lang, t } from '../lib/i18n';

interface DhikrPreset { name: string; arabic: string; transliteration: string; target: number; }

const PRESETS: DhikrPreset[] = [
  { name: 'SubhanAllah', arabic: 'سبحان الله', transliteration: 'Glory be to Allah', target: 33 },
  { name: 'Alhamdulillah', arabic: 'الحمد لله', transliteration: 'All praise is due to Allah', target: 33 },
  { name: 'Allahu Akbar', arabic: 'الله أكبر', transliteration: 'Allah is the Greatest', target: 34 },
  { name: 'La ilaha illallah', arabic: 'لا إله إلا الله', transliteration: 'There is no god but Allah', target: 100 },
  { name: 'Astaghfirullah', arabic: 'أستغفر الله', transliteration: 'I seek forgiveness from Allah', target: 100 },
  { name: 'La hawla wala quwwata', arabic: 'لا حول ولا قوة إلا بالله', transliteration: 'There is no power except with Allah', target: 100 },
];

export const DhikrCounter: React.FC<{ lang: Lang }> = ({ lang }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [customTarget, setCustomTarget] = useState('');
  const [totalSession, setTotalSession] = useState(0);
  const dir = lang === 'en' ? 'ltr' : 'rtl';

  const preset = PRESETS[selectedIdx];
  const target = customTarget ? parseInt(customTarget) || preset.target : preset.target;
  const progress = Math.min((count / target) * 100, 100);
  const completed = count >= target;

  const increment = () => { setCount((c) => c + 1); setTotalSession((tt) => tt + 1); };
  const reset = () => setCount(0);
  const selectPreset = (idx: number) => { setSelectedIdx(idx); setCount(0); setCustomTarget(''); };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto" dir={dir}>
      <h2 className="text-2xl font-bold mb-1 animate-fade-in-up">{t(lang, 'dhikrTitle')}</h2>
      <p className="text-base-content/60 mb-6 animate-fade-in-up animation-delay-100">{t(lang, 'dhikrSubtitle')}</p>

      <div className="flex flex-wrap gap-2 mb-6 animate-fade-in-up animation-delay-200">
        {PRESETS.map((p, i) => (
          <button key={p.name} onClick={() => selectPreset(i)} className={`btn btn-sm ${i === selectedIdx ? 'btn-primary' : 'btn-outline'} transition-all`}>
            {p.name}
          </button>
        ))}
      </div>

      <div className="card bg-base-200 mb-4 animate-fade-in-up animation-delay-300">
        <div className="card-body items-center text-center p-6">
          <p className="text-4xl font-bold mb-1" style={{ fontFamily: 'serif' }}>{preset.arabic}</p>
          <p className="text-primary text-lg">{preset.name}</p>
          <p className="text-base-content/60 text-sm">{preset.transliteration}</p>
        </div>
      </div>

      <div className="flex flex-col items-center mb-6 animate-fade-in-up animation-delay-400">
        <div className="radial-progress text-primary mb-4" style={{ '--value': progress, '--size': '10rem', '--thickness': '8px' } as React.CSSProperties}>
          <span className="text-4xl font-bold">{count}</span>
        </div>
        <p className="text-base-content/60 mb-4">{t(lang, 'target')}: {count} / {target}</p>

        {completed && (
          <div className="alert alert-success mb-4 justify-center animate-scale-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <span>{t(lang, 'completed')}</span>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={increment} className="btn btn-primary btn-lg px-12 text-xl active:scale-95 transition-transform">{t(lang, 'tap')} +1</button>
          <button onClick={reset} className="btn btn-outline btn-lg">{t(lang, 'resetCount')}</button>
        </div>
      </div>

      <div className="card bg-base-200 mb-4">
        <div className="card-body p-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-base-content/60 whitespace-nowrap">{t(lang, 'custom')} {t(lang, 'target')}:</label>
            <input className="input input-bordered input-sm flex-1" type="number" placeholder={String(preset.target)} value={customTarget} onChange={(e) => setCustomTarget(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="text-center text-base-content/40 text-sm">
        <p>{t(lang, 'totalSession')}: {totalSession}</p>
      </div>
    </div>
  );
};
