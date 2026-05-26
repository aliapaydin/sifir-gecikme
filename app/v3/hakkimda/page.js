import HakkimdaPage from '../../hakkimda/page';

export const metadata = { title: 'Hakkımda' };

export default function V3Hakkimda() {
  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: 'calc(100vh - 144px)' }}>
      <HakkimdaPage />
    </div>
  );
}
