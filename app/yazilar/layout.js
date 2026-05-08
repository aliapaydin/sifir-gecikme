import Yorumlar from '../../components/Yorumlar';

export default function YazilarLayout({ children }) {
  return (
    <>
      {children}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <Yorumlar />
      </div>
    </>
  );
}
