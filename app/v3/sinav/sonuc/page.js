import SinavSonucPage from '../../../sinav/sonuc/page';
export const metadata = { title: 'Sınav Sonucu' };
export default function V3SinavSonuc() {
  return <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: 'calc(100vh - 144px)' }}><SinavSonucPage /></div>;
}
