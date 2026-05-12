'use client';
import { useState } from 'react';

// ─── EĞİTİM VERİSİ ─────────────────────────────────────────────────────────
// 120 e-posta: 48 spam, 72 normal
const P_SPAM = 0.40;
const P_HAM  = 0.60;

const KELIMELER = [
  { id: 'bedava',     metin: 'bedava',      pSpam: 0.84, pHam: 0.03 },
  { id: 'kazandiniz', metin: 'kazandınız',  pSpam: 0.91, pHam: 0.01 },
  { id: 'tiklayin',   metin: 'hemen tıkla', pSpam: 0.79, pHam: 0.04 },
  { id: 'odul',       metin: 'ödül',        pSpam: 0.77, pHam: 0.05 },
  { id: 'acele',      metin: 'acele et',    pSpam: 0.72, pHam: 0.06 },
  { id: 'ucretsiz',   metin: 'ücretsiz',    pSpam: 0.81, pHam: 0.09 },
  { id: 'firsat',     metin: 'son fırsat',  pSpam: 0.68, pHam: 0.11 },
  { id: 'para',       metin: 'para kazan',  pSpam: 0.61, pHam: 0.16 },
  { id: 'toplanti',   metin: 'toplantı',    pSpam: 0.03, pHam: 0.74 },
  { id: 'rapor',      metin: 'rapor',       pSpam: 0.02, pHam: 0.71 },
  { id: 'proje',      metin: 'proje',       pSpam: 0.04, pHam: 0.76 },
  { id: 'analiz',     metin: 'analiz',      pSpam: 0.03, pHam: 0.67 },
  { id: 'sunum',      metin: 'sunum',       pSpam: 0.05, pHam: 0.62 },
  { id: 'ekip',       metin: 'ekip',        pSpam: 0.04, pHam: 0.69 },
  { id: 'merhaba',    metin: 'merhaba',     pSpam: 0.13, pHam: 0.54 },
  { id: 'hafta',      metin: 'bu hafta',    pSpam: 0.10, pHam: 0.59 },
];

// ─── HESAPLAMA ──────────────────────────────────────────────────────────────
function hesapla(secili) {
  if (secili.length === 0) return { spamOlasilik: P_SPAM, hamOlasilik: P_HAM };

  let spamScore = P_SPAM;
  let hamScore  = P_HAM;

  for (const k of secili) {
    spamScore *= k.pSpam;
    hamScore  *= k.pHam;
  }

  const toplam = spamScore + hamScore;
  return {
    spamOlasilik: spamScore / toplam,
    hamOlasilik:  hamScore  / toplam,
    spamScore,
    hamScore,
  };
}

// ─── YARDIMCI BİLEŞENLER ───────────────────────────────────────────────────
function Formul({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: '13px',
      background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)',
      borderRadius: '10px', padding: '14px 18px', margin: '1rem 0',
      overflowX: 'auto', lineHeight: 2.2, whiteSpace: 'nowrap',
    }}>
      {children}
    </div>
  );
}

function KelimeChip({ kelime, secili, onClick }) {
  const spamGuc = kelime.pSpam > 0.5;
  const renk = spamGuc ? '#dc2626' : '#16a34a';
  const bg   = secili
    ? (spamGuc ? 'rgba(220,38,38,0.15)' : 'rgba(22,163,74,0.15)')
    : 'var(--color-cream-card)';
  const border = secili
    ? (spamGuc ? 'rgba(220,38,38,0.5)' : 'rgba(22,163,74,0.5)')
    : 'var(--color-border)';

  return (
    <button onClick={onClick} style={{
      padding: '6px 14px', borderRadius: '999px', fontSize: '13px',
      border: `1.5px solid ${border}`,
      background: bg, cursor: 'pointer', fontFamily: 'inherit',
      color: secili ? renk : 'var(--color-text-soft)',
      fontWeight: secili ? 600 : 400,
      transition: 'all 0.15s',
      display: 'flex', alignItems: 'center', gap: '5px',
    }}>
      {secili && <span style={{ fontSize: '10px' }}>{spamGuc ? '⚠' : '✓'}</span>}
      {kelime.metin}
    </button>
  );
}

