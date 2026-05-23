'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

// ─── Türkiye İçecek Veritabanı ──────────────────────────────────────────────

const ICECEKLER = {
  'Bira': [
    { ad: 'Efes Pilsen',           abv: 5.0, standartMl: 330 },
    { ad: 'Efes Dark',             abv: 6.0, standartMl: 330 },
    { ad: 'Bomonti Fıçı',          abv: 5.0, standartMl: 330 },
    { ad: 'Bomonti Süzme',         abv: 5.0, standartMl: 330 },
    { ad: 'Tuborg Gold',           abv: 5.0, standartMl: 330 },
    { ad: 'Tuborg Green',          abv: 5.0, standartMl: 330 },
    { ad: 'Carlsberg',             abv: 5.0, standartMl: 330 },
    { ad: 'Heineken',              abv: 5.0, standartMl: 330 },
    { ad: 'Miller',                abv: 4.7, standartMl: 330 },
    { ad: 'Corona Extra',          abv: 4.6, standartMl: 330 },
    { ad: 'Desperados',            abv: 5.9, standartMl: 330 },
    { ad: 'Erdinger Weissbier',    abv: 5.3, standartMl: 500 },
    { ad: 'Paulaner Weissbier',    abv: 5.5, standartMl: 500 },
    { ad: 'Leffe Blonde',          abv: 6.6, standartMl: 330 },
    { ad: 'Guinness Draught',      abv: 4.2, standartMl: 440 },
    { ad: 'Stella Artois',         abv: 5.0, standartMl: 330 },
    { ad: 'Peroni Nastro Azzurro', abv: 5.1, standartMl: 330 },
  ],
  'Rakı': [
    { ad: 'Yeni Rakı',          abv: 45.0, standartMl: 45 },
    { ad: 'Tekirdağ Altın',     abv: 47.5, standartMl: 45 },
    { ad: 'Tekirdağ Standart',  abv: 45.0, standartMl: 45 },
    { ad: 'Altınbaş Rakı',      abv: 45.0, standartMl: 45 },
    { ad: 'Efe Rakı',           abv: 45.0, standartMl: 45 },
  ],
  'Şarap': [
    { ad: 'Kavaklidere Angora Kırmızı', abv: 12.5, standartMl: 150 },
    { ad: 'Kavaklidere Çankaya Beyaz',  abv: 12.0, standartMl: 150 },
    { ad: 'Doluca Antik Kırmızı',       abv: 12.5, standartMl: 150 },
    { ad: 'Doluca Antik Beyaz',         abv: 11.5, standartMl: 150 },
    { ad: 'Vinkara Likya',              abv: 14.0, standartMl: 150 },
    { ad: 'Prosecco',                   abv: 11.0, standartMl: 150 },
  ],
  'Viski & Cin': [
    { ad: "Johnnie Walker Red Label", abv: 40.0, standartMl: 45 },
    { ad: "Jack Daniel's",            abv: 40.0, standartMl: 45 },
    { ad: 'Jameson',                  abv: 40.0, standartMl: 45 },
    { ad: "Gordon's Gin",             abv: 37.5, standartMl: 45 },
    { ad: 'Hendricks Gin',            abv: 41.4, standartMl: 45 },
  ],
  'Vodka & Diğer': [
    { ad: 'Absolut Vodka',      abv: 40.0, standartMl: 45 },
    { ad: 'Smirnoff Vodka',     abv: 37.5, standartMl: 45 },
    { ad: 'Bacardi Rum',        abv: 37.5, standartMl: 45 },
    { ad: 'José Cuervo Tekila', abv: 38.0, standartMl: 45 },
    { ad: 'Baileys',            abv: 17.0, standartMl: 50 },
  ],
  'Hazır Kokteyl': [
    { ad: 'Bacardi Breezer',  abv: 4.0, standartMl: 275 },
    { ad: 'Smirnoff Ice',     abv: 5.0, standartMl: 275 },
    { ad: 'Hard Seltzer',     abv: 5.0, standartMl: 330 },
    { ad: 'Corona Chill',     abv: 3.2, standartMl: 330 },
  ],
};

const KATEGORILER = Object.keys(ICECEKLER);

