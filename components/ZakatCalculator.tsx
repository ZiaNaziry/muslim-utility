import React, { useState } from 'react';
import { Lang, t } from '../lib/i18n';

interface ZakatValues { cash: string; bankSavings: string; goldValue: string; silverValue: string; investments: string; businessGoods: string; debtsOwedToYou: string; debtsYouOwe: string; }
const INITIAL: ZakatValues = { cash: '', bankSavings: '', goldValue: '', silverValue: '', investments: '', businessGoods: '', debtsOwedToYou: '', debtsYouOwe: '' };
const NISAB_GOLD_GRAMS = 85;
const NISAB_SILVER_GRAMS = 595;
const ZAKAT_RATE = 0.025;

const FIELD_KEYS: { key: keyof ZakatValues; labelKey: string; hintKey: string }[] = [
  { key: 'cash', labelKey: 'cashOnHand', hintKey: 'cashHint' },
  { key: 'bankSavings', labelKey: 'bankSavings', hintKey: 'bankHint' },
  { key: 'goldValue', labelKey: 'goldValue', hintKey: 'goldHint' },
  { key: 'silverValue', labelKey: 'silverValue', hintKey: 'silverHint' },
  { key: 'investments', labelKey: 'investments', hintKey: 'investHint' },
  { key: 'businessGoods', labelKey: 'businessAssets', hintKey: 'businessHint' },
  { key: 'debtsOwedToYou', labelKey: 'debtsToYou', hintKey: 'debtsToYouHint' },
  { key: 'debtsYouOwe', labelKey: 'debtsOwed', hintKey: 'debtsOweHint' },
];

export const ZakatCalculator: React.FC<{ lang: Lang }> = ({ lang }) => {
  const [values, setValues] = useState<ZakatValues>(INITIAL);
  const [currency, setCurrency] = useState('USD');
  const [goldPricePerGram, setGoldPricePerGram] = useState('70');
  const [silverPricePerGram, setSilverPricePerGram] = useState('0.85');
  const [result, setResult] = useState<{ total: number; zakat: number; nisab: number; eligible: boolean } | null>(null);
  const dir = lang === 'en' ? 'ltr' : 'rtl';
  const num = (v: string) => parseFloat(v) || 0;

  const calculate = () => {
    const totalAssets = num(values.cash) + num(values.bankSavings) + num(values.goldValue) + num(values.silverValue) + num(values.investments) + num(values.businessGoods) + num(values.debtsOwedToYou);
    const netWealth = totalAssets - num(values.debtsYouOwe);
    const nisab = Math.min(NISAB_GOLD_GRAMS * num(goldPricePerGram), NISAB_SILVER_GRAMS * num(silverPricePerGram));
    const eligible = netWealth >= nisab;
    setResult({ total: netWealth, zakat: eligible ? netWealth * ZAKAT_RATE : 0, nisab, eligible });
  };

  const reset = () => { setValues(INITIAL); setResult(null); };
  const handleChange = (field: keyof ZakatValues, val: string) => setValues((prev) => ({ ...prev, [field]: val }));
  const cs = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency;

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto" dir={dir}>
      <h2 className="text-2xl font-bold mb-1 animate-fade-in-up">{t(lang, 'zakatTitle')}</h2>
      <p className="text-base-content/60 mb-6 animate-fade-in-up animation-delay-100">{t(lang, 'zakatSubtitle')}</p>

      <div className="card bg-base-200 mb-4 animate-fade-in-up animation-delay-200">
        <div className="card-body p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {t(lang, 'settings')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="label text-sm">{t(lang, 'currency')}</label>
              <select className="select select-bordered w-full" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="USD">USD ($)</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="SAR">SAR</option><option value="AED">AED</option><option value="PKR">PKR</option><option value="AFN">AFN</option>
              </select>
            </div>
            <div><label className="label text-sm">{t(lang, 'goldPrice')}</label><input className="input input-bordered w-full" type="number" value={goldPricePerGram} onChange={(e) => setGoldPricePerGram(e.target.value)} /></div>
            <div><label className="label text-sm">{t(lang, 'silverPrice')}</label><input className="input input-bordered w-full" type="number" value={silverPricePerGram} onChange={(e) => setSilverPricePerGram(e.target.value)} /></div>
          </div>
        </div>
      </div>

      <div className="card bg-base-200 mb-4 animate-fade-in-up animation-delay-300">
        <div className="card-body p-4">
          <h3 className="font-semibold mb-3">{t(lang, 'yourAssets')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FIELD_KEYS.map((f) => (
              <div key={f.key}>
                <label className="label text-sm">{t(lang, f.labelKey as any)}</label>
                <input className="input input-bordered w-full" type="number" placeholder={t(lang, f.hintKey as any)} value={values[f.key]} onChange={(e) => handleChange(f.key, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button className="btn btn-primary flex-1" onClick={calculate}>{t(lang, 'calculate')}</button>
        <button className="btn btn-outline" onClick={reset}>{t(lang, 'reset')}</button>
      </div>

      {result && (
        <div className={`card animate-scale-in ${result.eligible ? 'bg-primary/10 border border-primary/30' : 'bg-base-200'}`}>
          <div className="card-body p-4">
            <h3 className="font-bold text-lg mb-3">{t(lang, 'zakatResult')}</h3>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-base-content/60">{t(lang, 'netWealth')}:</span><span className="font-semibold">{cs} {result.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
              <div className="flex justify-between"><span className="text-base-content/60">{t(lang, 'nisabThreshold')}:</span><span className="font-semibold">{cs} {result.nisab.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
              <div className="divider my-1"></div>
              {result.eligible ? (
                <div className="flex justify-between items-center"><span className="text-primary font-bold text-lg">{t(lang, 'zakatDue')}:</span><span className="text-primary font-bold text-2xl">{cs} {result.zakat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
              ) : (
                <div className="alert alert-info"><span>{t(lang, 'zakatNotDue')}</span></div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
