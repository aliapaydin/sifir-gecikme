'use client';

import { useState, useEffect, useMemo } from 'react';

const KATEGORILER = [
  { id: 'tumu', label: 'Tümü', emoji: '🌐' },
  { id: 'ogrenme', label: 'Öğrenme', emoji: '📚' },
  { id: 'pratik', label: 'Pratik', emoji: '🏆' },
  { id: 'veri', label: 'Veri', emoji: '🗄️' },
  { id: 'topluluk', label: 'Topluluk', emoji: '👥' },
  { id: 'arac', label: 'Araç', emoji: '🛠️' },
];

const SEVIYE = {
  'başlangıç': { bg: 'var(--color-accent-soft)', text: 'var(--color-accent-text)', label: 'başlangıç' },
  'orta': { bg: 'var(--color-purple-bg)', text: 'var(--color-purple-text)', label: 'orta' },
  'ileri': { bg: 'var(--color-amber-bg)', text: 'var(--color-amber-text)', label: 'ileri' },
  'tüm seviyeler': { bg: 'var(--color-border)', text: 'var(--color-text-soft)', label: 'herkese açık' },
};

const SITELER = [
  // Öğrenme
  {
    id: 1, kategori: 'ogrenme',
    isim: 'Kaggle Learn', url: 'kaggle.com/learn', href: 'https://www.kaggle.com/learn',
    ikon: '🎓', renk: '#1D9E75', seviye: 'başlangıç',
    ozet: 'Ücretsiz mini kurslar. Python, Pandas, ML, SQL — hepsi tarayıcıda, notebook\'la öğreniyorsun.',
    detay: 'Her kurs 4–6 saatte bitiyor. Bitirince sertifika veriyor. Başlamak için en kolay yer.',
    etiketler: ['Python', 'ML', 'SQL', 'Pandas', 'Ücretsiz'],
    puan: 5,
  },
  {
    id: 2, kategori: 'ogrenme',
    isim: 'fast.ai', url: 'fast.ai', href: 'https://www.fast.ai',
    ikon: '⚡', renk: '#f59e0b', seviye: 'orta',
    ozet: 'Önce çalışan model, sonra teori. Derin öğrenme için tartışmasız en iyi ücretsiz kurs.',
    detay: 'Jeremy Howard\'ın "top-down" öğretim felsefesi. Teoriye boğulmadan gerçek projelerle başlıyorsun.',
    etiketler: ['Deep Learning', 'PyTorch', 'Ücretsiz', 'Video'],
    puan: 5,
  },
  {
    id: 3, kategori: 'ogrenme',
    isim: 'StatQuest', url: 'youtube.com/@statquest', href: 'https://www.youtube.com/@statquest',
    ikon: '📊', renk: '#7F77DD', seviye: 'başlangıç',
    ozet: 'Josh Starmer\'ın videolarını bir izle, o kavramı bir daha unutma. PCA\'yı sonunda anlayacaksın.',
    detay: 'Animasyonlu şemalar, adım adım anlatım. İstatistik ve ML\'in herhangi bir konusunu aramak için ideal.',
    etiketler: ['İstatistik', 'ML', 'Video', 'Ücretsiz'],
    puan: 5,
  },
  {
    id: 4, kategori: 'ogrenme',
    isim: 'Coursera – ML Specialization', url: 'coursera.org', href: 'https://www.coursera.org/specializations/machine-learning-introduction',
    ikon: '🤖', renk: '#0284c7', seviye: 'orta',
    ozet: 'Andrew Ng\'in kursu. 30M+ öğrenci. ML\'in temelini anlamak istiyorsan hâlâ en iyisi.',
    detay: 'Ücretsiz izlenebiliyor, sertifika ücretli. Matematiği yumuşatılmış ama temel kavramları sağlam öğretiyor.',
    etiketler: ['ML', 'İstatistik', 'Python', 'Sertifika'],
    puan: 5,
  },
  {
    id: 5, kategori: 'ogrenme',
    isim: 'DataTalks.Club', url: 'datatalks.club', href: 'https://datatalks.club',
    ikon: '🎙️', renk: '#ec4899', seviye: 'orta',
    ozet: 'MLOps Zoomcamp, ML Zoomcamp, DE Zoomcamp — cohort bazlı, ücretsiz, topluluk destekli.',
    detay: 'Alexey Grigorev\'in kurduğu topluluk. Gerçek mühendislik pratikleri öğretiyor. Sertifika için proje teslim ediyorsun.',
    etiketler: ['MLOps', 'Data Engineering', 'Cohort', 'Ücretsiz'],
    puan: 4,
  },
  // Pratik
  {
    id: 6, kategori: 'pratik',
    isim: 'Kaggle', url: 'kaggle.com', href: 'https://www.kaggle.com',
    ikon: '🏆', renk: '#20beff', seviye: 'orta',
    ozet: 'Veri biliminin merkezi. Yarışmalar, 50K+ dataset, ücretsiz GPU, paylaşımlı notebooklar.',
    detay: 'Portfolyo için en etkili yer. Yarışmalara girip notebook paylaşmak işe başlarken büyük avantaj.',
    etiketler: ['Yarışma', 'GPU', 'Notebook', 'Dataset'],
    puan: 5,
  },
  {
    id: 7, kategori: 'pratik',
    isim: 'StrataScratch', url: 'stratascratch.com', href: 'https://www.stratascratch.com',
    ikon: '💼', renk: '#7F77DD', seviye: 'orta',
    ozet: 'Gerçek mülakat sorularını çöz. FAANG\'ın SQL ve Python sorularını kategorilere göre filtrele.',
    detay: 'Amazon, Meta, Netflix\'in gerçek mülakat soruları var. Mülakat hazırlığında LeetCode\'dan daha hedefe yönelik.',
    etiketler: ['Mülakat', 'SQL', 'Python', 'FAANG'],
    puan: 4,
  },
  {
    id: 8, kategori: 'pratik',
    isim: 'LeetCode', url: 'leetcode.com', href: 'https://www.leetcode.com',
    ikon: '⚔️', renk: '#f59e0b', seviye: 'orta',
    ozet: 'SQL soruları için güçlü. Data Engineering pozisyonlarında algoritma soruluyorsa buradan hazırlan.',
    detay: 'SQL bölümü ücretsiz ve kapsamlı. Easy\'den Hard\'a geçince ciddi bir farklılık hissediyorsun.',
    etiketler: ['SQL', 'Algoritma', 'Mülakat'],
    puan: 4,
  },
  {
    id: 9, kategori: 'pratik',
    isim: 'Papers With Code', url: 'paperswithcode.com', href: 'https://paperswithcode.com',
    ikon: '📄', renk: '#1D9E75', seviye: 'ileri',
    ozet: 'Her benchmark\'in SOTA sonuçlarını ve kod implementasyonlarını bir arada bul.',
    detay: 'Akademik makaleleri GitHub reposuyla eşleştiriyor. "Bu model nasıl çalışıyor?" sorusunun en hızlı cevabı.',
    etiketler: ['Araştırma', 'SOTA', 'Kod', 'Makale'],
    puan: 4,
  },
  // Veri
  {
    id: 10, kategori: 'veri',
    isim: 'Kaggle Datasets', url: 'kaggle.com/datasets', href: 'https://www.kaggle.com/datasets',
    ikon: '🗄️', renk: '#20beff', seviye: 'tüm seviyeler',
    ozet: '50.000+ dataset. Proje fikri arayanların ilk durağı. Hemen kullanılabilir, notebook\'a entegre.',
    detay: 'Proje yapacaksın ama veri bulamıyorsun? İlk adresin burası. Her konudan temiz dataset var.',
    etiketler: ['Dataset', 'Ücretsiz', 'CSV', 'API'],
    puan: 5,
  },
  {
    id: 11, kategori: 'veri',
    isim: 'UCI ML Repository', url: 'archive.ics.uci.edu', href: 'https://archive.ics.uci.edu',
    ikon: '🏛️', renk: '#e8a04a', seviye: 'tüm seviyeler',
    ozet: 'Akademik çalışmaların klasik kaynağı. Iris, Titanic, Heart Disease — hepsi burada.',
    detay: 'UC Irvine\'ın 1987\'den beri tuttuğu arşiv. ML makalelerinin çoğu buraya referans veriyor.',
    etiketler: ['Akademik', 'Klasik', 'Dataset', 'Ücretsiz'],
    puan: 4,
  },
  {
    id: 12, kategori: 'veri',
    isim: 'Google Dataset Search', url: 'datasetsearch.research.google.com', href: 'https://datasetsearch.research.google.com',
    ikon: '🔍', renk: '#4285f4', seviye: 'tüm seviyeler',
    ozet: 'Veri setleri için Google. Arama kutusuna ne yazarsan yaz, internetteki datasetleri buluyor.',
    detay: 'Niş konular için ideal. "Türkiye trafik kaza" gibi spesifik şeyler bile buluyor.',
    etiketler: ['Arama', 'Ücretsiz', 'Her Konu'],
    puan: 4,
  },
  {
    id: 13, kategori: 'veri',
    isim: 'Hugging Face Datasets', url: 'huggingface.co/datasets', href: 'https://huggingface.co/datasets',
    ikon: '🤗', renk: '#ff9d00', seviye: 'orta',
    ozet: 'NLP ve LLM çalışıyorsan olmazsa olmaz. 100K+ dataset, Python\'dan tek satırda yükle.',
    detay: '`datasets.load_dataset("imdb")` — tek satır, dataset hazır. LLM fine-tuning\'in standart kaynağı.',
    etiketler: ['NLP', 'LLM', 'API', 'Python'],
    puan: 5,
  },
  {
    id: 14, kategori: 'veri',
    isim: 'TürkStat / TÜİK', url: 'data.tuik.gov.tr', href: 'https://data.tuik.gov.tr',
    ikon: '🇹🇷', renk: '#dc2626', seviye: 'tüm seviyeler',
    ozet: 'Türkiye\'ye özgü projeler için resmi kaynak. Nüfus, ekonomi, istihdam verileri açık erişimde.',
    detay: 'Türkiye odaklı analizler yapacaksan TÜİK kaçınılmaz. CSV indirilebiliyor, API desteği sınırlı.',
    etiketler: ['Türkiye', 'Resmi', 'CSV', 'Ücretsiz'],
    puan: 3,
  },
  // Topluluk
  {
    id: 15, kategori: 'topluluk',
    isim: 'Towards Data Science', url: 'towardsdatascience.com', href: 'https://towardsdatascience.com',
    ikon: '✍️', renk: '#1D9E75', seviye: 'tüm seviyeler',
    ozet: 'En büyük veri bilimi yayın platformu. Günde 20+ yeni makale. Hem başlangıç hem ileri seviye.',
    detay: 'Medium altında yayınlıyor. Haber akışı için takip et, ya da spesifik konu aratarak bul.',
    etiketler: ['Blog', 'Makale', 'Python', 'Medium'],
    puan: 4,
  },
  {
    id: 16, kategori: 'topluluk',
    isim: 'r/datascience', url: 'reddit.com/r/datascience', href: 'https://www.reddit.com/r/datascience',
    ikon: '💬', renk: '#ff4500', seviye: 'tüm seviyeler',
    ozet: '2M+ üye. Kariyer soruları, araç tartışmaları, mülakat deneyimleri. Sektörün nabzını tut.',
    detay: '"Veri bilimi gerçekten ne işe yarıyor?" gibi dürüst sorulara dürüst cevaplar. Kariyer deneyimleri çok değerli.',
    etiketler: ['Topluluk', 'Kariyer', 'Tartışma', 'Reddit'],
    puan: 4,
  },
  {
    id: 17, kategori: 'topluluk',
    isim: 'Hugging Face', url: 'huggingface.co', href: 'https://huggingface.co',
    ikon: '🤗', renk: '#ff9d00', seviye: 'orta',
    ozet: 'AI\'ın GitHub\'ı. 500K+ model, topluluk forumları, Spaces. LLM dünyasının merkezi.',
    detay: 'Model hub, dataset hub, Spaces (ücretsiz hosting) hepsi burada. LLM çalışanlar için şart.',
    etiketler: ['LLM', 'Model', 'NLP', 'Topluluk'],
    puan: 5,
  },
  {
    id: 18, kategori: 'topluluk',
    isim: 'Data Elixir', url: 'dataelixir.com', href: 'https://dataelixir.com',
    ikon: '📰', renk: '#7F77DD', seviye: 'tüm seviyeler',
    ozet: 'Haftalık veri bilimi bülteni. Her haftanın en iyi makalelerini derli toplu inbox\'ına geliyor.',
    detay: 'Okuma listeni düzenlemek için harika. Sektörde neyin konuşulduğunu takip etmek isteyenler için.',
    etiketler: ['Bülten', 'Haftalık', 'Ücretsiz'],
    puan: 4,
  },
  // Araç
  {
    id: 19, kategori: 'arac',
    isim: 'Google Colab', url: 'colab.research.google.com', href: 'https://colab.research.google.com',
    ikon: '💻', renk: '#f9ab00', seviye: 'başlangıç',
    ozet: 'Ücretsiz GPU\'lu Jupyter notebook. Kurulum yok, paylaşım kolay. Başlayanlar için en iyi ortam.',
    detay: 'Ücretsiz T4 GPU var. Pro versiyonu ~10$/ay ile A100\'e erişim. Dosyalar Google Drive\'a kaydoluyor.',
    etiketler: ['Notebook', 'GPU', 'Ücretsiz', 'Google'],
    puan: 5,
  },
  {
    id: 20, kategori: 'arac',
    isim: 'Weights & Biases', url: 'wandb.ai', href: 'https://wandb.ai',
    ikon: '📈', renk: '#FFBE00', seviye: 'orta',
    ozet: 'ML deneylerini takip et, karşılaştır, görselleştir. Kişisel kullanım tamamen ücretsiz.',
    detay: 'Hangi hiperparametre daha iyi sonuç verdi? W&B olmadan bunu tutarlı takip etmek çok zor.',
    etiketler: ['MLOps', 'Experiment Tracking', 'Ücretsiz Plan'],
    puan: 4,
  },
  {
    id: 21, kategori: 'arac',
    isim: 'Streamlit', url: 'streamlit.io', href: 'https://streamlit.io',
    ikon: '🚀', renk: '#ff4b4b', seviye: 'başlangıç',
    ozet: 'Saf Python ile interaktif web uygulaması. Frontend bilmeden ML modelini kullanıcıya sun.',
    detay: '50 satır Python ile çalışan bir ML demo yapabilirsin. Portfolyo için gerçek bir fark yaratıyor.',
    etiketler: ['Web App', 'Python', 'Demo', 'Ücretsiz'],
    puan: 5,
  },
  {
    id: 22, kategori: 'arac',
    isim: 'Gradio', url: 'gradio.app', href: 'https://www.gradio.app',
    ikon: '🎛️', renk: '#fd7e14', seviye: 'başlangıç',
    ozet: 'ML modeli için anında arayüz. 5 satırda çalışan bir demo hazırla, Hugging Face\'de yayınla.',
    detay: 'Hugging Face Spaces ile entegre. Özellikle LLM ve görüntü modelleri için en hızlı demo yolu.',
    etiketler: ['Demo', 'Python', 'HuggingFace', 'Ücretsiz'],
    puan: 4,
  },
  {
    id: 23, kategori: 'arac',
    isim: 'DBeaver', url: 'dbeaver.io', href: 'https://dbeaver.io',
    ikon: '🐦', renk: '#5294e2', seviye: 'tüm seviyeler',
    ozet: 'Her veritabanına bağlanan ücretsiz SQL istemcisi. PostgreSQL, MySQL, SQLite — tek arayüz.',
    detay: 'Data Analyst\'ın vazgeçilmezi. Community Edition tamamen ücretsiz. ER diyagramı otomatik çiziyor.',
    etiketler: ['SQL', 'Database', 'Ücretsiz', 'Desktop'],
    puan: 4,
  },
];

