import Yorumlar from '../../components/Yorumlar';
import SosyalPaylasim from '../../components/SosyalPaylasim';
import IlgiliIcerikler from '../../components/IlgiliIcerikler';
import ZiyaretTakip from '../../components/ZiyaretTakip';
import AnladimButonlar from '../../components/AnladimButonlar';
import SupporterCard from '../../components/SupporterCard';
import AdWrapper from '../../components/AdWrapper';

export default function YazilarLayout({ children }) {
  return (
    <>
      <ZiyaretTakip />
      {children}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <AnladimButonlar />
        <SupporterCard />
        <AdWrapper slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT} />
        <IlgiliIcerikler />
        <SosyalPaylasim />
        <Yorumlar />
      </div>
    </>
  );
}
