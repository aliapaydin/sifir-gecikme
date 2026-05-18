'use client';

import { useState } from 'react';

// ─── Renk Paleti ─────────────────────────────────────────────────────────────
const R = {
  delta:   { bg: '#E1F5EE', border: '#1D9E75', text: '#0F6E56', dot: '#1D9E75' },
  spark:   { bg: '#DBEAFE', border: '#2563EB', text: '#1E3A8A', dot: '#3B82F6' },
  ml:      { bg: '#F3E8FF', border: '#9333EA', text: '#581C87', dot: '#A855F7' },
  sql:     { bg: '#FEF9C3', border: '#CA8A04', text: '#713F12', dot: '#EAB308' },
  uyari:   { bg: '#FEF2F2', border: '#DC2626', text: '#7F1D1D', dot: '#EF4444' },
  bilgi:   { bg: '#F0F9FF', border: '#0EA5E9', text: '#0C4A6E', dot: '#38BDF8' },
};

// ─── Lakehouse Mimari Diyagramı ──────────────────────────────────────────────

const KATMANLAR = [
  {
    id: 'kaynaklar',
    label: 'Veri Kaynakları',
    icon: '🗃️',
    renk: '#6B7280',
    bg: 'var(--color-cream)',
    border: 'var(--color-border)',
    items: ['S3 / ADLS / GCS', 'Kafka / Kinesis', 'JDBC Veritabanları', 'REST API\'ler', 'Dosya Sistemi'],
  },
  {
    id: 'delta',
    label: 'Delta Lake (Depolama Katmanı)',
    icon: '△',
    renk: '#1D9E75',
    bg: '#E1F5EE',
    border: '#1D9E75',
    items: ['Bronze (Ham Veri)', 'Silver (Temiz Veri)', 'Gold (İş Katmanı)', 'ACID İşlemler', 'Time Travel'],
  },
  {
    id: 'runtime',
    label: 'Databricks Runtime',
    icon: '⚡',
    renk: '#2563EB',
    bg: '#DBEAFE',
    border: '#2563EB',
    items: ['Apache Spark', 'Photon Engine', 'Delta Engine', 'MLflow', 'Unity Catalog'],
  },
  {
    id: 'kullanim',
    label: 'Kullanım Katmanı',
    icon: '🎯',
    renk: '#9333EA',
    bg: '#F3E8FF',
    border: '#9333EA',
    items: ['Notebooks', 'Databricks SQL', 'ML Experiments', 'Jobs & Workflows', 'BI Araçları'],
  },
];