function Yildiz({ puan }) {
  return (
    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          style={{
            width: 6, height: 6, borderRadius: '50%',
            background: i <= puan ? '#f59e0b' : 'var(--color-border)',
            transition: 'background 0.2s',
          }}
        />
      ))}
    </div>
  );
}

function SiteKarti({ site, favori, onFavoriToggle, gecikmeli }) {
  const sev = SEVIYE[site.seviye] || SEVIYE['tüm seviyeler'];
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--color-cream-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '14px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        transform: hover ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hover
          ? `0 8px 24px rgba(0,0,0,0.12), 0 0 0 1px ${site.renk}33`
          : '0 1px 4px rgba(0,0,0,0.06)',
        animation: `fadeUp 0.35s ease both`,
        animationDelay: `${gecikmeli * 40}ms`,
      }}
    >
      {/* Renkli üst şerit */}
      <div style={{ height: 4, background: site.renk, width: '100%' }} />

      <div style={{ padding: '18px 20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Başlık satırı */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: `${site.renk}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
              border: `1.5px solid ${site.renk}33`,
            }}>
              {site.ikon}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--color-text)', lineHeight: 1.3 }}>
                {site.isim}
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-mute)', marginTop: 2, fontFamily: 'monospace' }}>
                {site.url}
              </div>
            </div>
          </div>
          <button
            onClick={() => onFavoriToggle(site.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 16, padding: 2, flexShrink: 0,
              opacity: favori ? 1 : 0.35,
              transition: 'opacity 0.15s, transform 0.15s',
              transform: favori ? 'scale(1.1)' : 'scale(1)',
            }}
            title={favori ? 'Favorilerden çıkar' : 'Favorilere ekle'}
          >
            ⭐
          </button>
        </div>

        {/* Seviye + puan */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            display: 'inline-block',
            padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500,
            background: sev.bg, color: sev.text,
          }}>
            {sev.label}
          </span>
          <Yildiz puan={site.puan} />
        </div>

        {/* Özet */}
        <p style={{ fontSize: 13.5, color: 'var(--color-text-soft)', lineHeight: 1.6, margin: 0, flex: 1 }}>
          {site.ozet}
        </p>

        {/* Detay notu */}
        <p style={{
          fontSize: 12, color: 'var(--color-text-mute)', lineHeight: 1.5, margin: 0,
          padding: '8px 10px', background: 'var(--color-bg)', borderRadius: 8,
          borderLeft: `2.5px solid ${site.renk}`,
        }}>
          {site.detay}
        </p>

        {/* Etiketler */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {site.etiketler.map(e => (
            <span key={e} style={{
              fontSize: 11, padding: '2px 7px', borderRadius: 12,
              background: 'var(--color-bg)', color: 'var(--color-text-mute)',
              border: '1px solid var(--color-border)',
            }}>
              {e}
            </span>
          ))}
        </div>

        {/* Ziyaret et */}
        <a
          href={site.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '9px 0', borderRadius: 9, fontSize: 13, fontWeight: 500,
            background: hover ? site.renk : 'var(--color-bg)',
            color: hover ? '#fff' : site.renk,
            border: `1.5px solid ${site.renk}`,
            textDecoration: 'none',
            transition: 'background 0.18s, color 0.18s',
          }}
        >
          Ziyaret Et
          <span style={{ fontSize: 12, opacity: 0.8 }}>→</span>
        </a>
      </div>
    </div>
  );
}

