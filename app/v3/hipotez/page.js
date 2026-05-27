import HipotezPage from '../../hipotez/page';
export const metadata = { title: 'Hipotez Testi Seçici' };
export default function V3Hipotez() {
  return <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: 'calc(100vh - 144px)' }}><HipotezPage /></div>;
}
