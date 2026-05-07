'use client';

import { useEffect, useRef, useState } from 'react';

const SNIPPETS = {
  baslangic: {
    label: '🐍 Başlangıç',
    kod: `# Merhaba Python!
# Bu alanda gerçek Python kodu çalışıyor.
# Cmd+Enter veya ▶ Çalıştır ile dene.

isim = "Sıfır Gecikme"
print(f"Hoş geldin, {isim}!")

# Basit hesaplamalar
sayilar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
print(f"Sayılar: {sayilar}")
print(f"Toplam: {sum(sayilar)}")
print(f"Ortalama: {sum(sayilar)/len(sayilar)}")
print(f"Maksimum: {max(sayilar)}")`,
  },
  pandas: {
    label: '🐼 Pandas',
    kod: `import pandas as pd
import numpy as np

# DataFrame oluştur
veri = {
    'isim': ['Ali', 'Ayşe', 'Mehmet', 'Zeynep', 'Can'],
    'yas': [28, 34, 25, 31, 29],
    'sehir': ['İzmir', 'İstanbul', 'Ankara', 'İzmir', 'İstanbul'],
    'maas': [8500, 12000, 7200, 9800, 11000]
}

df = pd.DataFrame(veri)
print("=== DataFrame ===")
print(df.to_string())
print(f"\\nŞekil: {df.shape}")
print(f"\\nŞehre göre ortalama maaş:")
print(df.groupby('sehir')['maas'].mean().round(0).to_string())
print(f"\\nİstatistiksel özet:")
print(df[['yas','maas']].describe().round(1).to_string())`,
  },
  numpy: {
    label: '🔢 NumPy',
    kod: `import numpy as np

# Vektör işlemleri
a = np.array([1, 2, 3, 4, 5])
b = np.array([10, 20, 30, 40, 50])

print(f"a = {a}")
print(f"b = {b}")
print(f"a + b = {a + b}")
print(f"a * b = {a * b}")
print(f"a . b (dot) = {np.dot(a, b)}")

# Matris
M = np.random.randint(1, 10, size=(3, 3))
print(f"\\nRastgele matris:\\n{M}")
print(f"Transpoz:\\n{M.T}")
print(f"Satır toplamları: {M.sum(axis=1)}")
print(f"Sütun ortalamaları: {M.mean(axis=0).round(2)}")`,
  },
  istatistik: {
    label: '📊 İstatistik',
    kod: `import numpy as np
from scipy import stats

# İki grup karşılaştırma — bağımsız t-testi
np.random.seed(42)
kontrol = np.random.normal(loc=5.0, scale=0.5, size=30)
deney   = np.random.normal(loc=5.5, scale=0.5, size=30)

t, p = stats.ttest_ind(kontrol, deney)

print("=== Bağımsız Örneklem t-Testi ===")
print(f"Kontrol grubu: ort={kontrol.mean():.3f}, std={kontrol.std():.3f}")
print(f"Deney grubu:   ort={deney.mean():.3f}, std={deney.std():.3f}")
print(f"\\nt istatistiği: {t:.4f}")
print(f"p değeri:       {p:.4f}")
print()
if p < 0.05:
    print("✓ Fark istatistiksel olarak anlamlı (p < 0.05)")
else:
    print("✗ Fark istatistiksel olarak anlamlı değil")

# Normallik testi
_, p_norm = stats.shapiro(kontrol)
print(f"\\nNormallik testi (Shapiro-Wilk): p={p_norm:.4f}")`,
  },
  regresyon: {
    label: '📈 Regresyon',
    kod: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error

# Veri oluştur
np.random.seed(42)
X = np.random.uniform(10, 40, 50).reshape(-1, 1)
y = 15 * X.ravel() - 200 + np.random.normal(0, 50, 50)

# Eğit / test böl
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Model
model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print("=== Linear Regression ===")
print(f"Eğim (coef):    {model.coef_[0]:.4f}")
print(f"Kesişim:        {model.intercept_:.4f}")
print(f"R² (test):      {r2_score(y_test, y_pred):.4f}")
print(f"MAE (test):     {mean_absolute_error(y_test, y_pred):.2f}")
print()
print("Örnek tahminler:")
for x_val in [15, 25, 35]:
    pred = model.predict([[x_val]])[0]
    print(f"  x={x_val} → y={pred:.1f}")`,
  },
  kmeans: {
    label: '🔵 K-Means',
    kod: `import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# Yapay müşteri verisi (RFM benzeri)
np.random.seed(42)
n = 100
recency  = np.concatenate([np.random.normal(5,1,34), np.random.normal(15,2,33), np.random.normal(30,3,33)])
monetary = np.concatenate([np.random.normal(1000,100,34), np.random.normal(400,80,33), np.random.normal(150,30,33)])

X = np.column_stack([recency, monetary])

# Ölçekle
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# K-Means
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
labels = kmeans.fit_predict(X_scaled)

print("=== Müşteri Segmentasyonu (K-Means) ===")
print(f"İnertia: {kmeans.inertia_:.2f}")
print()
for k in range(3):
    mask = labels == k
    print(f"Segment {k+1}: {mask.sum()} müşteri")
    print(f"  Ort. son alışveriş: {recency[mask].mean():.1f} gün önce")
    print(f"  Ort. harcama: {monetary[mask].mean():.0f} TL")`,
  },
  liste: {
    label: '📋 Temel Python',
    kod: `# Python temel yapıları

# Liste işlemleri
notlar = [85, 92, 78, 95, 88, 76, 91, 83]
print(f"Notlar: {notlar}")
print(f"Ortalama: {sum(notlar)/len(notlar):.1f}")
print(f"En yüksek: {max(notlar)}")
print(f"En düşük: {min(notlar)}")

# List comprehension
gecenler = [n for n in notlar if n >= 85]
print(f"\\n85 ve üzeri: {gecenler}")

kareler = [n**2 for n in range(1, 6)]
print(f"Kareler: {kareler}")

# Sözlük
ogrenciler = {'Ali': 85, 'Ayşe': 92, 'Mehmet': 78, 'Zeynep': 95}
print(f"\\nÖğrenci notları:")
for isim, not_ in sorted(ogrenciler.items(), key=lambda x: x[1], reverse=True):
    durum = "✓" if not_ >= 85 else "✗"
    print(f"  {durum} {isim}: {not_}")`,
  },
};

export default function PythonPlayground() {
  const [code, setCode] = useState(SNIPPETS.baslangic.kod);
  const [output, setOutput] = useState('▶ Çalıştır butonuna bas veya Cmd+Enter kullan.');
  const [status, setStatus] = useState('Bekliyor');
  const [time, setTime] = useState('—');
  const [runs, setRuns] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [pyStatus, setPyStatus] = useState('yükleniyor');
  const [activeSnippet, setActiveSnippet] = useState('baslangic');
  const pyodideRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
    script.onload = async () => {
      try {
        setPyStatus('hazırlanıyor');
        const py = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/' });
        await py.loadPackagesFromImports('import numpy, pandas; from scipy import stats; from sklearn.cluster import KMeans; from sklearn.linear_model import LinearRegression');
        pyodideRef.current = py;
        setPyStatus('hazır');
      } catch (e) {
        setPyStatus('hata');
      }
    };
    document.head.appendChild(script);
  }, []);

  const runCode = async () => {
    if (!pyodideRef.current) {
      setOutput('⏳ Pyodide henüz yüklenmedi, lütfen bekle...');
      return;
    }
    setIsRunning(true);
    setStatus('Çalışıyor');
    setOutput('');
    const t0 = performance.now();
    try {
      let out = '';
      pyodideRef.current.globals.set('print', (...args) => {
        out += args.map(a => String(a)).join(' ') + '\n';
      });
      await pyodideRef.current.runPythonAsync(code);
      const elapsed = ((performance.now() - t0) / 1000).toFixed(2);
      setOutput(out || '(çıktı yok)');
      setStatus('✓ Başarılı');
      setTime(`${elapsed}s`);
      setRuns(r => r + 1);
    } catch (e) {
      const elapsed = ((performance.now() - t0) / 1000).toFixed(2);
      setOutput('✗ Hata:\n' + e.message);
      setStatus('✗ Hata');
      setTime(`${elapsed}s`);
    }
    setIsRunning(false);
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); runCode(); }
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.target;
      const s = ta.selectionStart;
      const newVal = ta.value.slice(0, s) + '    ' + ta.value.slice(ta.selectionEnd);
      setCode(newVal);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 4; }, 0);
    }
  };

  const statusColor = pyStatus === 'hazır' ? '#1D9E75' : pyStatus === 'hata' ? '#E24B4A' : '#e8a04a';

  return (
    <main className="min-h-screen">
      <article className="max-w-4xl mx-auto px-6 py-12">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-interactive inline-block mb-3">araç</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Python Playground
        </h1>
        <p className="text-sm mb-2" style={{ color: 'var(--color-text-mute)' }}>
          Tarayıcında gerçek Python çalıştır — kurulum yok, hesap yok
        </p>
        <div className="flex items-center gap-2 mb-8">
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor }} />
          <span className="text-xs" style={{ color: 'var(--color-text-mute)' }}>
            Pyodide {pyStatus} · numpy, pandas, scipy, sklearn mevcut
          </span>
        </div>

        {/* Snippet bar */}
        <div className="flex gap-2 flex-wrap mb-4">
          {Object.entries(SNIPPETS).map(([key, { label }]) => (
            <button key={key} onClick={() => { setActiveSnippet(key); setCode(SNIPPETS[key].kod); setOutput(''); }}
              style={{
                fontSize: '12px', padding: '5px 12px', borderRadius: '999px',
                border: '0.5px solid var(--color-border)',
                background: activeSnippet === key ? 'var(--color-accent-soft)' : 'var(--color-cream-card)',
                color: activeSnippet === key ? 'var(--color-accent-text)' : 'var(--color-text-soft)',
                cursor: 'pointer', fontWeight: activeSnippet === key ? 500 : 400,
              }}
            >{label}</button>
          ))}
        </div>

        {/* Editor */}
        <div className="card" style={{ padding: 0, marginBottom: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', borderBottom: '0.5px solid var(--color-border)', background: 'var(--color-cream)' }}>
            <span className="font-mono text-xs" style={{ color: 'var(--color-text-mute)' }}>main.py</span>
            <div className="flex gap-2 items-center">
              <button onClick={() => { setCode(''); setOutput(''); }}
                style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '6px', border: '0.5px solid var(--color-border)', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-mute)' }}>
                Temizle
              </button>
              <button onClick={runCode} disabled={isRunning || pyStatus !== 'hazır'}
                style={{ fontSize: '13px', fontWeight: 500, padding: '5px 18px', borderRadius: '8px', border: 'none', background: '#1D9E75', color: '#fff', cursor: isRunning ? 'wait' : 'pointer', opacity: pyStatus !== 'hazır' ? 0.6 : 1 }}>
                {isRunning ? '⏳' : '▶ Çalıştır'}
              </button>
            </div>
          </div>
          <textarea
            ref={editorRef}
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            style={{
              width: '100%', minHeight: '220px', padding: '14px',
              fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: '1.65',
              border: 'none', outline: 'none', resize: 'vertical',
              background: 'var(--color-cream-card)', color: 'var(--color-text)',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ padding: '6px 14px', background: 'var(--color-cream)', borderTop: '0.5px solid var(--color-border)' }}>
            <span className="text-xs" style={{ color: 'var(--color-text-mute)' }}>
              Cmd+Enter ile çalıştır · Tab ile girinti · numpy, pandas, scipy, sklearn kullanabilirsin
            </span>
          </div>
        </div>

        {/* Output */}
        <div className="card" style={{ padding: 0, marginBottom: '16px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', borderBottom: '0.5px solid var(--color-border)', background: 'var(--color-cream)' }}>
            <span className="font-mono text-xs" style={{ color: 'var(--color-text-mute)' }}>çıktı</span>
            <span className="text-xs" style={{ color: status.includes('Hata') ? '#E24B4A' : status.includes('Başarılı') ? '#1D9E75' : 'var(--color-text-mute)' }}>{status}</span>
          </div>
          <pre style={{
            margin: 0, padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '13px',
            lineHeight: '1.65', minHeight: '100px', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            color: status.includes('Hata') ? '#E24B4A' : 'var(--color-text)',
            background: 'var(--color-cream-card)',
          }}>{output}</pre>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-12">
          {[
            { label: 'Durum', val: status },
            { label: 'Son çalışma', val: time },
            { label: 'Toplam çalıştırma', val: String(runs) },
          ].map(({ label, val }) => (
            <div key={label} className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs mb-1" style={{ color: 'var(--color-text-mute)' }}>{label}</div>
              <div className="text-sm font-medium">{val}</div>
            </div>
          ))}
        </div>

        {/* Açıklama */}
        <div style={{ borderTop: '0.5px solid var(--color-border)', paddingTop: '2rem' }}>
          <h2 className="font-serif text-2xl font-medium mb-4" style={{ color: 'var(--color-text)' }}>Nasıl çalışıyor?</h2>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', lineHeight: '1.75', color: 'var(--color-text)', marginBottom: '1rem' }}>
            Bu playground <strong>Pyodide</strong> kullanıyor — Python&apos;un WebAssembly&apos;e derlenmiş versiyonu.
            Sunucu yok, API yok. Kod tamamen tarayıcında çalışıyor.
          </p>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', lineHeight: '1.75', color: 'var(--color-text)', marginBottom: '1rem' }}>
            Kullanılabilir kütüphaneler: <strong>numpy</strong>, <strong>pandas</strong>,
            <strong> scipy</strong>, <strong>scikit-learn</strong> ve Python standart kütüphanesi.
            matplotlib grafik çıktısı şu an desteklenmiyor (yakında gelecek).
          </p>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', lineHeight: '1.75', color: 'var(--color-text)' }}>
            İlk yüklenme 10-20 saniye sürebilir (Pyodide + kütüphaneler indiriliyor).
            Sonraki çalıştırmalar çok hızlı.
          </p>
        </div>
      </article>
    </main>
  );
}
