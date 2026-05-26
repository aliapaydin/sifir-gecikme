import SqlPage from '../../sql/page';
export const metadata = { title: 'SQL Playground' };
export default function V3Sql() {
  return <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: 'calc(100vh - 144px)' }}><SqlPage /></div>;
}
