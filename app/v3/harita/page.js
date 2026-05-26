import HaritaPage from '../../harita/page';
export const metadata = { title: 'Haritam' };
export default function V3Harita() {
  return <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: 'calc(100vh - 144px)' }}><HaritaPage /></div>;
}