const YEMEK_SECENEK = [
  { value: 'empty', label: 'Aç Karın',           desc: 'Hiçbir şey yemedim',      carpan: 1.15, emoji: '😤' },
  { value: 'light', label: 'Hafif Atıştırmalık', desc: 'Kuruyemiş, cips vb.',     carpan: 1.0,  emoji: '🥨' },
  { value: 'meal',  label: 'Normal Öğün',         desc: 'Makul yemek yedim',       carpan: 0.82, emoji: '🍽️' },
  { value: 'heavy', label: 'Ağır / Yağlı Öğün',  desc: 'Dollu karın, yağlı yemek', carpan: 0.72, emoji: '🥩' },
];

const ICKI_SECENEK = [
  { value: 'none',  label: 'İçmiyorum',    desc: 'Sadece alkol',         carpan: 1.0,  emoji: '🚫' },
  { value: 'water', label: 'Su',           desc: 'Çok su içiyorum',      carpan: 0.96, emoji: '💧' },
  { value: 'ayran', label: 'Ayran',        desc: 'Yoğurt bazlı',         carpan: 0.94, emoji: '🥛' },
  { value: 'tea',   label: 'Çay / Kahve',  desc: 'Kafeinsiz etki',       carpan: 1.0,  emoji: '☕' },
  { value: 'cola',  label: 'Kola / Gazlı', desc: 'Emilimi hızlandırır',  carpan: 1.06, emoji: '🥤' },
];

// ─── Hesaplama ───────────────────────────────────────────────────────────────

const alkolGram = (ml, abv) => ml * (abv / 100) * 0.789;

function hesaplaPromil(icecekler, kilo, cinsiyet, yemek, icki) {
  if (!kilo || kilo <= 0 || !icecekler.length) return 0;
  const totalGram = icecekler.reduce((s, i) => s + alkolGram(i.ml, i.abv), 0);
  if (totalGram <= 0) return 0;
  const r = cinsiyet === 'male' ? 0.7 : 0.6;
  const base = totalGram / (kilo * r);
  const yC = YEMEK_SECENEK.find(y => y.value === yemek)?.carpan ?? 1.0;
  const iC = ICKI_SECENEK.find(c => c.value === icki)?.carpan ?? 1.0;
  return parseFloat((base * yC * iC).toFixed(3));
}

