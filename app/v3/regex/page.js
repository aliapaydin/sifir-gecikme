import RegexPage from '../../regex/page';
export const metadata = { title: 'Regex Tester' };
export default function V3Regex() {
  return <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: 'calc(100vh - 144px)' }}><RegexPage /></div>;
}
