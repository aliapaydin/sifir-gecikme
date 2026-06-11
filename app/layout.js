import { Inter, Lora, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import ThemeSync from '../components/ThemeSync';
import LayoutShell from '../components/LayoutShell';
import ZiyaretTakip from '../components/ZiyaretTakip';
import UserDataProvider from '../components/UserDataProvider';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-sans', display: 'swap' });
const lora = Lora({ subsets: ['latin', 'latin-ext'], variable: '--font-serif', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin', 'latin-ext'], variable: '--font-mono', display: 'swap' });

const baseUrl = 'https://sifir-gecikme.vercel.app';

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Sıfır Gecikme — Türkçe Veri Bilimi',
    template: '%s — Sıfır Gecikme',
  },
  description: 'Veri bilimi, makine öğrenmesi ve istatistik üzerine interaktif Türkçe içerikler. Linear regression, K-Means, sinir ağı, SQL, pandas ve daha fazlası.',
  keywords: [
    'veri bilimi türkçe', 'data science türkçe', 'python öğren türkçe',
    'makine öğrenmesi türkçe', 'istatistik türkçe', 'sql türkçe',
    'pandas türkçe', 'numpy türkçe', 'linear regression', 'gradient descent',
    'veri analizi', 'data analyst', 'data scientist', 'ml engineer',
  ],
  authors: [{ name: 'Ali Apaydın', url: baseUrl }],
  creator: 'Ali Apaydın',
  publisher: 'Sıfır Gecikme',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: baseUrl,
    siteName: 'Sıfır Gecikme',
    title: 'Sıfır Gecikme — Türkçe Veri Bilimi',
    description: 'Veri bilimi, makine öğrenmesi ve istatistik üzerine interaktif Türkçe içerikler. Her kavramı önce dener, sonra konuşuruz.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Sıfır Gecikme' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sifirgecikme',
    creator: '@sifirgecikme',
    title: 'Sıfır Gecikme — Türkçe Veri Bilimi',
    description: 'İnteraktif Türkçe veri bilimi içerikleri. Ücretsiz.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" suppressHydrationWarning className={`${inter.variable} ${lora.variable} ${jetbrains.variable}`}>
      <head>
        <Script src="/muzik-player.js" strategy="afterInteractive" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1D9E75" />
        <meta name="google-site-verification" content="oEjUXEcwRAvCofIP79PEy5vtWO8OafOLnZ5bjOAyFJo" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sıfır Gecikme" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
        <body suppressHydrationWarning>
          <ThemeSync />
          <Script id="sw-init" strategy="afterInteractive">{`
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.register('/sw.js');
            }
          `}</Script>
          <ZiyaretTakip />
          <UserDataProvider>
            <LayoutShell>
              {children}
            </LayoutShell>
          </UserDataProvider>
<Analytics />
          <SpeedInsights />
        </body>
    </html>
  );
}