function getStatus(p) {
  if (p < 0.05) return { label: 'Temiz',           color: '#22c55e', bg: '#dcfce7', border: '#86efac', trafik: false };
  if (p < 0.30) return { label: 'Çok Düşük',       color: '#65a30d', bg: '#ecfccb', border: '#a3e635', trafik: false };
  if (p < 0.50) return { label: 'Düşük',           color: '#ca8a04', bg: '#fef9c3', border: '#fde047', trafik: false, uyari: 'Yasal sınıra yaklaşıyorsun — dikkat!' };
  if (p < 0.80) return { label: 'Sınır Üstünde',   color: '#ea580c', bg: '#ffedd5', border: '#fb923c', trafik: true };
  if (p < 1.50) return { label: 'Yüksek',          color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', trafik: true };
  return               { label: 'Tehlikeli',        color: '#991b1b', bg: '#fecaca', border: '#f87171', trafik: true };
}

// ─── SVG Gösterge ─────────────────────────────────────────────────────────────

function Gauge({ promil }) {
  const maxPromil = 2.0;
  const pct       = Math.min(promil / maxPromil, 1.0);
  const r         = 90;
  const cx        = 120;
  const cy        = 115;
  const half      = Math.PI * r;    // ≈ 282.74
  const full      = 2 * Math.PI * r; // ≈ 565.49
  const fillDash  = pct * half;
  const status    = getStatus(promil);

  // Needle angle: 0‰ = left (π), max = right (2π), midpoint = top (3π/2)
  const needleAngle = Math.PI * (1 + pct);
  const needleLen   = 68;
  const nx = cx + needleLen * Math.cos(needleAngle);
  const ny = cy + needleLen * Math.sin(needleAngle);

  // Scale markers at 0, 0.5 (limit), 1.0, 1.5, 2.0
  const markers = [
    { pct: 0,     label: '0',    important: false },
    { pct: 0.25,  label: '0.50', important: true  },
    { pct: 0.5,   label: '1.0',  important: false },
    { pct: 0.75,  label: '1.5',  important: false },
    { pct: 1.0,   label: '2.0‰', important: false },
  ];

  return (
    <svg
      viewBox="0 0 240 142"
      style={{ width: '100%', maxWidth: 320, display: 'block', margin: '0 auto' }}
      aria-label={`Promil göstergesi: ${promil.toFixed(2)}‰`}
    >
      <defs>
        <linearGradient id="pgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#22c55e" />
          <stop offset="30%"  stopColor="#84cc16" />
          <stop offset="55%"  stopColor="#eab308" />
          <stop offset="70%"  stopColor="#f97316" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <filter id="pgGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="needleGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background track */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={16}
        strokeDasharray={`${half} ${half}`}
        strokeDashoffset={half}
        strokeLinecap="round"
        opacity={0.35}
      />

      {/* Colored fill */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="url(#pgGrad)"
        strokeWidth={16}
        strokeDasharray={`${fillDash} ${full - fillDash}`}
        strokeDashoffset={half}
        strokeLinecap="round"
        style={{
          transition: 'stroke-dasharray 0.65s cubic-bezier(0.4,0,0.2,1)',
          filter: promil > 0 ? 'url(#pgGlow)' : 'none',
        }}
      />

      {/* 0.50‰ limit tick */}
      {(() => {
        const limitPct   = 0.5 / maxPromil;
        const limitAngle = Math.PI * (1 + limitPct);
        const inner = r - 12, outer = r + 4;
        return (
          <line
            x1={cx + inner * Math.cos(limitAngle)}
            y1={cy + inner * Math.sin(limitAngle)}
            x2={cx + outer * Math.cos(limitAngle)}
            y2={cy + outer * Math.sin(limitAngle)}
            stroke="#f97316"
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={0.85}
          />
        );
      })()}

      {/* Needle */}
      <line
        x1={cx} y1={cy}
        x2={nx} y2={ny}
        stroke={status.color}
        strokeWidth={3.5}
        strokeLinecap="round"
        style={{
          transition: 'all 0.65s cubic-bezier(0.4,0,0.2,1)',
          filter: 'url(#needleGlow)',
        }}
      />
      <circle
        cx={cx} cy={cy} r={7}
        fill={status.color}
        style={{ transition: 'fill 0.4s' }}
      />
      <circle cx={cx} cy={cy} r={3} fill="#fff" opacity={0.8} />

      {/* Center promil value */}
      <text
        x={cx} y={cy - 22}
        textAnchor="middle"
        fontSize="30"
        fontWeight="800"
        fill={status.color}
        fontFamily="system-ui, sans-serif"
        style={{ transition: 'fill 0.4s' }}
      >
        {promil.toFixed(2)}
      </text>
      <text
        x={cx} y={cy - 6}
        textAnchor="middle"
        fontSize="12"
        fill="var(--color-text-mute)"
        fontFamily="system-ui, sans-serif"
      >
        promil (‰)
      </text>

      {/* Scale labels */}
      <text x={24}  y={cy + 22} textAnchor="middle" fontSize="9" fill="var(--color-text-mute)" fontFamily="system-ui">0</text>
      <text x={cx}  y={cy - 98} textAnchor="middle" fontSize="9" fill="var(--color-text-mute)" fontFamily="system-ui">1.0</text>
      <text x={216} y={cy + 22} textAnchor="middle" fontSize="9" fill="var(--color-text-mute)" fontFamily="system-ui">2.0‰</text>

      {/* 0.50 label near the tick */}
      <text x={cx + 100 * Math.cos(Math.PI * 1.25)} y={cy + 100 * Math.sin(Math.PI * 1.25) - 4}
        textAnchor="middle" fontSize="8.5" fill="#f97316" fontWeight="700" fontFamily="system-ui" opacity={0.9}>
        0.50
      </text>
    </svg>
  );
}

// ─── Ana Bileşen ─────────────────────────────────────────────────────────────

const inp = {
  width: '100%',
  padding: '0.6rem 0.75rem',
  borderRadius: '8px',
  border: '0.5px solid var(--color-border)',
  background: 'var(--color-cream)',
  color: 'var(--color-text)',
  fontSize: '0.875rem',
  outline: 'none',
  boxSizing: 'border-box',
};

const card = {
  background: 'var(--color-cream-card)',
  border: '0.5px solid var(--color-border)',
  borderRadius: '12px',
  padding: '1rem',
  marginBottom: '0.75rem',
};

export default function PromilmetreApp() {
  const [kategori,   setKategori]   = useState('Bira');
  const [secili,     setSecili]     = useState('');
  const [miktar,     setMiktar]     = useState('');
  const [eklenenler, setEklenenler] = useState([]);
  const [yemek,      setYemek]      = useState('meal');
  const [icki,       setIcki]       = useState('none');
  const [profilAcik, setProfilAcik] = useState(false);
  const [profil,     setProfil]     = useState({ kilo: 70, cinsiyet: 'male' });
  const [aiYukleniyor, setAiYukleniyor] = useState(false);
  const [aiSonuc,    setAiSonuc]    = useState('');
  const [aiHata,     setAiHata]     = useState('');
  const [hidrated,   setHidrated]   = useState(false);

  useEffect(() => {
    setHidrated(true);
    try {
      const saved = localStorage.getItem('promilmetre-profil');
      if (saved) setProfil(JSON.parse(saved));
    } catch {}
  }, []);

  const updateProfil = useCallback((key, val) => {
    setProfil(prev => {
      const next = { ...prev, [key]: val };
      try { localStorage.setItem('promilmetre-profil', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const icecekler = ICECEKLER[kategori] || [];
  const seciliIcecek = icecekler.find(i => i.ad === secili);

  const handleKategoriDegis = (kat) => {
    setKategori(kat);
    setSecili('');
    setMiktar('');
  };

  const handleIcecekDegis = (ad) => {
    setSecili(ad);
    const ic = (ICECEKLER[kategori] || []).find(i => i.ad === ad);
    if (ic) setMiktar(String(ic.standartMl));
  };

  const ekle = () => {
    if (!secili || !miktar || Number(miktar) <= 0) return;
    const ic = seciliIcecek;
    if (!ic) return;
    setEklenenler(prev => [
      ...prev,
      { id: Date.now(), kategori, ad: ic.ad, abv: ic.abv, ml: Number(miktar) },
    ]);
    setSecili('');
    setMiktar('');
  };

  const sil = (id) => setEklenenler(prev => prev.filter(i => i.id !== id));

  const promil = useMemo(
    () => hesaplaPromil(eklenenler, profil.kilo, profil.cinsiyet, yemek, icki),
    [eklenenler, profil.kilo, profil.cinsiyet, yemek, icki]
  );
  const status = getStatus(promil);

  const toplamAlkolGram = useMemo(
    () => eklenenler.reduce((s, i) => s + alkolGram(i.ml, i.abv), 0),
    [eklenenler]
  );

  // Saat 0.50‰ altına inene kadar (metabolizma ~0.15‰/saat)
  const saatKaldi = promil > 0.50 ? ((promil - 0.50) / 0.15).toFixed(1) : null;
  const sifiraKadar = promil > 0 ? (promil / 0.15).toFixed(1) : null;

  const aiAnaliz = async () => {
    if (!eklenenler.length) return;
    setAiYukleniyor(true);
    setAiSonuc('');
    setAiHata('');
    const icerekStr = eklenenler
      .map(i => `${i.ad} (${i.ml} ml, %${i.abv})`)
      .join(', ');
    const yemekLabel = YEMEK_SECENEK.find(y => y.value === yemek)?.label || yemek;
    const ickiLabel  = ICKI_SECENEK.find(c => c.value === icki)?.label || icki;
    const prompt = `Kullanıcı aşağıdaki alkollü içecekleri içti: ${icerekStr}.
Toplam saf alkol: ${toplamAlkolGram.toFixed(1)} gram.
Hesaplanan kan alkol seviyesi: ${promil.toFixed(2)}‰
Kişisel bilgiler: ${profil.kilo} kg, ${profil.cinsiyet === 'male' ? 'Erkek' : 'Kadın'}.
Mide durumu: ${yemekLabel}. Alkolsüz içecek: ${ickiLabel}.
Türkiye'de alkollü araç kullanım yasal sınırı 0.50‰'dir.

Lütfen şunları belirt:
1. Bu promil seviyesi nasıl bir etki yaratır (kısa, samimi).
2. Yaklaşık kaç saat sonra araç kullanılabilir (saatte ~0.15‰ metabolize olur).
3. 2-3 pratik öneri (su, yemek, uyku vb.).
Kısa, samimi, Türkçe yaz. Markdown kullanma. Paragraf yaz.`;
    try {
      const res  = await fetch('/api/kalori-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI isteği başarısız.');
      setAiSonuc(data.text);
    } catch (err) {
      setAiHata('AI analizi alınamadı: ' + (err?.message || ''));
    } finally {
      setAiYukleniyor(false);
    }
  };

  const temizle = () => {
    setEklenenler([]);
    setAiSonuc('');
    setAiHata('');
  };

  if (!hidrated) return null;

  const gaugeCard = (
    <div style={{
      ...card,
      textAlign: 'center',
      background: `linear-gradient(135deg, ${status.bg}55, var(--color-cream-card))`,
      border: `0.5px solid ${status.border}`,
      transition: 'background 0.5s, border-color 0.5s',
    }}>
      <Gauge promil={promil} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
          background: status.bg, border: `1px solid ${status.border}`,
          borderRadius: '9999px', padding: '0.3rem 0.9rem', transition: 'all 0.4s',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: status.color, transition: 'background 0.4s' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: status.color, transition: 'color 0.4s' }}>
            {status.label}
          </span>
        </div>
      </div>
      {(saatKaldi || sifiraKadar) && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.875rem', flexWrap: 'wrap' }}>
          {saatKaldi && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f97316' }}>{saatKaldi} saat</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-text-mute)' }}>yasal sınır altı</div>
            </div>
          )}
          {sifiraKadar && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-text-soft)' }}>{sifiraKadar} saat</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-text-mute)' }}>tamamen temiz</div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const trafikUyari = status.trafik ? (
    <div style={{
      background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
      borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '0.75rem',
      display: 'flex', alignItems: 'center', gap: '0.75rem',
    }}>
      <div style={{ fontSize: '1.75rem', flexShrink: 0 }}>🚫</div>
      <div>
        <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>TRAFİĞE ÇIKMA!</div>
        <div style={{ color: '#fecaca', fontSize: '0.78rem', marginTop: '0.15rem', lineHeight: 1.4 }}>
          Türkiye'de yasal sınır 0.50‰ — şu an {promil.toFixed(2)}‰ ile bu sınırın üzerindesin.
          {saatKaldi && ` Yaklaşık ${saatKaldi} saat bekle.`}
        </div>
      </div>
    </div>
  ) : status.uyari ? (
    <div style={{
      background: '#fef3c7', border: '0.5px solid #fcd34d', borderRadius: '10px',
      padding: '0.7rem 1rem', marginBottom: '0.75rem',
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      color: '#92400e', fontSize: '0.82rem', fontWeight: 600,
    }}>
      ⚠️ {status.uyari}
    </div>
  ) : null;

  const iceciListesi = eklenenler.length > 0 ? (
    <div style={card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
          İçilen İçecekler
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)' }}>
            Toplam: <strong style={{ color: 'var(--color-text)' }}>{toplamAlkolGram.toFixed(1)} g</strong> alkol
          </span>
          <button onClick={temizle} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.72rem', color: '#ef4444', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
            Temizle
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {eklenenler.map(ic => (
          <div key={ic.id} style={{
            background: 'var(--color-cream)', border: '0.5px solid var(--color-border)',
            borderRadius: '8px', padding: '0.5rem 0.75rem',
            display: 'flex', alignItems: 'center', gap: '0.625rem',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--color-text)' }}>{ic.ad}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)' }}>
                {ic.ml} ml · %{ic.abv} · {alkolGram(ic.ml, ic.abv).toFixed(1)} g alkol
              </div>
            </div>
            <button
              onClick={() => sil(ic.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-mute)', fontSize: '0.85rem', padding: '0.25rem', transition: 'color 0.15s', lineHeight: 1 }}
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-mute)'}
            >✕</button>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <>
      <style>{`
        .pm-wrap {
          max-width: 520px;
          margin: 0 auto;
          padding: 0 1rem 4rem;
          font-family: system-ui, sans-serif;
        }
        .pm-body {
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 800px) {
          .pm-wrap {
            max-width: 1100px;
            padding: 0 2rem 4rem;
          }
          .pm-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem;
            align-items: start;
          }
          .pm-header {
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          }
        }
        @media (min-width: 1100px) {
          .pm-wrap { max-width: 1200px; }
          .pm-body { grid-template-columns: 5fr 4fr; gap: 1.5rem; }
        }
      `}</style>

      <div className="pm-wrap">
        {/* Header */}
        <div className="pm-header" style={{ paddingTop: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🍺</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
            Alkol Promilmetre
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-mute)', margin: '0.35rem 0 0', lineHeight: 1.5 }}>
            İçtiğin içecekleri ekle, kan alkol seviyeni hesapla.
          </p>
        </div>

        <div className="pm-body">
          {/* Sol sütun: Gösterge + uyarılar + içecek listesi */}
          <div>
            {gaugeCard}
            {trafikUyari}
            {iceciListesi}
          </div>

          {/* Sağ sütun: Form + modifiers + profil + AI */}
          <div>
            {/* İçecek Ekle */}
            <div style={card}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem' }}>
                İçecek Ekle
              </p>
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {KATEGORILER.map(kat => (
                  <button
                    key={kat}
                    onClick={() => handleKategoriDegis(kat)}
                    style={{
                      padding: '0.25rem 0.65rem', borderRadius: '9999px',
                      border: `0.5px solid ${kategori === kat ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      background: kategori === kat ? 'var(--color-accent-soft)' : 'transparent',
                      color: kategori === kat ? 'var(--color-accent-text)' : 'var(--color-text-mute)',
                      fontSize: '0.76rem', fontWeight: kategori === kat ? 600 : 400,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >{kat}</button>
                ))}
              </div>
              <div style={{ marginBottom: '0.625rem' }}>
                <select style={inp} value={secili} onChange={e => handleIcecekDegis(e.target.value)}>
                  <option value="">İçecek seç…</option>
                  {icecekler.map(ic => (
                    <option key={ic.ad} value={ic.ad}>{ic.ad} — %{ic.abv} ({ic.standartMl} ml)</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: '0.3rem' }}>Miktar (ml)</label>
                  <input type="number" min="1" style={inp} placeholder="ml" value={miktar} onChange={e => setMiktar(e.target.value)} />
                </div>
                {seciliIcecek && (
                  <div style={{ textAlign: 'center', padding: '0 0.5rem 0.65rem', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)' }}>%{seciliIcecek.abv} ABV</span>
                    {miktar && (
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-accent-text)' }}>
                        {alkolGram(Number(miktar), seciliIcecek.abv).toFixed(1)} g alkol
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={ekle}
                  disabled={!secili || !miktar || Number(miktar) <= 0}
                  style={{
                    padding: '0.6rem 1.1rem', borderRadius: '8px', border: 'none',
                    background: (!secili || !miktar) ? 'var(--color-border)' : 'linear-gradient(135deg, var(--color-accent), #8b5cf6)',
                    color: (!secili || !miktar) ? 'var(--color-text-mute)' : '#fff',
                    fontWeight: 700, fontSize: '0.85rem',
                    cursor: (!secili || !miktar) ? 'default' : 'pointer',
                    whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0,
                  }}
                >+ Ekle</button>
              </div>
            </div>

            {/* Mide Durumu & İçecek */}
            <div style={card}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem' }}>
                Mide Durumu & İçecek
              </p>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: '0.4rem' }}>Yemek durumu</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem' }}>
                  {YEMEK_SECENEK.map(y => (
                    <button
                      key={y.value}
                      onClick={() => setYemek(y.value)}
                      style={{
                        padding: '0.5rem', borderRadius: '8px',
                        border: `0.5px solid ${yemek === y.value ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        background: yemek === y.value ? 'var(--color-accent-soft)' : 'transparent',
                        color: yemek === y.value ? 'var(--color-accent-text)' : 'var(--color-text-mute)',
                        cursor: 'pointer', textAlign: 'left', fontSize: '0.76rem',
                        fontWeight: yemek === y.value ? 600 : 400,
                        transition: 'all 0.15s', display: 'flex', gap: '0.35rem', alignItems: 'center',
                      }}
                    >
                      <span>{y.emoji}</span><span>{y.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: '0.4rem' }}>Yanında ne içiyorsun?</label>
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {ICKI_SECENEK.map(ic => (
                    <button
                      key={ic.value}
                      onClick={() => setIcki(ic.value)}
                      style={{
                        padding: '0.25rem 0.65rem', borderRadius: '9999px',
                        border: `0.5px solid ${icki === ic.value ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        background: icki === ic.value ? 'var(--color-accent-soft)' : 'transparent',
                        color: icki === ic.value ? 'var(--color-accent-text)' : 'var(--color-text-mute)',
                        fontSize: '0.76rem', fontWeight: icki === ic.value ? 600 : 400,
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >{ic.emoji} {ic.label}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Kişisel Bilgiler */}
            <div style={card}>
              <button
                onClick={() => setProfilAcik(p => !p)}
                style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-soft)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Kişisel Bilgiler
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)' }}>
                    {profil.kilo} kg · {profil.cinsiyet === 'male' ? 'Erkek' : 'Kadın'}
                  </span>
                </div>
                <span style={{ color: 'var(--color-text-mute)', fontSize: '0.75rem', transform: profilAcik ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
              </button>
              {profilAcik && (
                <>
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.625rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: '0.3rem' }}>Kilo (kg)</label>
                      <input type="number" min="30" max="200" step="0.5" style={inp} value={profil.kilo} onChange={e => updateProfil('kilo', Number(e.target.value))} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: '0.3rem' }}>Cinsiyet</label>
                      <select style={inp} value={profil.cinsiyet} onChange={e => updateProfil('cinsiyet', e.target.value)}>
                        <option value="male">Erkek</option>
                        <option value="female">Kadın</option>
                      </select>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.68rem', color: 'var(--color-text-mute)', margin: '0.5rem 0 0' }}>
                    Bilgilerin cihazına kaydedilir, hiçbir yere gönderilmez.
                  </p>
                </>
              )}
            </div>

            {/* AI Analiz */}
            {eklenenler.length > 0 && (
              <div style={card}>
                <button
                  onClick={aiAnaliz}
                  disabled={aiYukleniyor}
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none',
                    background: aiYukleniyor ? 'var(--color-border)' : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                    color: aiYukleniyor ? 'var(--color-text-mute)' : '#fff',
                    fontWeight: 700, fontSize: '0.9rem', cursor: aiYukleniyor ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                    transition: 'all 0.2s',
                  }}
                >
                  {aiYukleniyor ? '⏳ Analiz ediliyor…' : '✨ AI Analizi Al'}
                </button>
                {aiHata && (
                  <div style={{ marginTop: '0.625rem', padding: '0.625rem 0.75rem', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: '0.82rem' }}>
                    ⚠️ {aiHata}
                  </div>
                )}
                {aiSonuc && (
                  <div style={{
                    marginTop: '0.75rem', padding: '0.875rem', borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(99,102,241,0.06))',
                    border: '0.5px solid rgba(139,92,246,0.25)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1rem' }}>✨</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Analizi</span>
                    </div>
                    <p style={{ fontSize: '0.83rem', color: 'var(--color-text)', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>
                      {aiSonuc}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Yasal uyarı */}
            <p style={{ fontSize: '0.67rem', color: 'var(--color-text-mute)', textAlign: 'center', lineHeight: 1.5, padding: '0 0.5rem' }}>
              Bu araç yalnızca bilgilendirme amaçlıdır. Widmark formülü ortalama değerler kullanır; bireysel farklılıklar promil seviyesini önemli ölçüde etkileyebilir. Alkol aldıktan sonra araç kullanma.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