export function LakehouseDiyagram() {
  const [aktif, setAktif] = useState(null);

  return (
    <div style={{ margin: '1.5rem 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {KATMANLAR.map((k, i) => (
          <div key={k.id}>
            <button
              onClick={() => setAktif(aktif === k.id ? null : k.id)}
              style={{
                width: '100%', textAlign: 'left', cursor: 'pointer',
                padding: '12px 18px', borderRadius: '10px',
                border: `1.5px solid ${aktif === k.id ? k.border : 'var(--color-border)'}`,
                background: aktif === k.id ? k.bg : 'var(--color-cream-card)',
                display: 'flex', alignItems: 'center', gap: '12px',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: '20px', width: '28px', textAlign: 'center', flexShrink: 0 }}>{k.icon}</span>
              <span style={{ fontWeight: 700, fontSize: '13.5px', color: aktif === k.id ? k.renk : 'var(--color-text)', flex: 1 }}>
                {k.label}
              </span>
              <span style={{ fontSize: '11px', color: aktif === k.id ? k.renk : 'var(--color-text-mute)', fontWeight: 600 }}>
                {aktif === k.id ? '▲ kapat' : '▼ detay'}
              </span>
            </button>

            {aktif === k.id && (
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '6px',
                padding: '10px 14px',
                background: k.bg, borderRadius: '0 0 10px 10px',
                border: `1.5px solid ${k.border}`, borderTop: 'none',
              }}>
                {k.items.map(item => (
                  <span key={item} style={{
                    padding: '4px 10px', borderRadius: '6px',
                    background: 'rgba(255,255,255,0.7)', fontSize: '12px',
                    fontWeight: 600, color: k.renk,
                    border: `1px solid ${k.border}40`,
                  }}>
                    {item}
                  </span>
                ))}
              </div>
            )}

            {i < KATMANLAR.length - 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', fontSize: '18px', color: 'var(--color-border)', lineHeight: 1, margin: '0' }}>
                ↓
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Cluster Türleri Karşılaştırması ─────────────────────────────────────────

const CLUSTER_TURLERI = [
  {
    id: 'all_purpose',
    label: 'All-Purpose Cluster',
    icon: '🔄',
    renk: '#2563EB',
    bg: '#DBEAFE',
    aciklama: 'Etkileşimli geliştirme ve analiz için. Notebook\'ta çalışırsın.',
    kullanim: ['Notebook geliştirme', 'Veri keşfi', 'Ad-hoc analiz', 'Model deneme'],
    dikkat: 'Pahalı — işin bitince durdur',
    auto_terminate: true,
    fiyat: '⭐⭐⭐⭐',
  },
  {
    id: 'job_cluster',
    label: 'Job Cluster',
    icon: '⚙️',
    renk: '#1D9E75',
    bg: '#E1F5EE',
    aciklama: 'Otomatik iş akışları için. Job başlarken açılır, bitince kapanır.',
    kullanim: ['ETL pipeline\'ları', 'Günlük batch job\'lar', 'ML model eğitimi', 'Scheduled işler'],
    dikkat: 'En ekonomik seçenek',
    auto_terminate: true,
    fiyat: '⭐⭐',
  },
  {
    id: 'sql_warehouse',
    label: 'SQL Warehouse',
    icon: '🗄️',
    renk: '#CA8A04',
    bg: '#FEF9C3',
    aciklama: 'Databricks SQL ve BI araçları için özel. Photon motoru ile optimize.',
    kullanim: ['Databricks SQL', 'Tableau / Power BI', 'Dashboard sorguları', 'Analitik işler'],
    dikkat: 'SQL için en hızlı seçenek',
    auto_terminate: true,
    fiyat: '⭐⭐⭐',
  },
];

export function ClusterKarsilastirici() {
  const [aktif, setAktif] = useState('all_purpose');
  const secili = CLUSTER_TURLERI.find(c => c.id === aktif);

  return (
    <div style={{ border: '0.5px solid var(--color-border)', borderRadius: '14px', overflow: 'hidden', margin: '1.5rem 0' }}>
      {/* Tab'lar */}
      <div style={{ display: 'flex', borderBottom: '0.5px solid var(--color-border)', background: 'var(--color-cream)' }}>
        {CLUSTER_TURLERI.map(c => (
          <button
            key={c.id}
            onClick={() => setAktif(c.id)}
            style={{
              flex: 1, padding: '12px 8px', border: 'none', cursor: 'pointer',
              borderBottom: `2.5px solid ${aktif === c.id ? c.renk : 'transparent'}`,
              background: aktif === c.id ? c.bg : 'transparent',
              fontSize: '12px', fontWeight: aktif === c.id ? 700 : 500,
              color: aktif === c.id ? c.renk : 'var(--color-text-mute)',
              transition: 'all 0.15s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            }}
          >
            <span style={{ fontSize: '18px' }}>{c.icon}</span>
            <span style={{ lineHeight: 1.3, textAlign: 'center' }}>{c.label}</span>
          </button>
        ))}
      </div>

      {/* İçerik */}
      {secili && (
        <div style={{ padding: '20px', background: 'var(--color-cream-card)' }}>
          <p style={{ fontSize: '13.5px', color: 'var(--color-text)', marginBottom: '16px', lineHeight: 1.6 }}>
            {secili.aciklama}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-mute)', marginBottom: '8px', letterSpacing: '0.06em' }}>
                KULLANIM ALANLARI
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {secili.kullanim.map(k => (
                  <div key={k} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: secili.renk, fontWeight: 700, fontSize: '12px' }}>✓</span>
                    <span style={{ fontSize: '12.5px', color: 'var(--color-text-soft)' }}>{k}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-mute)', marginBottom: '6px', letterSpacing: '0.06em' }}>
                  MALİYET
                </div>
                <span style={{ fontSize: '16px' }}>{secili.fiyat}</span>
              </div>
              <div style={{ padding: '10px 12px', borderRadius: '8px', background: secili.bg, border: `1px solid ${secili.renk}40` }}>
                <span style={{ fontSize: '12px', color: secili.renk, fontWeight: 600 }}>
                  💡 {secili.dikkat}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Delta Lake Operasyonları ─────────────────────────────────────────────────

const DELTA_OPS = [
  {
    id: 'acid',
    label: 'ACID İşlemler',
    icon: '🔒',
    renk: '#1D9E75',
    bg: '#E1F5EE',
    aciklama: 'Delta Lake her yazma işlemini atomik yapar. Yarıda kesen job bozuk tablo bırakmaz.',
    kod: `-- Tek bir atomik işlemde güncelle
UPDATE musteri_tablosu
SET   segment = 'premium'
WHERE toplam_harcama > 50000;

-- Merge (Upsert) işlemi
MERGE INTO hedef_tablo AS h
USING kaynak_tablo   AS k
ON    h.id = k.id
WHEN MATCHED     THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *;`,
  },
  {
    id: 'time_travel',
    label: 'Time Travel',
    icon: '⏰',
    renk: '#2563EB',
    bg: '#DBEAFE',
    aciklama: 'Delta Lake her değişikliği loglar. Geçmişteki herhangi bir versiyona dönebilirsin.',
    kod: `-- Version numarasıyla geçmişe git
SELECT * FROM satislar VERSION AS OF 42;

-- Zaman damgasıyla geçmişe git
SELECT * FROM satislar
TIMESTAMP AS OF '2024-03-15 09:00:00';

-- Değişiklik geçmişini gör
DESCRIBE HISTORY satislar;

-- Tabloya geri al (yanlış güncellemeyi düzelt)
RESTORE TABLE satislar TO VERSION AS OF 41;`,
  },
  {
    id: 'schema',
    label: 'Schema Evolution',
    icon: '📐',
    renk: '#9333EA',
    bg: '#F3E8FF',
    aciklama: 'Yeni sütun ekleme, tip değiştirme — Delta schema\'yı otomatik veya kontrollü evrimleştirir.',
    kod: `# Yeni sütunla gelen veriyi otomatik kabul et
df.write.format("delta") \\
    .option("mergeSchema", "true") \\
    .mode("append") \\
    .save("/delta/musteriler")

# Sütun ekle / sil / yeniden adlandır
ALTER TABLE musteriler ADD COLUMN telefon STRING;
ALTER TABLE musteriler DROP COLUMN eski_alan;

-- Schema kısıtlaması — bozuk veriyi reddet
ALTER TABLE siparisler
ADD CONSTRAINT tutar_pozitif CHECK (tutar > 0);`,
  },
  {
    id: 'zorder',
    label: 'Optimize & Z-Order',
    icon: '⚡',
    renk: '#CA8A04',
    bg: '#FEF9C3',
    aciklama: 'Küçük dosyaları birleştir, sık sorgulanan sütunlara göre fiziksel sırala — sorgu hızı dramatik artar.',
    kod: `-- Küçük dosya sorununu çöz
OPTIMIZE satislar;

-- Belirli sütunlara göre Z-Order uygula
-- (genelde WHERE'de kullandığın sütunlar)
OPTIMIZE satislar
ZORDER BY (musteri_id, siparis_tarihi);

-- Eski dosyaları temizle (retention süresine göre)
VACUUM satislar RETAIN 168 HOURS;

-- Tablo istatistiklerini güncelle
ANALYZE TABLE satislar COMPUTE STATISTICS;`,
  },
];

export function DeltaOps() {
  const [aktif, setAktif] = useState('acid');
  const [kopyalandi, setKopyalandi] = useState(false);
  const op = DELTA_OPS.find(o => o.id === aktif);

  const kopyala = () => {
    navigator.clipboard?.writeText(op.kod).then(() => {
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 1500);
    });
  };

  return (
    <div style={{ border: '0.5px solid var(--color-border)', borderRadius: '14px', overflow: 'hidden', margin: '1.5rem 0' }}>
      {/* Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '0.5px solid var(--color-border)', background: 'var(--color-cream)' }}>
        {DELTA_OPS.map(o => (
          <button
            key={o.id}
            onClick={() => setAktif(o.id)}
            style={{
              padding: '10px 6px', border: 'none', cursor: 'pointer',
              borderBottom: `2.5px solid ${aktif === o.id ? o.renk : 'transparent'}`,
              background: aktif === o.id ? o.bg : 'transparent',
              fontSize: '11.5px', fontWeight: aktif === o.id ? 700 : 500,
              color: aktif === o.id ? o.renk : 'var(--color-text-mute)',
              transition: 'all 0.15s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            }}
          >
            <span style={{ fontSize: '16px' }}>{o.icon}</span>
            <span style={{ lineHeight: 1.2, textAlign: 'center' }}>{o.label}</span>
          </button>
        ))}
      </div>

      {op && (
        <div style={{ background: 'var(--color-cream-card)' }}>
          <div style={{ padding: '14px 18px', borderBottom: '0.5px solid var(--color-border)', background: op.bg }}>
            <p style={{ fontSize: '13px', color: op.renk, margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
              {op.aciklama}
            </p>
          </div>
          <div style={{ position: 'relative' }}>
            <button
              onClick={kopyala}
              style={{
                position: 'absolute', top: '10px', right: '10px', zIndex: 1,
                padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                background: kopyalandi ? 'var(--color-accent)' : 'var(--color-border)',
                color: kopyalandi ? '#fff' : 'var(--color-text-soft)',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {kopyalandi ? '✓' : 'Kopyala'}
            </button>
            <pre style={{
              margin: 0, padding: '18px 20px', paddingTop: '40px',
              fontSize: '12.5px', lineHeight: '1.65',
              color: 'var(--color-text)', background: 'transparent',
              overflowX: 'auto', fontFamily: 'var(--font-mono), Menlo, monospace',
            }}>
              {op.kod}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Medallion Mimarisi ───────────────────────────────────────────────────────

const MEDALLION = [
  {
    id: 'bronze',
    label: 'Bronze',
    icon: '🥉',
    renk: '#B45309',
    bg: '#FEF3C7',
    border: '#D97706',
    aciklama: 'Ham veri — olduğu gibi',
    detay: 'Kaynak veri dokunulmadan kopyalanır. JSON, CSV, Parquet, Avro. Hata ayıklama için tam geçmiş saklanır.',
    items: ['Kaynak formatı korunur', 'Şema doğrulama yok', 'Tüm versiyon geçmişi', 'Audit için kaynak'],
  },
  {
    id: 'silver',
    label: 'Silver',
    icon: '🥈',
    renk: '#475569',
    bg: '#F1F5F9',
    border: '#64748B',
    aciklama: 'Temiz, doğrulanmış veri',
    detay: 'Bronze\'dan gelen veri temizlenir, birleştirilir, şema kısıtlamaları uygulanır. Teknik ekip buradan okur.',
    items: ['NULL / duplikat temizliği', 'Tip dönüşümleri', 'JOIN ve zenginleştirme', 'Şema kısıtlamaları'],
  },
  {
    id: 'gold',
    label: 'Gold',
    icon: '🥇',
    renk: '#B45309',
    bg: '#FFFBEB',
    border: '#F59E0B',
    aciklama: 'İş mantığı uygulanmış veri',
    detay: 'Silver\'dan aggregate, iş kuralları uygulanmış son tablo. BI araçları, raporlar ve ML modelleri buradan beslenir.',
    items: ['Aggregate\'ler hazır', 'İş metrikler tanımlı', 'BI / Dashboard için', 'ML feature store'],
  },
];

export function MedallionMimari() {
  const [aktif, setAktif] = useState(null);

  return (
    <div style={{ margin: '1.5rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'stretch', gap: '0' }}>
        {MEDALLION.map((m, i) => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <button
              onClick={() => setAktif(aktif === m.id ? null : m.id)}
              style={{
                flex: 1, padding: '16px 12px',
                borderRadius: i === 0 ? '12px 0 0 12px' : i === 2 ? '0 12px 12px 0' : '0',
                border: `1.5px solid ${aktif === m.id ? m.border : 'var(--color-border)'}`,
                borderRight: i < 2 ? 'none' : undefined,
                background: aktif === m.id ? m.bg : 'var(--color-cream-card)',
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                height: '100%',
              }}
            >
              <span style={{ fontSize: '28px' }}>{m.icon}</span>
              <span style={{ fontWeight: 800, fontSize: '14px', color: aktif === m.id ? m.renk : 'var(--color-text)' }}>
                {m.label}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-mute)', textAlign: 'center', lineHeight: 1.3 }}>
                {m.aciklama}
              </span>
            </button>
            {i < 2 && (
              <div style={{ fontSize: '20px', color: 'var(--color-border)', flexShrink: 0, zIndex: 1, margin: '0 -2px' }}>→</div>
            )}
          </div>
        ))}
      </div>
      {aktif && (() => {
        const m = MEDALLION.find(x => x.id === aktif);
        return (
          <div style={{
            marginTop: '8px', padding: '14px 18px', borderRadius: '10px',
            background: m.bg, border: `1.5px solid ${m.border}`,
          }}>
            <p style={{ fontSize: '13px', color: m.renk, fontWeight: 500, margin: '0 0 10px', lineHeight: 1.5 }}>
              {m.detay}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {m.items.map(item => (
                <span key={item} style={{
                  padding: '3px 10px', borderRadius: '6px',
                  background: 'rgba(255,255,255,0.8)', fontSize: '12px',
                  fontWeight: 600, color: m.renk, border: `1px solid ${m.border}40`,
                }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── Maliyet Optimizasyon İpuçları ───────────────────────────────────────────

const MALIYET_IPUCLARI = [
  { icon: '⏱️', baslik: 'Auto Terminate', aciklama: 'Cluster\'a mutlaka auto-terminate koy. 120 dk. boşta kalınca kapansın. En yaygın maliyet kaynağı unutulan cluster\'lar.' },
  { icon: '📦', baslik: 'Spot Instance', aciklama: 'Worker node\'lar için Spot/Preemptible instance kullan. %60-80 tasarruf. Driver node\'u on-demand bırak.' },
  { icon: '🔧', baslik: 'Cluster Politikası', aciklama: 'Admin olarak Cluster Policy tanımla. Kullanıcılar sadece onaylı instance tiplerini seçebilsin — sürpriz fatura yok.' },
  { icon: '📊', baslik: 'Photon Engine', aciklama: 'SQL Warehouse ve DBR 9.1+ ile gelen Photon, özellikle aggregate sorgularda 5-10x hız artışı verir — daha az DBU tüketir.' },
  { icon: '🗂️', baslik: 'Partition Pruning', aciklama: 'Büyük tablolarda WHERE koşulu partition sütununu kapsamalı. Aksi hâlde tüm tablo taranır. OPTIMIZE + ZORDER ile destekle.' },
  { icon: '💾', baslik: 'Cache Kullan', aciklama: 'Birden fazla işlemde kullanacağın DataFrame\'i cache()/persist() ile bellekte tut. Spark her seferinde yeniden hesaplamaz.' },
];

export function MaliyetIpuclari() {
  const [acik, setAcik] = useState(null);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px', margin: '1.5rem 0' }}>
      {MALIYET_IPUCLARI.map((tip, i) => (
        <button
          key={i}
          onClick={() => setAcik(acik === i ? null : i)}
          style={{
            padding: '14px 16px', borderRadius: '10px', textAlign: 'left', cursor: 'pointer',
            border: `1px solid ${acik === i ? 'var(--color-accent)' : 'var(--color-border)'}`,
            background: acik === i ? 'var(--color-accent-soft)' : 'var(--color-cream-card)',
            transition: 'all 0.15s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: acik === i ? '8px' : '0' }}>
            <span style={{ fontSize: '20px' }}>{tip.icon}</span>
            <span style={{ fontWeight: 700, fontSize: '13px', color: acik === i ? 'var(--color-accent-text)' : 'var(--color-text)' }}>
              {tip.baslik}
            </span>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--color-text-mute)' }}>
              {acik === i ? '▲' : '▼'}
            </span>
          </div>
          {acik === i && (
            <p style={{ fontSize: '12.5px', color: 'var(--color-text-soft)', margin: 0, lineHeight: 1.55 }}>
              {tip.aciklama}
            </p>
          )}
        </button>
      ))}
    </div>
  );
}
