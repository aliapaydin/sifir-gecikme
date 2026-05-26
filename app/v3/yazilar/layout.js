import ZiyaretTakip from '../../../components/ZiyaretTakip';
import AnladimButonlar from '../../../components/AnladimButonlar';

export default function V3YazilarLayout({ children }) {
  return (
    <>
      <ZiyaretTakip />
      {children}
      <div style={{ maxWidth: '768px', margin: '0 auto', padding: '0 24px 48px' }}>
        <AnladimButonlar />
      </div>
    </>
  );
}
