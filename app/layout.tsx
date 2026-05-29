import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Muslim Utilities — Free Tools for Every Muslim',
  description: 'Your all-in-one Islamic companion. Zakat Calculator, Prayer Times, Dhikr Counter, Hijri Converter, Qibla Finder — free, private, multilingual.',
  verification: {
    google: 'V76HNLMiHxYovQk5dt_s91hUZTE-hZyLl6E_hNIsJA8',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6PK87EWQR0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6PK87EWQR0');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
