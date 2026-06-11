'use client';

import { useState, useEffect } from 'react';
import { yazilar, getKategori } from '../../lib/icerikler';
import { SYNC_READY_EVENT } from '../../lib/userSync';

const icerikler = yazilar.map(y => ({ ...y, kategori: getKategori(y) }));
import { dersler } from '../../lib/dersler';
import { LOGOS, CITIES, STORE_LEVELS, CATEGORY_LABELS, CATEGORY_ICONS } from '../../lib/tech-center-data';

const TOPLAM_DERS = dersler.length;

// ─── KATEGORİ UZMANLIKLARI ──────────────────────────────────────────────────
const UZMANLIK = [
  {
    id: 'ml', label: 'Makine Öğrenmesi', renk: '#1D9E75', bg: 'rgba(29,158,117,0.12)',
    icerikler: ['/yazilar/linear-regression','/yazilar/gradient-descent','/yazilar/confusion-matrix',
      '/yazilar/bias-variance','/yazilar/kmeans','/yazilar/sinir-agi','/yazilar/decision-tree'],
  },
  {
    id: 'sql', label: 'SQL & Veri Mühendisliği', renk: '#185FA5', bg: 'rgba(24,95,165,0.12)',
    icerikler: ['/yazilar/sql-temelleri','/yazilar/etl-nedir','/yazilar/dbt-nedir','/sql','/yazilar/mulakat-sql'],
    queryBonus: 'sql',
  },
  {
    id: 'python', label: 'Python & Pandas', renk: '#2E7D32', bg: 'rgba(46,125,50,0.12)',
    icerikler: ['/python','/yazilar/pandas-7-sey','/yazilar/veri-temizleme','/yazilar/feature-engineering'],
    queryBonus: 'python',
  },
  {
    id: 'istatistik', label: 'İstatistik & Analiz', renk: '#6A1B9A', bg: 'rgba(106,27,154,0.12)',
    icerikler: ['/yazilar/ab-test','/yazilar/sample-size','/yazilar/izmir-kira-analizi',
      '/yazilar/superlig-xg','/yazilar/bezier'],
  },
  {
    id: 'kariyer', label: 'Kariyer', renk: '#BA7517', bg: 'rgba(186,117,23,0.12)',
    icerikler: ['/yazilar/ilk-90-gun','/yazilar/rol-farklari','/yazilar/yol-haritasi',
      '/yazilar/portfolyo','/yazilar/mulakat-sql','/yazilar/linkedin-profili'],
  },
];

// ─── BAŞARIMLAR ─────────────────────────────────────────────────────────────
const BASARIMLAR = [
  // Keşif
  { id: 'ilk_adim',    icon: '🌱', label: 'İlk Adım',          desc: 'İlk içeriği ziyaret et',              kosul: (v) => v.ziyaret >= 1 },
  { id: 'merakli',     icon: '🔍', label: 'Meraklı',            desc: '5 içerik ziyaret et',                 kosul: (v) => v.ziyaret >= 5 },
  { id: 'odakli',      icon: '🎯', label: 'Odaklı',             desc: '10 içerik ziyaret et',                kosul: (v) => v.ziyaret >= 10 },
  { id: 'gezgin',      icon: '🗺️', label: 'Gezgin',             desc: '20 içerik ziyaret et',                kosul: (v) => v.ziyaret >= 20 },
  { id: 'interaktif',  icon: '⚡', label: 'Demo Meraklısı',     desc: '4 interaktif demo dene',              kosul: (v) => v.interaktif >= 4 },
  // SQL & Python
  { id: 'sql_basla',   icon: '🗄️', label: 'SQL\'ci',            desc: 'SQL Playground\'da sorgu çalıştır',   kosul: (v) => v.sqlSorgu >= 1 },
  { id: 'sql_usta',    icon: '💡', label: 'SQL Ustası',         desc: '10 SQL sorgusu çalıştır',             kosul: (v) => v.sqlSorgu >= 10 },
  { id: 'python_basla',icon: '🐍', label: 'Pythoncu',           desc: 'Python\'da kod çalıştır',             kosul: (v) => v.pythonSorgu >= 1 },
  { id: 'python_usta', icon: '🚀', label: 'Python Ustası',      desc: '10 Python kodu çalıştır',             kosul: (v) => v.pythonSorgu >= 10 },
  // Günlük Soru
  { id: 'gunluk_soru', icon: '🧠', label: 'Soru Avcısı',        desc: '5 günlük soru cevapla',               kosul: (v) => v.gunlukSoru >= 5 },
  { id: 'dogru_cevap', icon: '✅', label: 'Keskin Nişancı',     desc: '5 günlük soruyu doğru cevapla',       kosul: (v) => v.dogru >= 5 },
  // Kariyer & Sınav
  { id: 'kariyer_ok',  icon: '💼', label: 'Kariyer Odaklı',     desc: '3 kariyer içeriği oku',               kosul: (v) => v.kariyerZ >= 3 },
  { id: 'sinav_hazir', icon: '🎓', label: 'Sınava Hazır',       desc: '%70 genel ilerleme',                  kosul: (v) => v.genelYuzde >= 70 },
  { id: 'tam_puan',    icon: '🏆', label: 'Şampiyon',           desc: 'Sınavda 90+ puan al',                 kosul: (v) => v.sinavPuani >= 90 },
  // Mülakat
  { id: 'mulakat_bas', icon: '🎤', label: 'Mülakat Adayı',      desc: 'İlk mülakat sorusunu yanıtla',        kosul: (v) => v.mulakatSoru >= 1 },
  { id: 'mulakat_pro', icon: '🤝', label: 'Mülakat Pro',        desc: 'Mülakatta 20 soru yanıtla',           kosul: (v) => v.mulakatSoru >= 20 },
  { id: 'mulakat_ust', icon: '⭐', label: 'Mülakat Ustası',     desc: '10 soruyu "Biliyorum" işaretle',      kosul: (v) => v.mulakatBiliyorum >= 10 },
  // Milyon Yarışması
  { id: 'milyon_bas',  icon: '💰', label: 'Yarışmacı',          desc: 'Milyoner yarışmasını bir kez oyna',   kosul: (v) => v.milyonOyun >= 1 },
  { id: 'milyon_ceyr', icon: '💎', label: 'Çeyrek Final',       desc: '16.000 ₺ güvencesine ulaş',          kosul: (v) => v.milyonMaxK >= 16000 },
  { id: 'milyon_savc', icon: '👑', label: 'Milyoner!',          desc: '2.000.000 ₺ kazan',                   kosul: (v) => v.milyonMaxK >= 2000000 },
  // Playground
  { id: 'ciz_tahmin',  icon: '✏️', label: 'Rakam Çizici',       desc: 'Sinir ağına bir rakam çizdirt',       kosul: (v) => v.cizTahmin >= 1 },
  { id: 'nn_egitim',   icon: '🔬', label: 'Bilim İnsanı',       desc: 'Sinir ağı playground\'ı kullan',      kosul: (v) => v.nnEgitim >= 1 },
  { id: 'regex_test',  icon: '🔤', label: 'Regex Ustası',       desc: 'Regex playground\'da desen dene',     kosul: (v) => v.regexTest >= 1 },
  { id: 'kalori_ziy',  icon: '🥗', label: 'Kalori Takibi',       desc: 'Kalori modülünü ziyaret et',          kosul: (v) => v.kaloriZiyaret },
  // Tech Center
  { id: 'tc_ziy',     icon: '🖥️', label: 'Teknoloji Girişimcisi', desc: 'Tech Center\'ı aç',                 kosul: (v) => v.tcZiyaret },
  { id: 'tc_100xp',   icon: '⭐', label: 'Deneyimli Teknisyen',   desc: 'Tech Center\'da 100 XP kazan',      kosul: (v) => v.tcXP >= 100 },
  { id: 'tc_1m',      icon: '💼', label: 'Milyoncu Girişimci',    desc: 'Tech Center\'da ₺1M toplam gelir',  kosul: (v) => v.tcRevenue >= 1_000_000 },
];

