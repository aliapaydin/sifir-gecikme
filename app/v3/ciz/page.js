import CizPage from '../../ciz/page';
export const metadata = { title: 'Rakam Çiz' };
export default function V3Ciz() {
  return <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: 'calc(100vh - 144px)' }}><CizPage /></div>;
}
