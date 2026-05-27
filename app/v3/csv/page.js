import CsvPage from '../../csv/page';
export const metadata = { title: 'CSV Analiz Aracı' };
export default function V3Csv() {
  return <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: 'calc(100vh - 144px)' }}><CsvPage /></div>;
}
