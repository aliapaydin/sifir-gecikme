import { Inter, Lora, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-serif',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Sıfır Gecikme — Türkçe veri bilimi',
  description: 'İnteraktif simülasyonlar, Türkçe vaka çalışmaları ve veri kariyeri üzerine yazılar.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={`${inter.variable} ${lora.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