const INTERAKTIF_HREFS = [
  '/yazilar/linear-regression','/yazilar/gradient-descent','/yazilar/confusion-matrix',
  '/yazilar/bias-variance','/yazilar/kmeans','/yazilar/sinir-agi','/yazilar/decision-tree',
  '/yazilar/bezier','/yazilar/ab-test','/proje',
];

const KARIYER_HREFS = [
  '/yazilar/ilk-90-gun','/yazilar/rol-farklari','/yazilar/yol-haritasi',
  '/yazilar/portfolyo','/yazilar/mulakat-sql','/yazilar/linkedin-profili',
];


// ─── YARDIMCI BİLEŞENLER ───────────────────────────────────────────────────
function ProgresBari({ yuzde, renk, bg, height = 8 }) {
  return (
    <div style={{ width: '100%', height, borderRadius: 999, background: bg || 'var(--color-border)', overflow: 'hidden' }}>
      <div style={{
        width: `${Math.min(100, yuzde)}%`, height: '100%',
        background: renk, borderRadius: 999,
        transition: 'width 0.6s cubic-bezier(.4,0,.2,1)',
      }} />
    </div>
  );
}

function StatKart({ icon, label, deger, alt, renk }) {
  return (
    <div style={{
      background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)',
      borderRadius: '12px', padding: '16px 20px',
      display: 'flex', flexDirection: 'column', gap: '4px',
    }}>
      <div style={{ fontSize: '20px' }}>{icon}</div>
      <div style={{ fontSize: '26px', fontWeight: 700, color: renk || 'var(--color-text)', lineHeight: 1 }}>{deger}</div>
      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text)' }}>{label}</div>
      {alt && <div style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>{alt}</div>}
    </div>
  );
}

function BasarimKutu({ basarim, kazanildi }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '10px 12px', borderRadius: '10px',
      border: `0.5px solid ${kazanildi ? 'var(--color-accent)' : 'var(--color-border)'}`,
      background: kazanildi ? 'var(--color-accent-soft)' : 'var(--color-cream-card)',
      opacity: kazanildi ? 1 : 0.5,
      transition: 'all 0.2s',
    }}>
      <div style={{ fontSize: '22px', flexShrink: 0, filter: kazanildi ? 'none' : 'grayscale(1)' }}>
        {basarim.icon}
      </div>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: kazanildi ? 'var(--color-accent-text)' : 'var(--color-text)' }}>
          {basarim.label}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>{basarim.desc}</div>
      </div>
      {kazanildi && <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--color-accent)', fontWeight: 700 }}>✓</div>}
    </div>
  );
}

const kategoriRenk = {
  interaktif: '#1D9E75', rehber: '#7F77DD', arac: '#7F77DD',
  vaka: '#e8a04a', kariyer: '#e8a04a',
};

function formatSure(dk) {
  if (!dk || dk < 1) return '< 1 dk';
  if (dk < 60) return `${Math.round(dk)} dk`;
  const sa = Math.floor(dk / 60);
  const kalan = Math.round(dk % 60);
  return kalan > 0 ? `${sa} sa ${kalan} dk` : `${sa} sa`;
}

