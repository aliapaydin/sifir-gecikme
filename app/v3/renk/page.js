import RenkPage from '../../renk/page';
export const metadata = { title: 'Renk Paleti Seçici' };
export default function V3Renk() {
  return <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: 'calc(100vh - 144px)' }}><RenkPage /></div>;
}
