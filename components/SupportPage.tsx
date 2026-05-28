import React, { useState } from 'react';
import { Lang, t } from '../lib/i18n';

interface Props { lang: Lang; }

export const SupportPage: React.FC<Props> = ({ lang }) => {
  const [sent, setSent] = useState(false);
  const dir = lang === 'en' ? 'ltr' : 'rtl';

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto" dir={dir}>
      <div className="text-center mb-8 animate-fade-in-up">
        <h2 className="text-3xl font-bold mb-2">{t(lang, 'supportTitle')}</h2>
        <p className="text-base-content/60 text-lg">{t(lang, 'supportSubtitle')}</p>
      </div>

      <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 mb-6 animate-fade-in-up animation-delay-100">
        <div className="card-body items-center text-center p-8">
          <p className="text-lg font-semibold mb-2">
            {t(lang, 'builtBy')} <span className="text-primary text-xl font-bold">Ahmad Zia Naziry</span>
          </p>
          <div className="divider w-32 mx-auto"></div>
          <p className="text-base-content/80 text-lg leading-relaxed max-w-lg italic">
            &quot;{t(lang, 'prayerRequest')}&quot;
          </p>
        </div>
      </div>

      <div className="card bg-base-200 animate-fade-in-up animation-delay-200">
        <div className="card-body">
          <h3 className="text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t(lang, 'sendMessage')}
          </h3>

          {sent && (
            <div className="alert alert-success mb-4 animate-scale-in">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>{t(lang, 'messageSent')}</span>
            </div>
          )}

          <form action="https://formsubmit.co/zianaziry89@gmail.com" method="POST" onSubmit={() => setSent(true)}>
            <input type="hidden" name="_subject" value="New message from Muslim Utilities" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_next" value="https://muslim-utility.vercel.app/" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="label text-sm">{t(lang, 'yourName')}</label>
                <input className="input input-bordered w-full" placeholder={t(lang, 'yourName')} name="name" required />
              </div>
              <div>
                <label className="label text-sm">{t(lang, 'yourEmail')}</label>
                <input className="input input-bordered w-full" type="email" placeholder={t(lang, 'yourEmail')} name="email" />
              </div>
            </div>
            <div className="mb-4">
              <label className="label text-sm">{t(lang, 'yourMessage')}</label>
              <textarea className="textarea textarea-bordered w-full h-32" placeholder={t(lang, 'yourMessage')} name="message" required />
            </div>
            <button type="submit" className="btn btn-primary w-full gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              {t(lang, 'send')}
            </button>
          </form>
        </div>
      </div>

      <div className="text-center mt-8 text-base-content/40 text-sm animate-fade-in">
        <p>{t(lang, 'builtBy')} <span className="font-semibold">Ahmad Zia Naziry</span></p>
      </div>
    </div>
  );
};
