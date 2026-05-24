import Yorumlar from '../../components/Yorumlar';
import SosyalPaylasim from '../../components/SosyalPaylasim';
import IlgiliIcerikler from '../../components/IlgiliIcerikler';
import ZiyaretTakip from '../../components/ZiyaretTakip';
import AnladimButonlar from '../../components/AnladimButonlar';
import SupporterCard from '../../components/SupporterCard';

export default function YazilarLayout({ children }) {
  return (
    <>
      <ZiyaretTakip />
      {children}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <AnladimButonlar />
        <SupporterCard />
        <IlgiliIcerikler />
        <SosyalPaylasim />
        <Yorumlar />
      </div>
    </>
  );
}