export default function VeriSiteleri() {
  const [aktifKategori, setAktifKategori] = useState('tumu');
  const [arama, setArama] = useState('');
  const [favoriler, setFavoriler] = useState([]);
  const [sadeceF, setSadeceF] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const f = JSON.parse(localStorage.getItem('sz_site_favorileri') || '[]');
      if (Array.isArray(f)) setFavoriler(f);
    } catch {}
  }, []);

  function favoriToggle(id) {
    setFavoriler(prev => {
      const yeni = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try { localStorage.setItem('sz_site_favorileri', JSON.stringify(yeni)); } catch {}
      return yeni;
    });
  }

  const filtrelenmis = useMemo(() => {
    let liste = SITELER;
    if (aktifKategori !== 'tumu') liste = liste.filter(s => s.kategori === aktifKategori);
    if (sadeceF) liste = liste.filter(s => favoriler.includes(s.id));
    if (arama.trim()) {
      const q = arama.toLowerCase();
      liste = liste.filter(s =>
        s.isim.toLowerCase().includes(q) ||
        s.ozet.toLowerCase().includes(q) ||
        s.etiketler.some(e => e.toLowerCase().includes(q))
      );
    }
    return liste;
  }, [aktifKategori, arama, sadeceF, favoriler]);

  const kategoriSayisi = (id) => {
    if (id === 'tumu') return SITELER.length;
    return SITELER.filter(s => s.kategori === id).length;
  };

  return (
    <main className="min-h-screen">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <article style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Breadcrumb */}
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-mute)', textDecoration: 'none', marginBottom: 20 }}>
          ← Ana Sayfa
        </a>

        {/* Hero */}
        <div style={{ marginBottom: 40 }}>
          <span className="badge badge-guide" style={{ marginBottom: 12, display: 'inline-block' }}>rehber</span>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2, marginBottom: 14, letterSpacing: '-0.02em', fontFamily: 'Georgia, serif' }}>
            Veri Bilimcinin Yer İmleri
          </h1>
          <p style={{ fontSize: 16, color: 'var(--color-text-soft)', lineHeight: 1.7, maxWidth: 620, margin: '0 0 20px' }}>
            Öğrenmek, pratik yapmak, veri bulmak, toplulukla takipte kalmak — her aşama için en faydalı siteler, kısa notlarla.
          </p>

          {/* İstatistik satırı */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'site', deger: SITELER.length, renk: '#1D9E75' },
              { label: 'kategori', deger: 5, renk: '#7F77DD' },
              { label: 'ücretsiz', deger: '18+', renk: '#f59e0b' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: s.renk }}>{s.deger}</span>
                <span style={{ fontSize: 13, color: 'var(--color-text-mute)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Kontroller */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--color-bg)', paddingBottom: 16, paddingTop: 8, borderBottom: '1px solid var(--color-border)', marginBottom: 28 }}>
          {/* Arama */}
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--color-text-mute)' }}>🔍</span>
            <input
              type="text"
              placeholder="Site adı, araç veya etiket ara..."
              value={arama}
              onChange={e => setArama(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '10px 14px 10px 36px',
                border: '1.5px solid var(--color-border)',
                borderRadius: 10, fontSize: 14,
                background: 'var(--color-cream-card)', color: 'var(--color-text)',
                outline: 'none',
              }}
            />
            {arama && (
              <button onClick={() => setArama('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-mute)', fontSize: 16 }}>×</button>
            )}
          </div>

          {/* Kategori filtreleri */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            {KATEGORILER.map(k => {
              const aktif = aktifKategori === k.id;
              return (
                <button
                  key={k.id}
                  onClick={() => setAktifKategori(k.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '6px 12px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
                    border: `1.5px solid ${aktif ? '#1D9E75' : 'var(--color-border)'}`,
                    background: aktif ? '#1D9E75' : 'var(--color-cream-card)',
                    color: aktif ? '#fff' : 'var(--color-text-soft)',
                    fontWeight: aktif ? 600 : 400,
                    transition: 'all 0.15s',
                  }}
                >
                  <span>{k.emoji}</span>
                  <span>{k.label}</span>
                  <span style={{ fontSize: 11, opacity: 0.75 }}>({kategoriSayisi(k.id)})</span>
                </button>
              );
            })}

            {/* Favoriler toggle */}
            <button
              onClick={() => setSadeceF(p => !p)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
                border: `1.5px solid ${sadeceF ? '#f59e0b' : 'var(--color-border)'}`,
                background: sadeceF ? '#f59e0b' : 'var(--color-cream-card)',
                color: sadeceF ? '#fff' : 'var(--color-text-soft)',
                fontWeight: sadeceF ? 600 : 400,
                transition: 'all 0.15s',
                marginLeft: 'auto',
              }}
            >
              ⭐ Favorilerim {favoriler.length > 0 && `(${favoriler.length})`}
            </button>
          </div>
        </div>

        {/* Sonuç sayısı */}
        {(arama || aktifKategori !== 'tumu' || sadeceF) && (
          <p style={{ fontSize: 13, color: 'var(--color-text-mute)', marginBottom: 16 }}>
            {filtrelenmis.length} site bulundu
          </p>
        )}

        {/* Boş durum */}
        {filtrelenmis.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-mute)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 15 }}>"{arama}" için sonuç bulunamadı.</p>
            <button onClick={() => { setArama(''); setAktifKategori('tumu'); setSadeceF(false); }} style={{ marginTop: 12, padding: '8px 16px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: 13 }}>
              Filtreleri temizle
            </button>
          </div>
        )}

        {/* Kart grid */}
        {mounted && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 18,
          }}>
            {filtrelenmis.map((site, i) => (
              <SiteKarti
                key={site.id}
                site={site}
                favori={favoriler.includes(site.id)}
                onFavoriToggle={favoriToggle}
                gecikmeli={i}
              />
            ))}
          </div>
        )}

        {/* Alt not */}
        {filtrelenmis.length > 0 && !arama && !sadeceF && (
          <p style={{ fontSize: 12, color: 'var(--color-text-mute)', textAlign: 'center', marginTop: 40, lineHeight: 1.6 }}>
            Bu liste kişisel deneyimlere dayanıyor — sürekli güncelleniyor. Önerdiğin bir site varsa yorumlarda belirt.
          </p>
        )}
      </article>
    </main>
  );
}