// ─── ANA BİLEŞEN ─────────────────────────────────────────────────────────────
export default function NaiveBayesSayfasi() {
  const [secili, setSecili] = useState(new Set());

  const toggle = (id) => {
    setSecili(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const seciliKelimeler = KELIMELER.filter(k => secili.has(k.id));
  const { spamOlasilik, hamOlasilik } = hesapla(seciliKelimeler);
  const spamYuzde = Math.round(spamOlasilik * 100);

  const sonuc = spamYuzde >= 75 ? 'spam'
    : spamYuzde <= 25 ? 'ham'
    : 'notr';

  const sonucRenk   = sonuc === 'spam' ? '#dc2626' : sonuc === 'ham' ? '#16a34a' : '#e8a04a';
  const sonucBg     = sonuc === 'spam' ? 'rgba(220,38,38,0.10)' : sonuc === 'ham' ? 'rgba(22,163,74,0.10)' : 'rgba(232,160,74,0.10)';
  const sonucMetin  = sonuc === 'spam' ? '🚫 SPAM' : sonuc === 'ham' ? '✅ NORMAL' : '🤔 NÖTR';

  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-interactive inline-block mb-3">interaktif</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Naive Bayes: spam filtresi kendi kendine nasıl öğrenir?
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>
          2026 · makine öğrenmesi · olasılık · 12 dakika
        </p>

        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', lineHeight: '1.8', color: 'var(--color-text)', marginBottom: '1.5rem' }}>
          E-posta kutuna düşen her spam, bir olasılık hesabının sonucudur.
          Naive Bayes, kelimelerin geçmiş örüntülerine bakarak
          "bu mesaj spam mı?" sorusuna saniyeler içinde cevap üretir.
          Aşağıda sen de kendi mesajını oluştur — algoritma gerçek zamanlı hesaplasın.
        </p>

        <h2>Bayes teoremi nedir?</h2>
        <p>
          Temel fikir: bir gözlem yaptığında, önceki bilgini bu gözlemle güncelle.
          E-posta örneğinde:
        </p>

        <Formul>
          <span style={{ color: '#7F77DD' }}>P(spam | kelimeler)</span>
          {'  ∝  '}
          <span style={{ color: '#e8a04a' }}>P(spam)</span>
          {'  ×  '}
          <span style={{ color: '#1D9E75' }}>P(kelime₁|spam)</span>
          {'  ×  '}
          <span style={{ color: '#1D9E75' }}>P(kelime₂|spam)</span>
          {'  ×  ···'}
        </Formul>

        <ul>
          <li><strong style={{ color: '#e8a04a' }}>P(spam)</strong> — prior: eğitim setindeki spam oranı</li>
          <li><strong style={{ color: '#1D9E75' }}>P(kelime | spam)</strong> — likelihood: bu kelime spam e-postalarda ne sıklıkta geçiyor?</li>
          <li><strong style={{ color: '#7F77DD' }}>P(spam | kelimeler)</strong> — posterior: bu kelimeleri görünce spam olasılığı nedir?</li>
        </ul>

        <p>
          "Naive" (saf) ismini şuradan alır: her kelimenin birbirinden bağımsız olduğunu varsayar.
          Gerçekte "acele et" ve "bedava" birlikte daha anlamlı olsa da,
          model bunu görmezden gelir — ve yine de놀랄 derecede iyi çalışır.
        </p>

        <h2>Eğitim verisi</h2>
        <p>
          Model, 120 e-postadan öğrendi. Her kelime için spam ve normal e-postalardaki
          geçme sıklıkları hesaplandı.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '1.25rem 0 1.75rem' }}>
          {[
            { deger: '120', label: 'e-posta', alt: 'eğitim seti', renk: 'var(--color-accent)' },
            { deger: '48', label: 'spam',    alt: '%40 oranında', renk: '#dc2626' },
            { deger: '72', label: 'normal',  alt: '%60 oranında', renk: '#16a34a' },
          ].map(({ deger, label, alt, renk }) => (
            <div key={label} style={{
              background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)',
              borderRadius: '12px', padding: '14px 16px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: renk, lineHeight: 1 }}>{deger}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', marginTop: '4px' }}>{label}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginTop: '2px' }}>{alt}</div>
            </div>
          ))}
        </div>

        {/* ─── İNTERAKTİF DEMO ─── */}
        <div style={{
          border: '0.5px solid var(--color-border)', borderRadius: '16px',
          overflow: 'hidden', margin: '2rem 0',
        }}>
          {/* Başlık */}
          <div style={{
            padding: '16px 20px', borderBottom: '0.5px solid var(--color-border)',
            background: 'var(--color-cream-card)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
          }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
              ⚡ Spam Filtresi — Mesaj Oluştur
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>
              Kelimelere tıklayarak mesaja ekle
            </span>
          </div>

          <div style={{ padding: '20px' }}>
            {/* Kelime Havuzu */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-mute)', letterSpacing: '0.06em', marginBottom: '10px' }}>
                KELİME HAVUZU
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {KELIMELER.map(k => (
                  <KelimeChip
                    key={k.id}
                    kelime={k}
                    secili={secili.has(k.id)}
                    onClick={() => toggle(k.id)}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '11px', color: 'var(--color-text-mute)' }}>
                <span><span style={{ color: '#dc2626' }}>⚠</span> kırmızı = spam yanlı kelime</span>
                <span><span style={{ color: '#16a34a' }}>✓</span> yeşil = normal e-posta kelimesi</span>
              </div>
            </div>

            {/* Mesaj Önizleme */}
            <div style={{
              minHeight: '52px', borderRadius: '10px', padding: '12px 16px',
              border: '0.5px solid var(--color-border)', background: 'var(--color-cream)',
              marginBottom: '20px', fontSize: '14px', color: 'var(--color-text-soft)',
              display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px',
            }}>
              {seciliKelimeler.length === 0
                ? <span style={{ color: 'var(--color-text-mute)', fontStyle: 'italic', fontSize: '13px' }}>Yukarıdan kelime seç…</span>
                : seciliKelimeler.map(k => (
                  <span key={k.id} style={{
                    fontWeight: 500, color: k.pSpam > 0.5 ? '#dc2626' : '#16a34a',
                  }}>{k.metin}</span>
                ))
              }
            </div>

            {/* Olasılık Göstergesi */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>Normal %{100 - spamYuzde}</span>
                <div style={{
                  padding: '4px 14px', borderRadius: '999px', fontSize: '13px',
                  fontWeight: 700, background: sonucBg, color: sonucRenk,
                  border: `1px solid ${sonucRenk}40`,
                }}>
                  {sonucMetin}
                </div>
                <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600 }}>Spam %{spamYuzde}</span>
              </div>

              {/* Çift renkli bar */}
              <div style={{ height: '14px', borderRadius: '999px', background: 'var(--color-border)', overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${100 - spamYuzde}%`,
                  background: 'linear-gradient(to right, #16a34a, #4ade80)',
                  borderRadius: '999px 0 0 999px',
                  transition: 'width 0.4s cubic-bezier(.4,0,.2,1)',
                }} />
                <div style={{
                  position: 'absolute', right: 0, top: 0, bottom: 0,
                  width: `${spamYuzde}%`,
                  background: 'linear-gradient(to left, #dc2626, #f87171)',
                  borderRadius: '0 999px 999px 0',
                  transition: 'width 0.4s cubic-bezier(.4,0,.2,1)',
                }} />
              </div>
            </div>

            {/* Hesaplama Tablosu */}
            {seciliKelimeler.length > 0 && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-mute)', letterSpacing: '0.06em', marginBottom: '10px' }}>
                  HESAPLAMA ADIM ADIM
                </div>
                <div style={{ overflowX: 'auto', borderRadius: '10px', border: '0.5px solid var(--color-border)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: 'var(--color-cream-card)' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--color-text)', borderBottom: '0.5px solid var(--color-border)' }}>Kelime</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#dc2626', borderBottom: '0.5px solid var(--color-border)' }}>P(kelime|spam)</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#16a34a', borderBottom: '0.5px solid var(--color-border)' }}>P(kelime|normal)</th>
                        <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, color: 'var(--color-text-mute)', borderBottom: '0.5px solid var(--color-border)' }}>Etki</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '0.5px solid var(--color-border)', background: 'rgba(127,119,221,0.05)' }}>
                        <td style={{ padding: '8px 12px', color: 'var(--color-text-mute)', fontStyle: 'italic' }}>Prior</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', color: '#dc2626', fontWeight: 500 }}>0.40</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', color: '#16a34a', fontWeight: 500 }}>0.60</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center', color: 'var(--color-text-mute)' }}>—</td>
                      </tr>
                      {seciliKelimeler.map(k => {
                        const spamYanli = k.pSpam > k.pHam;
                        return (
                          <tr key={k.id} style={{ borderBottom: '0.5px solid var(--color-border)' }}>
                            <td style={{ padding: '8px 12px', fontWeight: 500, color: 'var(--color-text)' }}>{k.metin}</td>
                            <td style={{ padding: '8px 12px', textAlign: 'right', color: '#dc2626' }}>{k.pSpam.toFixed(2)}</td>
                            <td style={{ padding: '8px 12px', textAlign: 'right', color: '#16a34a' }}>{k.pHam.toFixed(2)}</td>
                            <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                              <span style={{
                                fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px',
                                background: spamYanli ? 'rgba(220,38,38,0.12)' : 'rgba(22,163,74,0.12)',
                                color: spamYanli ? '#dc2626' : '#16a34a',
                              }}>
                                {spamYanli ? '→ spam' : '→ normal'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      <tr style={{ background: 'var(--color-cream-card)' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 700, color: 'var(--color-text)' }}>Sonuç</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#dc2626' }}>%{spamYuzde}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>%{100 - spamYuzde}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: sonucRenk }}>{sonucMetin}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sıfırla */}
            {secili.size > 0 && (
              <button
                onClick={() => setSecili(new Set())}
                style={{
                  marginTop: '14px', padding: '6px 16px', borderRadius: '8px', fontSize: '12px',
                  border: '0.5px solid var(--color-border)', background: 'transparent',
                  color: 'var(--color-text-mute)', cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Temizle
              </button>
            )}
          </div>
        </div>

        <h2>Formülü açalım</h2>
        <p>
          Birden fazla kelime seçtiğinde model bunların olasılıklarını <em>çarpar</em>.
          "bedava" ve "kazandınız" aynı mesajda görünüyorsa:
        </p>

        <Formul>
          <div><span style={{ color: '#e8a04a' }}>P(spam)</span> = 0.40</div>
          <div>{'× '}<span style={{ color: '#1D9E75' }}>P("bedava" | spam)</span> = 0.84</div>
          <div>{'× '}<span style={{ color: '#1D9E75' }}>P("kazandınız" | spam)</span> = 0.91</div>
          <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '4px', paddingTop: '4px' }}>
            = <span style={{ color: '#dc2626', fontWeight: 700 }}>0.306</span>
            {'  →  normalize  →  '}
            <span style={{ color: '#dc2626', fontWeight: 700 }}>%98 spam</span>
          </div>
        </Formul>

        <p>
          Aynı şeyi normal e-posta için de hesaplar, ikisini toplar ve normalize eder
          (oranlarının toplama bölünmesi). Sonuç her zaman 0-1 arasında bir olasılık.
        </p>

        <h2>Neden "Naive"?</h2>
        <p>
          Model kelimelerin birbirinden bağımsız olduğunu varsayar — oysa gerçekte değiller.
          "Para" ve "kazan" birlikte geldiğinde spam sinyali çok daha güçlü olur,
          ama Naive Bayes her birini ayrı ayrı değerlendirir.
        </p>
        <p>
          Bu varsayım teknik olarak yanlış, ama pratikte iyi çalışır.
          1990'larda spam filtrelerinde ilk kez büyük ölçekte kullanıldı ve onlarca yıl
          standart yöntem olarak kaldı.
        </p>

        <h2>Güçlü yönleri</h2>
        <ul>
          <li><strong>Hızlı</strong> — eğitimi ve tahmini O(n) zaman alır</li>
          <li><strong>Az veri</strong> — binlerce örnek olmadan da çalışır</li>
          <li><strong>Kategorik veri</strong> — metin sınıflandırma için doğal uyum</li>
          <li><strong>Yorumlanabilir</strong> — her kelimenin katkısını görebilirsin</li>
        </ul>

        <h2>Zayıf yönleri</h2>
        <ul>
          <li><strong>Bağımsızlık varsayımı</strong> — kelimeler arasındaki ilişkileri görmez</li>
          <li><strong>Sıfır frekans</strong> — eğitimde hiç görülmemiş kelime olasılığı sıfırlar her şeyi (Laplace düzeltmesi gerekir)</li>
          <li><strong>Sürekli özellikler</strong> — sayısal veriler için Gaussian NB kullanmak gerekir</li>
        </ul>

        <h2>Python'da 10 satırda</h2>
        <pre>{`from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer

# Eğitim verisi
emailler = ["bedava kazan", "toplantı raporu", "ücretsiz tıkla", "proje analiz"]
etiketler = [1, 0, 1, 0]  # 1=spam, 0=normal

# Metin → sayı matrisi
vek = CountVectorizer()
X = vek.fit_transform(emailler)

# Model eğit
model = MultinomialNB()
model.fit(X, etiketler)

# Yeni e-postayı sınıflandır
yeni = vek.transform(["bedava fırsat"])
print(model.predict(yeni))          # [1] → spam
print(model.predict_proba(yeni))    # [[0.03, 0.97]] → %97 spam`}</pre>

        <h2>Özet</h2>
        <ul>
          <li>Naive Bayes, Bayes teoremini koşullu bağımsızlık varsayımıyla uygular</li>
          <li>Her kelimenin spam/normal e-postalardaki olasılığını çarparak sınıflandırır</li>
          <li>Hızlı, yorumlanabilir ve az veriyle iyi çalışır</li>
          <li>Metin sınıflandırma, duygu analizi ve dil tespitinde hâlâ aktif kullanılır</li>
        </ul>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Sonraki: <a href="/yazilar/decision-tree" style={{ color: '#1D9E75', textDecoration: 'none' }}>Decision tree: ağacı sen büyüt →</a>
        </p>
      </article>
    </main>
  );
}