function HeroPill({ icon, label, sub, vurgu }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '10px 18px', borderRadius: '14px', minWidth: '72px',
      background: vurgu ? 'var(--color-accent-soft)' : 'var(--color-cream)',
      border: `0.5px solid ${vurgu ? 'var(--color-accent)' : 'var(--color-border)'}`,
    }}>
      <span style={{ fontSize: '18px', marginBottom: '3px' }}>{icon}</span>
      <span style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1, color: vurgu ? 'var(--color-accent-text)' : 'var(--color-text)' }}>
        {label}
      </span>
      <span style={{ fontSize: '10px', marginTop: '3px', color: vurgu ? 'var(--color-accent-text)' : 'var(--color-text-mute)' }}>
        {sub}
      </span>
    </div>
  );
}

function ProfilHero({ gunler, sureDk, seri, etkilesim, ilkZiyaret, kazanilanBasarim, toplamBasarim }) {
  const ilkTarih = ilkZiyaret
    ? new Date(ilkZiyaret).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const r = 44; const cx = 56; const cy = 56;
  const circ = 2 * Math.PI * r;
  const progress = Math.min(1, gunler / 365);
  const offset = circ * (1 - progress);

  const selamMetni = gunler === 1
    ? 'Hoş geldin! Yolculuk bugün başladı.'
    : gunler < 7
    ? `${gunler} gündür öğreniyorsun.`
    : gunler < 30
    ? `${gunler} gündür burada, harika gidiyor!`
    : `${gunler} günlük yolculuk — devam et!`;

  return (
    <div style={{
      background: 'var(--color-cream-card)',
      border: '0.5px solid var(--color-border)',
      borderRadius: '20px', padding: '28px 32px',
      marginBottom: '32px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Dekoratif daireler */}
      <div style={{
        position: 'absolute', top: -70, right: -70,
        width: 220, height: 220, borderRadius: '50%',
        background: 'var(--color-accent)', opacity: 0.05, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -50, right: 80,
        width: 140, height: 140, borderRadius: '50%',
        background: 'var(--color-accent)', opacity: 0.03, pointerEvents: 'none',
      }} />

      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-mute)', marginBottom: '20px' }}>
        Öğrenme Yolculuğu
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>

        {/* SVG halka */}
        <div style={{ position: 'relative', flexShrink: 0, width: 112, height: 112 }}>
          <svg width={112} height={112} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-border)" strokeWidth={5} />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-accent)"
              strokeWidth={5} strokeLinecap="round"
              strokeDasharray={circ.toFixed(2)} strokeDashoffset={offset.toFixed(2)}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '30px', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1, letterSpacing: '-0.03em' }}>
              {gunler}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-mute)', fontWeight: 500, marginTop: '2px' }}>gün</span>
          </div>
        </div>

        {/* Metin + pill'ler */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: '4px' }}>
            {selamMetni}
          </div>
          {ilkTarih && (
            <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginBottom: '16px' }}>
              İlk ziyaret: {ilkTarih}
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <HeroPill icon="⏱️" label={formatSure(sureDk)} sub="süre" />
            <HeroPill icon="🔥" label={`${seri} gün`} sub="seri" vurgu={seri >= 3} />
            <HeroPill icon="⚡" label={String(etkilesim)} sub="etkileşim" />
            <HeroPill icon="🏅" label={`${kazanilanBasarim}/${toplamBasarim}`} sub="başarım" />
          </div>
        </div>
      </div>
    </div>
  );
}

function formatPara(n) {
  if (!n) return '0 ₺';
  return n.toLocaleString('tr-TR') + ' ₺';
}

