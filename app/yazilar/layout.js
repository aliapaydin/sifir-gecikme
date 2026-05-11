import Yorumlar from '../../components/Yorumlar';
import SosyalPaylasim from '../../components/SosyalPaylasim';
import IlgiliIcerikler from '../../components/IlgiliIcerikler';
import ZiyaretTakip from '../../components/ZiyaretTakip';

export default function YazilarLayout({ children }) {
  return (
    <>
      <ZiyaretTakip />
      {children}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <IlgiliIcerikler />
        <SosyalPaylasim />
        <Yorumlar />
      </div>
    </>
  );
}
