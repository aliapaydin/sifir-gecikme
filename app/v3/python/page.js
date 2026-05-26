import PythonPage from '../../python/page';
export const metadata = { title: 'Python Playground' };
export default function V3Python() {
  return <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: 'calc(100vh - 144px)' }}><PythonPage /></div>;
}
