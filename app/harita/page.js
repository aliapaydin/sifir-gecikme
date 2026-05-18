'use client';

import { useState, useEffect } from 'react';
import { icerikler } from '../../lib/icerikler';
import { dersler } from '../../lib/dersler';

const TOPLAM_DERS = dersler.length;

// ─── KATEGORİ UZMANLIKLARI ──────────────────────────────────────────────────
const UZMANLIK = [
  {
    id: 'ml', label: 'Makine Öğrenmesi', renk: '#1D9E75', bg: '#E1F5EE',
    icerikler: ['/yazilar/linear-regression','/yazilar/gradient-descent','/yazilar/confusion-matrix',
      '/yazilar/bias-variance','/yazilar/kmeans','/yazilar/sinir-agi','/yazilar/decision-tree'],
  },
  {
    id: 'sql', label: 'SQL & Veri Mühendisliği', renk: '#185FA5', bg: '#E6F1FB',
    icerikler: ['/yazilar/sql-temelleri','/yazilar/etl-nedir','/yazilar/dbt-nedir','/sql','/yazilar/mulakat-sql'],
    queryBonus: 'sql',
  },
  {
    id: 'python', label: 'Python & Pandas', renk: '#2E7D32', bg: '#E8F5E9',
    icerikler: ['/python','/yazilar/pandas-7-sey','/yazilar/veri-temizleme','/yazilar/feature-engineering'],
    queryBonus: 'python',
  },
  {
    id: 'istatistik', label: 'İstatistik & Analiz', renk: '#6A1B9A', bg: '#F3E5F5',
    icerikler: ['/yazilar/ab-test','/yazilar/sample-size','/yazilar/izmir-kira-analizi',
      '/yazilar/superlig-xg','/yazilar/bezier'],
  },
  {
    id: 'kariyer', label: 'Kariyer', renk: '#BA7517', bg: '#FAEEDA',
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
  { id: 'kalori_ziy',  icon: '🥗', label: 'Kalori Takibi',      desc: 'Kalori modülünü ziyaret et',          kosul: (v) => v.kaloriZiyaret },
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
    <div style={{ width: '100%', height, borderRadius: 999, background: bg || '#eee', overflow: 'hidden' }}>
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

  useEffect(() => {
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
      };
      const basarimDurum = BASARIMLAR.map(b => ({ ...b, kazanildi: b.kosul(stats) }));

      setVeri({
        ziyaretler, sqlSorgu, pythonSorgu, sinavPuani, gunlukSoru, dogru,
        uzmanlikYuzde, genelYuzde, basarimDurum, stats, tamamlananDersSayisi,
        mulakatSoru, mulakatBiliyorum, milyonOyun, milyonMaxK, milyonToplamS,
        cizTahmin, nnEgitim, regexTest, kaloriZiyaret, veriSetiZiyaret,
      });
    } catch {}
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
  } = veri;
  const sinavAcik = tamamlananDersSayisi >= TOPLAM_DERS;
  const sinavaKalan = Math.max(0, TOPLAM_DERS - tamamlananDersSayisi);
  const kazanilanBasarim = basarimDurum.filter(b => b.kazanildi).length;

  const filtrelenmisIcerikler = aktifFiltre === 'tumu'
    ? icerikler
    : icerikler.filter(i => i.kategori === aktifFiltre);

  const kategoriler = ['tumu', ...new Set(icerikler.map(i => i.kategori))];

  return (
    <main className="min-h-screen" style={{ paddingBottom: '80px' }}>
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Başlık */}
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <div style={{ marginBottom: '32px' }}>
          <h1 className="font-serif text-4xl font-medium leading-tight mb-2" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
            İlerleme Haritam
          </h1>
          <p style={{ color: 'var(--color-text-mute)', fontSize: '14px' }}>
            Bu cihazdaki aktivitene göre hesaplanır · Hesap gerekmez
          </p>
        </div>

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
                  ? <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', background: '#F0FDF4', color: '#16a34a', fontWeight: 700 }}>AÇIK</span>
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
          </div>
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