function ModulKart({ icon, label, href, ziyaret, detaylar }) {
  return (
    <div style={{
      background: 'var(--color-cream-card)', border: `0.5px solid ${ziyaret ? 'var(--color-accent)' : 'var(--color-border)'}`,
      borderRadius: '12px', padding: '14px 16px',
      opacity: ziyaret ? 1 : 0.6,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: detaylar?.length ? '10px' : 0 }}>
        <span style={{ fontSize: '18px' }}>{icon}</span>
        <a href={href} style={{ fontSize: '13px', fontWeight: 600, color: ziyaret ? 'var(--color-accent-text)' : 'var(--color-text)', textDecoration: 'none' }}>
          {label}
        </a>
        {ziyaret && <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--color-accent)', fontWeight: 700 }}>✓</span>}
      </div>
      {detaylar?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {detaylar.map((d, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: 'var(--color-text-mute)' }}>{d.label}</span>
              <span style={{ color: 'var(--color-text-soft)', fontWeight: 600 }}>{d.deger}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ANA SAYFA ──────────────────────────────────────────────────────────────
export default function HaritaSayfasi() {
  const [veri, setVeri] = useState(null);
  const [aktifFiltre, setAktifFiltre] = useState('tumu');
  const [anladiSayi, setAnladiSayi] = useState(0);
  const [tekrarSayi, setTekrarSayi] = useState(0);
  const [tekrarlar, setTekrarlar] = useState([]);

  useEffect(() => {
    function yukle() {
    try {
      const ziyaretler   = JSON.parse(localStorage.getItem('sz_ziyaretler') || '[]');
      const sqlSorgu     = Number(localStorage.getItem('sz_sql_sorgu') || 0);
      const pythonSorgu  = Number(localStorage.getItem('sz_python_sorgu') || 0);
      const sinavPuani   = localStorage.getItem('sz_sinav_puani') ? Number(localStorage.getItem('sz_sinav_puani')) : null;
      const ilerlemeRaw  = localStorage.getItem('sz_ilerleme_v1');
      const ilerleme     = ilerlemeRaw ? JSON.parse(ilerlemeRaw) : {};
      const tamamlananDersSayisi = Object.keys(ilerleme.tamamlananDersler || {}).length;

      // Modül istatistikleri
      const mulakatSoru     = Number(localStorage.getItem('sz_mulakat_soru') || 0);
      const mulakatBiliyorum = Number(localStorage.getItem('sz_mulakat_biliyorum') || 0);
      const milyonOyun      = Number(localStorage.getItem('sz_milyon_oyun') || 0);
      const milyonMaxK      = Number(localStorage.getItem('sz_milyon_max_kazanim') || 0);
      const milyonToplamS   = Number(localStorage.getItem('sz_milyon_toplam_soru') || 0);
      const cizTahmin       = Number(localStorage.getItem('sz_ciz_tahmin') || 0);
      const nnEgitim        = Number(localStorage.getItem('sz_nn_egitim') || 0);
      const regexTest       = Number(localStorage.getItem('sz_regex_test') || 0);
      const kaloriZiyaret   = localStorage.getItem('sz_kalori_ziyaret') === '1';
      const veriSetiZiyaret = ziyaretler.includes('/veri-setleri');

      // Tech Center
      const tcRaw = localStorage.getItem('tc_game_v2');
      let tcData = null;
      if (tcRaw) {
        try {
          const tc = JSON.parse(tcRaw);
          const allTimeSales = tc.allTimeSales || [];
          const totalRevenue = allTimeSales.reduce((s, x) => s + (x.revenue || 0), 0);
          const totalCOGS    = allTimeSales.reduce((s, x) => s + (x.cogs || 0), 0);
          const totalProfit  = allTimeSales.reduce((s, x) => s + (x.profit || 0), 0);
          const serviceSales = allTimeSales.filter(x => x.category === 'service');
          const productSales = allTimeSales.filter(x => x.category !== 'service');
          const catRevenue = {};
          for (const s of productSales) {
            catRevenue[s.category] = (catRevenue[s.category] || 0) + s.revenue;
          }
          const topCatEntry = Object.entries(catRevenue).sort((a, b) => b[1] - a[1])[0];
          const inventoryCount = Object.values(tc.inventory || {}).reduce((s, q) => s + q, 0);
          const secondHandCount = Object.values(tc.secondHandInventory || {}).reduce((s, q) => s + q, 0);
          const xp = tc.xp || 0;
          const xpLevel = Math.floor(xp / 100) + 1;
          const xpProgress = xp % 100;
          tcData = {
            ...tc,
            totalRevenue, totalCOGS, totalProfit,
            totalSalesCount: allTimeSales.length,
            productSalesCount: productSales.length,
            serviceSalesCount: serviceSales.length,
            serviceRevenue: serviceSales.reduce((s, x) => s + (x.revenue || 0), 0),
            catRevenue, topCat: topCatEntry?.[0],
            inventoryCount, secondHandCount,
            xpLevel, xpProgress,
          };
        } catch {}
      }

      const durumObj = JSON.parse(localStorage.getItem('sz_durum') || '{}');
      const anladiSet = new Set([
        ...Object.entries(durumObj).filter(([,v]) => v === 'anladi').map(([k]) => k),
        ...JSON.parse(localStorage.getItem('sz_anladi') || '[]'),
      ]);
      const tekrarSet = new Set([
        ...Object.entries(durumObj).filter(([,v]) => v === 'tekrar').map(([k]) => k),
        ...JSON.parse(localStorage.getItem('sz_tekrar') || '[]'),
      ]);
      setAnladiSayi(anladiSet.size);
      setTekrarSayi(tekrarSet.size);
      setTekrarlar([...tekrarSet]);

      // Profil hero verileri
      const ilkZiyaret = localStorage.getItem('sz_ilk_ziyaret') || null;
      const seri       = Number(localStorage.getItem('sz_seri') || 1);
      const sureDk     = Number(localStorage.getItem('sz_sure_dk') || 0);
      const gunler     = ilkZiyaret
        ? Math.max(1, Math.floor((Date.now() - new Date(ilkZiyaret).getTime()) / 86400000))
        : 1;

      let gunlukSoru = 0, dogru = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k?.startsWith('gsq_')) gunlukSoru++;
      }
      dogru = Number(localStorage.getItem('sz_gsq_dogru') || 0);

      // Uzmanlık hesaplama
      const uzmanlikYuzde = UZMANLIK.map(u => {
        const ziyaretPuan = u.icerikler.filter(h => ziyaretler.includes(h)).length;
        const temelYuzde  = Math.round((ziyaretPuan / u.icerikler.length) * 75);
        let bonus = 0;
        if (u.queryBonus === 'sql')    bonus = Math.min(25, Math.floor(sqlSorgu / 2) * 5);
        if (u.queryBonus === 'python') bonus = Math.min(25, Math.floor(pythonSorgu / 2) * 5);
        return { ...u, yuzde: Math.min(100, temelYuzde + bonus) };
      });

      const genelYuzde = Math.round(
        uzmanlikYuzde.reduce((s, u) => s + u.yuzde, 0) / uzmanlikYuzde.length
      );

      const interaktif = ziyaretler.filter(h => INTERAKTIF_HREFS.includes(h)).length;
      const kariyerZ   = ziyaretler.filter(h => KARIYER_HREFS.includes(h)).length;

      // Başarım durumları
      const stats = {
        ziyaret: ziyaretler.length, sqlSorgu, pythonSorgu, gunlukSoru, dogru,
        interaktif, kariyerZ, genelYuzde, sinavPuani,
        mulakatSoru, mulakatBiliyorum, milyonOyun, milyonMaxK,
        cizTahmin, nnEgitim, regexTest, kaloriZiyaret,
        tcZiyaret: !!tcRaw,
        tcXP: tcData?.xp || 0,
        tcRevenue: tcData?.totalRevenue || 0,
      };
      const basarimDurum = BASARIMLAR.map(b => ({ ...b, kazanildi: b.kosul(stats) }));

      setVeri({
        ziyaretler, sqlSorgu, pythonSorgu, sinavPuani, gunlukSoru, dogru,
        uzmanlikYuzde, genelYuzde, basarimDurum, stats, tamamlananDersSayisi,
        mulakatSoru, mulakatBiliyorum, milyonOyun, milyonMaxK, milyonToplamS,
        cizTahmin, nnEgitim, regexTest, kaloriZiyaret, veriSetiZiyaret,
        ilkZiyaret, seri, sureDk, gunler, tcData,
      });
    } catch {}
    }
    yukle();
    window.addEventListener(SYNC_READY_EVENT, yukle);
    return () => window.removeEventListener(SYNC_READY_EVENT, yukle);
  }, []);

  if (!veri) return (
    <main className="min-h-screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--color-text-mute)' }}>Yükleniyor...</div>
    </main>
  );

  const {
    ziyaretler, sqlSorgu, pythonSorgu, gunlukSoru, dogru,
    uzmanlikYuzde, genelYuzde, basarimDurum, sinavPuani, tamamlananDersSayisi,
    mulakatSoru, mulakatBiliyorum, milyonOyun, milyonMaxK, milyonToplamS,
    cizTahmin, nnEgitim, regexTest, kaloriZiyaret, veriSetiZiyaret,
    ilkZiyaret, seri, sureDk, gunler, tcData,
  } = veri;
  const sinavAcik = tamamlananDersSayisi >= TOPLAM_DERS;
  const sinavaKalan = Math.max(0, TOPLAM_DERS - tamamlananDersSayisi);
  const kazanilanBasarim = basarimDurum.filter(b => b.kazanildi).length;
  const etkilesim = ziyaretler.length + sqlSorgu + pythonSorgu + mulakatSoru +
    milyonToplamS + cizTahmin + nnEgitim + regexTest + gunlukSoru;

  const filtrelenmisIcerikler = aktifFiltre === 'tumu'
    ? icerikler
    : icerikler.filter(i => i.kategori === aktifFiltre);

  const kategoriler = ['tumu', ...new Set(icerikler.map(i => i.kategori))];

  return (
    <main className="min-h-screen" style={{ paddingBottom: '80px' }}>
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Başlık */}
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <div style={{ marginBottom: '24px' }}>
          <h1 className="font-serif text-4xl font-medium leading-tight mb-2" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
            İlerleme Haritam
          </h1>
          <p style={{ color: 'var(--color-text-mute)', fontSize: '14px' }}>
            Bu cihazdaki aktivitene göre hesaplanır · Hesap gerekmez
          </p>
        </div>

        {/* ─── PROFİL HERO ─── */}
        <ProfilHero
          gunler={gunler}
          sureDk={sureDk}
          seri={seri}
          etkilesim={etkilesim}
          ilkZiyaret={ilkZiyaret}
          kazanilanBasarim={kazanilanBasarim}
          toplamBasarim={BASARIMLAR.length}
        />

        {/* ─── GENEL BAKIŞ ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px', marginBottom: '32px' }}>
          <StatKart icon="📚" label="Ziyaret edilen" deger={ziyaretler.length}
            alt={`${icerikler.length} içerikten`} renk="var(--color-accent)" />
          <StatKart icon="🗄️" label="SQL sorgusu" deger={sqlSorgu}
            alt="SQL Playground" renk="#185FA5" />
          <StatKart icon="🐍" label="Python kodu" deger={pythonSorgu}
            alt="Python Playground" renk="#2E7D32" />
          <StatKart icon="🧠" label="Günlük soru" deger={gunlukSoru}
            alt={`${dogru} doğru cevap`} renk="#6A1B9A" />
          <StatKart icon="🏅" label="Başarım" deger={`${kazanilanBasarim}/${BASARIMLAR.length}`}
            alt="kazanılan rozet" renk="#BA7517" />
        </div>

        {/* ─── ÖĞRENME DURUMU ─── */}
        <div style={{
          background: 'var(--color-cream-card)',
          border: '0.5px solid var(--color-accent-soft)',
          borderRadius: '16px', padding: '24px 28px', marginBottom: '32px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span style={{ fontSize: '18px' }}>📊</span>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>Öğrenme Durumu</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px', marginBottom: tekrarSayi > 0 ? '20px' : 0 }}>
            <div style={{
              background: 'var(--color-correct-bg)', border: '0.5px solid var(--color-border)',
              borderRadius: '12px', padding: '16px 20px',
              display: 'flex', flexDirection: 'column', gap: '4px',
            }}>
              <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-correct-text)', lineHeight: 1 }}>{anladiSayi}</div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-correct-text)' }}>Anladım</div>
              <div style={{ fontSize: '11px', color: 'var(--color-correct-text)', opacity: 0.75 }}>Anladım olarak işaretlediklerim</div>
            </div>
            <div style={{
              background: 'var(--color-amber-bg)', border: '0.5px solid var(--color-border)',
              borderRadius: '12px', padding: '16px 20px',
              display: 'flex', flexDirection: 'column', gap: '4px',
            }}>
              <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-amber-text)', lineHeight: 1 }}>{tekrarSayi}</div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-amber-text)' }}>Tekrar Bak</div>
              <div style={{ fontSize: '11px', color: 'var(--color-amber-text)', opacity: 0.75 }}>Tekrar bakacaklarım</div>
            </div>
          </div>
          {tekrarSayi > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-mute)', marginBottom: '10px' }}>Tekrar bakacakların:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {tekrarlar.map(href => {
                  const slug = href.split('/').filter(Boolean).pop();
                  return (
                    <a key={href} href={href} style={{
                      fontSize: '11px', fontWeight: 600,
                      padding: '3px 10px', borderRadius: '999px',
                      background: 'var(--color-amber-bg)',
                      color: 'var(--color-amber-text)',
                      border: '0.5px solid var(--color-border)',
                      textDecoration: 'none',
                    }}>
                      {slug}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ─── SERTİFİKA YOLU ─── */}
        <div style={{
          background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)',
          borderRadius: '16px', padding: '24px 28px', marginBottom: '32px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>🎓</span>
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text)' }}>Site İçerik Uzmanlığı</span>
                {sinavAcik
                  ? <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', background: 'var(--color-correct-bg)', color: 'var(--color-correct-text)', fontWeight: 700 }}>AÇIK</span>
                  : <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', background: 'var(--color-cream)', color: 'var(--color-text-mute)', fontWeight: 600 }}>KİLİTLİ</span>
                }
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-mute)', margin: '0 0 14px' }}>
                {sinavAcik
                  ? 'Sınava girebilirsin! 10 soruluk test, başarılı olursan sertifikan hazır.'
                  : `Sınavı açmak için Öğren sayfasındaki ${sinavaKalan} dersi daha tamamla.`}
              </p>
              <ProgresBari
                yuzde={Math.round((tamamlananDersSayisi / TOPLAM_DERS) * 100)}
                renk={sinavAcik ? '#16a34a' : 'var(--color-accent)'}
                bg="var(--color-cream)"
                height={10}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: 'var(--color-text-mute)' }}>
                <span>{tamamlananDersSayisi}/{TOPLAM_DERS} ders tamamlandı</span>
                <span><a href="/ogren" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>Öğren →</a></span>
              </div>
              {sinavPuani && (
                <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--color-text-soft)' }}>
                  Son sınav puanın: <strong style={{ color: sinavPuani >= 90 ? '#16a34a' : sinavPuani >= 70 ? '#e8a04a' : '#dc2626' }}>{sinavPuani}</strong>
                </div>
              )}
            </div>
            <a href="/sinav" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
              textDecoration: 'none', flexShrink: 0, alignSelf: 'center',
              background: sinavAcik ? 'var(--color-accent)' : 'var(--color-border)',
              color: sinavAcik ? '#fff' : 'var(--color-text-mute)',
              pointerEvents: sinavAcik ? 'auto' : 'none',
            }}>
              Sınava Gir →
            </a>
          </div>
        </div>

        {/* ─── UZMANLIK ALANLARI ─── */}
        <div style={{ marginBottom: '32px' }}>
          <h2 className="font-serif text-2xl font-medium mb-5" style={{ color: 'var(--color-text)' }}>Uzmanlık Alanları</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {uzmanlikYuzde.map(u => {
              const seviye =
                u.yuzde >= 80 ? 'Uzman'
                : u.yuzde >= 60 ? 'Uzman Aday'
                : u.yuzde >= 40 ? 'Öğrenci'
                : u.yuzde >= 20 ? 'Keşifçi'
                : 'Başlangıç';
              return (
                <div key={u.id} style={{
                  background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)',
                  borderRadius: '12px', padding: '16px 20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>{u.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        fontSize: '11px', padding: '2px 8px', borderRadius: '999px',
                        background: u.bg, color: u.renk, fontWeight: 600,
                      }}>{seviye}</span>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: u.renk, minWidth: '36px', textAlign: 'right' }}>
                        %{u.yuzde}
                      </span>
                    </div>
                  </div>
                  <ProgresBari yuzde={u.yuzde} renk={u.renk} bg={u.bg} height={8} />
                  <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--color-text-mute)' }}>
                    {u.icerikler.filter(h => ziyaretler.includes(h)).length}/{u.icerikler.length} içerik
                    {u.queryBonus === 'sql' && sqlSorgu > 0 && ` · ${sqlSorgu} SQL sorgusu`}
                    {u.queryBonus === 'python' && pythonSorgu > 0 && ` · ${pythonSorgu} Python kodu`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── BAŞARIMLAR ─── */}
        <div style={{ marginBottom: '32px' }}>
          <h2 className="font-serif text-2xl font-medium mb-2" style={{ color: 'var(--color-text)' }}>Başarımlar</h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-mute)', marginBottom: '16px' }}>
            {kazanilanBasarim}/{BASARIMLAR.length} rozet kazanıldı
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px' }}>
            {basarimDurum.map(b => <BasarimKutu key={b.id} basarim={b} kazanildi={b.kazanildi} />)}
          </div>
        </div>

        {/* ─── MODÜLLER ─── */}
        <div style={{ marginBottom: '32px' }}>
          <h2 className="font-serif text-2xl font-medium mb-2" style={{ color: 'var(--color-text)' }}>Modüller</h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-mute)', marginBottom: '16px' }}>
            İnteraktif araçlar ve oyunlardaki aktiviten
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
            <ModulKart icon="🥗" label="Kalori Takip" href="/kalori" ziyaret={kaloriZiyaret}
              detaylar={kaloriZiyaret ? [{ label: 'Durum', deger: 'Ziyaret edildi' }] : []}
            />
            <ModulKart icon="🗂️" label="Veri Setleri" href="/veri-setleri" ziyaret={veriSetiZiyaret}
              detaylar={veriSetiZiyaret ? [{ label: 'Durum', deger: 'Ziyaret edildi' }] : []}
            />
            <ModulKart icon="🎤" label="Mülakat" href="/mulakat" ziyaret={ziyaretler.includes('/mulakat') || mulakatSoru > 0}
              detaylar={mulakatSoru > 0 ? [
                { label: 'Yanıtlanan soru', deger: String(mulakatSoru) },
                { label: '"Biliyorum" denen', deger: String(mulakatBiliyorum) },
              ] : []}
            />
            <ModulKart icon="💰" label="Kim Milyoner?" href="/milyon" ziyaret={milyonOyun > 0}
              detaylar={milyonOyun > 0 ? [
                { label: 'Oyun sayısı', deger: String(milyonOyun) },
                { label: 'Max kazanım', deger: formatPara(milyonMaxK) },
                { label: 'Toplam soru', deger: String(milyonToplamS) },
              ] : []}
            />
            <ModulKart icon="✏️" label="Rakam Çiz" href="/ciz" ziyaret={cizTahmin > 0}
              detaylar={cizTahmin > 0 ? [{ label: 'Tahmin sayısı', deger: String(cizTahmin) }] : []}
            />
            <ModulKart icon="🧠" label="Sinir Ağı" href="/nn" ziyaret={nnEgitim > 0}
              detaylar={nnEgitim > 0 ? [{ label: 'Eğitim sayısı', deger: String(nnEgitim) }] : []}
            />
            <ModulKart icon="🔤" label="Regex" href="/regex" ziyaret={regexTest > 0}
              detaylar={regexTest > 0 ? [{ label: 'Desen testi', deger: String(regexTest) }] : []}
            />
            <ModulKart icon="🖥️" label="Tech Center" href="/tech-center" ziyaret={!!tcData}
              detaylar={tcData ? [
                { label: 'Gün', deger: String(tcData.currentDay || 1) },
                { label: 'XP', deger: String(tcData.xp || 0) },
                { label: 'Toplam Gelir', deger: formatPara(tcData.totalRevenue || 0) },
              ] : []}
            />
          </div>
        </div>

        {/* ─── TECH CENTER ─── */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            <h2 className="font-serif text-2xl font-medium" style={{ color: 'var(--color-text)' }}>🖥️ Tech Center</h2>
            <a href="/tech-center" style={{ fontSize: '12px', color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>
              Oyuna Gir →
            </a>
          </div>

          {!tcData ? (
            <div style={{ background: 'var(--color-cream-card)', border: '0.5px dashed var(--color-border)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🖥️</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '6px' }}>Henüz oynanmadı</div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginBottom: '16px' }}>Bilgisayar mağazası simülasyonu — ₺1 milyara ulaş!</p>
              <a href="/tech-center" style={{ display: 'inline-block', padding: '8px 20px', borderRadius: '8px', background: 'var(--color-accent)', color: '#fff', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                Başla →
              </a>
            </div>
          ) : (() => {
            const logo = LOGOS.find(l => l.id === tcData.logoId) || LOGOS[0];
            const city = CITIES[tcData.city] || CITIES.ankara;
            const storeLevel = STORE_LEVELS[(tcData.storeLevel || 1) - 1];
            const WIN_T = 1_000_000_000;
            const firmaValueApprox = (tcData.cash || 0);
            const progressToWin = Math.min(100, Math.round(((tcData.cash || 0) / WIN_T) * 100 * 10) / 10);
            const margin = tcData.totalRevenue > 0
              ? Math.round((tcData.totalProfit / tcData.totalRevenue) * 100)
              : 0;
            const catRevenueEntries = Object.entries(tcData.catRevenue || {}).sort((a, b) => b[1] - a[1]).slice(0, 5);
            const maxCatRev = catRevenueEntries[0]?.[1] || 1;

            return (
              <>
                {/* Firma başlık */}
                <div style={{ background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '16px', padding: '20px 24px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: logo.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                    {logo.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>{tcData.companyName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginTop: '3px' }}>
                      {city.emoji} {city.label} · {storeLevel.emoji} {storeLevel.label} · Gün {tcData.currentDay}
                    </div>
                  </div>
                  {tcData.gamePhase === 'won' && (
                    <div style={{ padding: '4px 12px', borderRadius: '999px', background: '#F59E0B22', color: '#F59E0B', fontSize: '12px', fontWeight: 700 }}>
                      🏆 Kazandı!
                    </div>
                  )}
                  {/* ₺1B hedef barı */}
                  <div style={{ width: '100%', marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-mute)', marginBottom: '5px' }}>
                      <span>₺1B Hedefi</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{progressToWin}%</span>
                    </div>
                    <div style={{ width: '100%', height: '7px', borderRadius: 999, background: 'var(--color-border)', overflow: 'hidden' }}>
                      <div style={{ width: `${progressToWin}%`, height: '100%', background: progressToWin >= 90 ? '#F59E0B' : 'var(--color-accent)', borderRadius: 999, transition: 'width 0.6s' }} />
                    </div>
                  </div>
                </div>

                {/* Ana stat grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px', marginBottom: '12px' }}>
                  {[
                    { icon: '⭐', label: 'Deneyim', value: `${tcData.xp || 0} XP`, sub: `Sv. ${tcData.xpLevel}`, color: '#7F77DD' },
                    { icon: '💰', label: 'Nakit', value: (tcData.cash || 0) >= 1e6 ? `₺${((tcData.cash||0)/1e6).toFixed(1)}M` : `₺${Math.round(tcData.cash||0).toLocaleString('tr-TR')}`, sub: 'mevcut', color: '#1D9E75' },
                    { icon: '📈', label: 'Toplam Gelir', value: (tcData.totalRevenue||0) >= 1e6 ? `₺${(tcData.totalRevenue/1e6).toFixed(1)}M` : `₺${Math.round(tcData.totalRevenue||0).toLocaleString('tr-TR')}`, sub: `${tcData.totalSalesCount} işlem`, color: '#185FA5' },
                    { icon: '💵', label: 'Toplam Kar', value: (tcData.totalProfit||0) >= 1e6 ? `₺${(tcData.totalProfit/1e6).toFixed(1)}M` : `₺${Math.round(tcData.totalProfit||0).toLocaleString('tr-TR')}`, sub: `%${margin} marj`, color: tcData.totalProfit >= 0 ? '#1D9E75' : '#E24B4A' },
                    { icon: '🛒', label: 'Ürün Satışı', value: String(tcData.productSalesCount || 0), sub: 'adet', color: '#e8a04a' },
                    { icon: '🔧', label: 'Servis', value: String(tcData.serviceSalesCount || 0), sub: `₺${Math.round(tcData.serviceRevenue||0).toLocaleString('tr-TR')} gelir`, color: '#10B981' },
                    { icon: '📦', label: 'Stok', value: String(tcData.inventoryCount || 0), sub: 'ürün', color: 'var(--color-text)' },
                    { icon: '♻️', label: 'İkinci El', value: String(tcData.secondHandCount || 0), sub: 'parça', color: '#6B7280' },
                  ].map(item => (
                    <div key={item.label} style={{ background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '12px', padding: '14px 16px' }}>
                      <div style={{ fontSize: '18px', marginBottom: '4px' }}>{item.icon}</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: item.color, lineHeight: 1, fontFamily: 'var(--font-mono)' }}>{item.value}</div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text)', marginTop: '3px' }}>{item.label}</div>
                      {item.sub && <div style={{ fontSize: '10px', color: 'var(--color-text-mute)' }}>{item.sub}</div>}
                    </div>
                  ))}
                </div>

                {/* XP progress bar */}
                <div style={{ background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '12px', padding: '14px 18px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>⭐ Seviye {tcData.xpLevel}</span>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-mute)', fontFamily: 'var(--font-mono)' }}>{tcData.xpProgress}/100 XP → Sv. {tcData.xpLevel + 1}</span>
                  </div>
                  <div style={{ width: '100%', height: '7px', borderRadius: 999, background: 'var(--color-border)', overflow: 'hidden' }}>
                    <div style={{ width: `${tcData.xpProgress}%`, height: '100%', background: '#7F77DD', borderRadius: 999, transition: 'width 0.6s' }} />
                  </div>
                </div>

                {/* Kategori bazlı satış dağılımı */}
                {catRevenueEntries.length > 0 && (
                  <div style={{ background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '12px', padding: '16px 18px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '12px' }}>📊 Kategori Bazlı Satış Geliri</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {catRevenueEntries.map(([cat, rev]) => (
                        <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1rem', width: '22px', textAlign: 'center' }}>{CATEGORY_ICONS[cat] || '📦'}</span>
                          <span style={{ fontSize: '12px', color: 'var(--color-text-soft)', width: '90px', flexShrink: 0 }}>{CATEGORY_LABELS[cat] || cat}</span>
                          <div style={{ flex: 1, height: '8px', borderRadius: 999, background: 'var(--color-border)', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.round((rev / maxCatRev) * 100)}%`, height: '100%', background: 'var(--color-accent)', borderRadius: 999 }} />
                          </div>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-mute)', fontFamily: 'var(--font-mono)', width: '70px', textAlign: 'right', flexShrink: 0 }}>
                            ₺{rev >= 1e6 ? `${(rev/1e6).toFixed(1)}M` : Math.round(rev).toLocaleString('tr-TR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>

        {/* ─── İÇERİK HARİTASI ─── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <h2 className="font-serif text-2xl font-medium" style={{ color: 'var(--color-text)' }}>İçerik Haritası</h2>
            <span style={{ fontSize: '13px', color: 'var(--color-text-mute)' }}>
              {ziyaretler.filter(h => icerikler.some(i => i.href === h)).length}/{icerikler.length} ziyaret edildi
            </span>
          </div>

          {/* Kategori filtresi */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {kategoriler.map(k => (
              <button key={k} onClick={() => setAktifFiltre(k)} style={{
                padding: '4px 12px', borderRadius: '999px', fontSize: '12.5px',
                border: '0.5px solid',
                borderColor: aktifFiltre === k ? 'var(--color-accent)' : 'var(--color-border)',
                background: aktifFiltre === k ? 'var(--color-accent-soft)' : 'transparent',
                color: aktifFiltre === k ? 'var(--color-accent-text)' : 'var(--color-text-mute)',
                cursor: 'pointer', fontWeight: aktifFiltre === k ? 600 : 400,
              }}>
                {k === 'tumu' ? 'Tümü' : k.charAt(0).toUpperCase() + k.slice(1)}
              </button>
            ))}
          </div>

          {/* İçerik grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px' }}>
            {filtrelenmisIcerikler.map(icerik => {
              const ziyaret = ziyaretler.includes(icerik.href);
              const renk = kategoriRenk[icerik.kategori] || '#888';
              return (
                <a key={icerik.href} href={icerik.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    padding: '12px 14px', borderRadius: '10px',
                    border: `0.5px solid ${ziyaret ? renk + '60' : 'var(--color-border)'}`,
                    background: ziyaret ? renk + '0A' : 'var(--color-cream-card)',
                    transition: 'transform 0.15s, border-color 0.15s',
                    position: 'relative',
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                  >
                    {/* Ziyaret durumu */}
                    <div style={{
                      flexShrink: 0, width: '18px', height: '18px', borderRadius: '50%',
                      background: ziyaret ? renk : 'var(--color-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginTop: '2px',
                    }}>
                      {ziyaret && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>✓</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: '13px', fontWeight: 500, lineHeight: '1.4',
                        color: ziyaret ? 'var(--color-text)' : 'var(--color-text-soft)',
                        margin: '0 0 4px', overflow: 'hidden',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      }}>
                        {icerik.baslik}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          fontSize: '10px', padding: '1px 6px', borderRadius: '999px',
                          background: renk + '20', color: renk, fontWeight: 600,
                        }}>{icerik.kategori}</span>
                        {!ziyaret && <span style={{ fontSize: '10px', color: 'var(--color-text-faint)' }}>{icerik.meta}</span>}
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}
