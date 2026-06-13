import SinavPage from '../../sinav/page';
export const metadata = { title: 'Sınav' };
export default function V3Sinav() {
  return <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: 'calc(100vh - 144px)' }}><SinavPage /></div>;
}
