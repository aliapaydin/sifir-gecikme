import HipotezArac from './HipotezArac';

export const metadata = {
  title: 'Hipotez Testi Seçici',
  description: 'Doğru istatistiksel testi seçin: t-testi, ANOVA, ki-kare, oran z-testi. Parametreleri girin, p-değerini hesaplayın.',
};

export default function HipotezPage() {
  return <HipotezArac />;
}
