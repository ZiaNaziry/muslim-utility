import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Muslim Utilities — Free Tools for Every Muslim',
  description: 'Your all-in-one Islamic companion. Zakat Calculator, Prayer Times, Dhikr Counter, Hijri Converter, Qibla Finder — free, private, multilingual.',
  verification: {
    google: 'jf5jAp_OdxS-JIjAijc1YirI3zAAXe4DI0zZW8LsnB0',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3BFMDRQV93"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3BFMDRQV93');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
