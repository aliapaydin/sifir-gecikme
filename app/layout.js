import { Inter, Lora, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
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
      <body suppressHydrationWarning>
        <Script id="theme-init" strategy="afterInteractive">{`
          (function(){
            try {
              var t = localStorage.getItem('theme');
              if (t === 'dark') document.documentElement.classList.add('dark');
            } catch(e) {}
          })();
        `}</Script>
        <Navbar />
        {children}
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
