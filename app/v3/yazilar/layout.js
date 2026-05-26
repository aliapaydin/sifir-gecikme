import ZiyaretTakip from '../../../components/ZiyaretTakip';
import AnladimButonlar from '../../../components/AnladimButonlar';
import V3SupportBanner from '../components/V3SupportBanner';

export default function V3YazilarLayout({ children }) {
  return (
    <>
      <ZiyaretTakip />
      {children}
      <div style={{ maxWidth: '768px', margin: '0 auto', padding: '0 24px 48px' }}>
        <AnladimButonlar />
        <V3SupportBanner />
      </div>
    </>
  );
}
