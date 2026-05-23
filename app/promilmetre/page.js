import PromilmetreApp from './PromilmetreApp';

export const metadata = {
  title: 'Alkol Promilmetre — Sıfır Gecikme',
  description: "Türkiye'de satılan içeceklerle kan alkol seviyeni hesapla. Widmark formülü, AI analizi ve trafik uyarısı.",
};

export default function PromilmeterePage() {
  return <PromilmetreApp />;
}
