'use client';

import { useEffect, useRef, useState } from 'react';

const SNIPPETS = {
  baslangic: {
    label: '🐍 Başlangıç',
    kod: `import numpy as np

sayilar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
print(f"Sayılar: {sayilar}")
print(f"Ortalama: {np.mean(sayilar):.2f}")
print(f"Std: {np.std(sayilar):.2f}")
print(f"Medyan: {np.median(sayilar):.2f}")`,
  },
  cubuk: {
    label: '📊 Çubuk grafik',
    kod: `import matplotlib.pyplot as plt
import numpy as np

kategoriler = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran']
degerler = [42, 58, 35, 71, 63, 80]

fig, ax = plt.subplots(figsize=(8, 4))
bars = ax.bar(kategoriler, degerler,
              color='#1D9E75', edgecolor='none', alpha=0.85)

for bar, val in zip(bars, degerler):
    ax.text(bar.get_x() + bar.get_width()/2,
            bar.get_height() + 1.5, str(val),
            ha='center', fontsize=10, color='#2a2620')

ax.set_title('Aylık Satış Verisi', fontsize=14, pad=12)
ax.set_ylabel('Satış Adedi')
ax.spines[['top','right']].set_visible(False)
ax.set_ylim(0, 95)
plt.tight_layout()
plt.savefig('grafik.png', dpi=120, bbox_inches='tight', facecolor='white')
print("✓ Grafik hazır!")`,
  },
  cizgi: {
    label: '📈 Çizgi grafik',
    kod: `import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
x = np.arange(1, 13)
satis_2024 = [45, 52, 38, 65, 70, 85, 90, 78, 62, 74, 88, 95]
satis_2023 = [38, 45, 30, 55, 60, 72, 80, 65, 50, 62, 75, 82]

fig, ax = plt.subplots(figsize=(9, 4))
ay = ['Oca','Şub','Mar','Nis','May','Haz',
      'Tem','Ağu','Eyl','Eki','Kas','Ara']

ax.plot(ay, satis_2024, color='#1D9E75', linewidth=2.5,
        marker='o', markersize=6, label='2024')
ax.plot(ay, satis_2023, color='#7F77DD', linewidth=2,
        marker='o', markersize=5, linestyle='--', label='2023', alpha=0.7)

ax.fill_between(ay, satis_2023, satis_2024,
                alpha=0.08, color='#1D9E75')

ax.set_title('Yıllık Satış Karşılaştırması', fontsize=14, pad=12)
ax.set_ylabel('Satış Adedi')
ax.legend(frameon=False)
ax.spines[['top','right']].set_visible(False)
plt.tight_layout()
plt.savefig('grafik.png', dpi=120, bbox_inches='tight', facecolor='white')
print("✓ Grafik hazır!")`,
  },
  scatter: {
    label: '🔵 Scatter plot',
    kod: `import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
n = 100
yas = np.random.normal(32, 8, n).clip(20, 55)
maas = 3000 + yas * 250 + np.random.normal(0, 1500, n)
departman = np.random.choice(['IT', 'Pazarlama', 'Satış'], n)

renkler = {'IT': '#1D9E75', 'Pazarlama': '#7F77DD', 'Satış': '#e8a04a'}

fig, ax = plt.subplots(figsize=(8, 5))
for dep in ['IT', 'Pazarlama', 'Satış']:
    mask = departman == dep
    ax.scatter(yas[mask], maas[mask],
               c=renkler[dep], label=dep,
               alpha=0.7, s=60, edgecolors='none')

# Trend çizgisi
z = np.polyfit(yas, maas, 1)
p = np.poly1d(z)
x_line = np.linspace(yas.min(), yas.max(), 100)
ax.plot(x_line, p(x_line), 'k--', alpha=0.3, linewidth=1)

ax.set_title('Yaş vs Maaş Dağılımı', fontsize=14, pad=12)
ax.set_xlabel('Yaş')
ax.set_ylabel('Maaş (TL)')
ax.legend(frameon=False)
ax.spines[['top','right']].set_visible(False)
plt.tight_layout()
plt.savefig('grafik.png', dpi=120, bbox_inches='tight', facecolor='white')
print("✓ Grafik hazır!")`,
  },
  histogram: {
    label: '📉 Histogram',
    kod: `import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

np.random.seed(42)
veri = np.concatenate([
    np.random.normal(65, 8, 300),
    np.random.normal(85, 6, 150)
])

fig, ax = plt.subplots(figsize=(8, 4))
n, bins, patches = ax.hist(veri, bins=30,
                            color='#1D9E75', alpha=0.7,
                            edgecolor='white', linewidth=0.5)

# KDE eğrisi
x = np.linspace(veri.min(), veri.max(), 200)
kde = stats.gaussian_kde(veri)
ax2 = ax.twinx()
ax2.plot(x, kde(x), color='#E24B4A', linewidth=2, label='KDE')
ax2.set_ylabel('Yoğunluk', color='#E24B4A')
ax2.tick_params(colors='#E24B4A')
ax2.spines[['top']].set_visible(False)

ax.axvline(np.mean(veri), color='#7F77DD',
           linestyle='--', linewidth=1.5, label=f'Ort: {np.mean(veri):.1f}')
ax.axvline(np.median(veri), color='#e8a04a',
           linestyle=':', linewidth=1.5, label=f'Med: {np.median(veri):.1f}')

ax.set_title('Sınav Notu Dağılımı', fontsize=14, pad=12)
ax.set_xlabel('Not')
ax.set_ylabel('Frekans')
ax.legend(frameon=False, loc='upper left')
ax.spines[['top','right']].set_visible(False)
plt.tight_layout()
plt.savefig('grafik.png', dpi=120, bbox_inches='tight', facecolor='white')
print("✓ Grafik hazır!")`,
  },
  heatmap: {
    label: '🗺️ Korelasyon heatmap',
    kod: `import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

np.random.seed(42)
n = 200
df = pd.DataFrame({
    'Satış': np.random.normal(100, 20, n),
    'Reklam': np.random.normal(50, 10, n),
    'Müşteri': np.random.normal(500, 100, n),
    'Memnuniyet': np.random.normal(4, 0.5, n).clip(1, 5),
    'İade': np.random.normal(5, 2, n).clip(0, 20),
})
df['Satış'] = df['Satış'] + df['Reklam'] * 0.8
df['Müşteri'] = df['Müşteri'] + df['Satış'] * 2

corr = df.corr()

fig, ax = plt.subplots(figsize=(7, 6))
im = ax.imshow(corr, cmap='RdYlGn', vmin=-1, vmax=1, aspect='auto')
plt.colorbar(im, ax=ax, shrink=0.8)

ax.set_xticks(range(len(corr.columns)))
ax.set_yticks(range(len(corr.columns)))
ax.set_xticklabels(corr.columns, rotation=30, ha='right', fontsize=10)
ax.set_yticklabels(corr.columns, fontsize=10)

for i in range(len(corr)):
    for j in range(len(corr)):
        val = corr.iloc[i, j]
        color = 'white' if abs(val) > 0.5 else '#2a2620'
        ax.text(j, i, f'{val:.2f}', ha='center', va='center',
                fontsize=9, color=color, fontweight='500')

ax.set_title('Korelasyon Matrisi', fontsize=14, pad=12)
plt.tight_layout()
plt.savefig('grafik.png', dpi=120, bbox_inches='tight', facecolor='white')
print("✓ Grafik hazır!")`,
  },
  boxplot: {
    label: '📦 Boxplot',
    kod: `import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
veri = {
    'IT': np.random.normal(12000, 2500, 80).clip(6000, 22000),
    'Pazarlama': np.random.normal(9000, 1800, 60).clip(5000, 16000),
    'Satış': np.random.normal(10000, 3000, 70).clip(4000, 20000),
    'İK': np.random.normal(8000, 1500, 50).clip(5000, 14000),
    'Finans': np.random.normal(13000, 2000, 65).clip(7000, 20000),
}

fig, ax = plt.subplots(figsize=(9, 5))
renkler = ['#1D9E75','#7F77DD','#e8a04a','#E24B4A','#5DCAA5']

bp = ax.boxplot(veri.values(), labels=veri.keys(),
                patch_artist=True, notch=False,
                medianprops=dict(color='white', linewidth=2))

for patch, renk in zip(bp['boxes'], renkler):
    patch.set_facecolor(renk)
    patch.set_alpha(0.75)
for whisker in bp['whiskers']:
    whisker.set(color='#8a7e6d', linewidth=1.2)
for cap in bp['caps']:
    cap.set(color='#8a7e6d', linewidth=1.2)
for flier in bp['fliers']:
    flier.set(marker='o', color='#8a7e6d', alpha=0.4, markersize=4)

ax.set_title('Departman Bazında Maaş Dağılımı', fontsize=14, pad=12)
ax.set_ylabel('Maaş (TL)')
ax.spines[['top','right']].set_visible(False)
ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f'{x:,.0f}'))
plt.tight_layout()
plt.savefig('grafik.png', dpi=120, bbox_inches='tight', facecolor='white')
print("✓ Grafik hazır!")`,
  },
  subplots: {
    label: '🔢 Dashboard (subplots)',
    kod: `import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
aylar = ['Oca','Şub','Mar','Nis','May','Haz']
satis = [42, 58, 35, 71, 63, 80]
musteri = [320, 410, 280, 520, 480, 590]
memnuniyet = [4.2, 4.5, 3.8, 4.7, 4.4, 4.8]
kategori = ['A','B','C','D']
pazar = [35, 28, 22, 15]

fig, axes = plt.subplots(2, 2, figsize=(10, 7))
fig.suptitle('Satış Dashboard', fontsize=15, fontweight='500', y=1.01)

# Sol üst — Çubuk
axes[0,0].bar(aylar, satis, color='#1D9E75', alpha=0.85, edgecolor='none')
axes[0,0].set_title('Aylık Satış', fontsize=11)
axes[0,0].spines[['top','right']].set_visible(False)

# Sağ üst — Çizgi
axes[0,1].plot(aylar, musteri, color='#7F77DD',
               linewidth=2.5, marker='o', markersize=6)
axes[0,1].fill_between(aylar, musteri, alpha=0.1, color='#7F77DD')
axes[0,1].set_title('Müşteri Sayısı', fontsize=11)
axes[0,1].spines[['top','right']].set_visible(False)

# Sol alt — Çizgi
axes[1,0].plot(aylar, memnuniyet, color='#e8a04a',
               linewidth=2.5, marker='s', markersize=6)
axes[1,0].set_ylim(3, 5)
axes[1,0].set_title('Memnuniyet Puanı', fontsize=11)
axes[1,0].spines[['top','right']].set_visible(False)

# Sağ alt — Pasta
renkler = ['#1D9E75','#7F77DD','#e8a04a','#E24B4A']
axes[1,1].pie(pazar, labels=kategori, colors=renkler,
              autopct='%1.0f%%', startangle=90,
              wedgeprops=dict(edgecolor='white', linewidth=2))
axes[1,1].set_title('Pazar Payı', fontsize=11)

plt.tight_layout()
plt.savefig('grafik.png', dpi=120, bbox_inches='tight', facecolor='white')
print("✓ Dashboard hazır!")`,
  },
  pandas: {
    label: '🐼 Pandas',
    kod: `import pandas as pd
import numpy as np

np.random.seed(42)
df = pd.DataFrame({
    'isim': ['Ali','Ayşe','Mehmet','Zeynep','Can','Fatma'],
    'yas': [28, 34, 25, 31, 29, 27],
    'sehir': ['İzmir','İstanbul','Ankara','İzmir','İstanbul','Ankara'],
    'maas': [8500, 12000, 7200, 9800, 11000, 8200]
})

print("=== DataFrame ===")
print(df.to_string(index=False))
print(f"\\nŞekil: {df.shape}")
print(f"\\nŞehre göre ortalama maaş:")
print(df.groupby('sehir')['maas'].mean().round(0).to_string())
print(f"\\nİstatistiksel özet:")
print(df[['yas','maas']].describe().round(1).to_string())`,
  },
  istatistik: {
    label: '📊 İstatistik',
    kod: `import numpy as np
from scipy import stats

np.random.seed(42)
kontrol = np.random.normal(5.0, 0.5, 30)
deney   = np.random.normal(5.5, 0.5, 30)

t, p = stats.ttest_ind(kontrol, deney)

print("=== Bağımsız t-Testi ===")
print(f"Kontrol: ort={kontrol.mean():.3f}, std={kontrol.std():.3f}")
print(f"Deney:   ort={deney.mean():.3f}, std={deney.std():.3f}")
print(f"\\nt istatistiği: {t:.4f}")
print(f"p değeri:       {p:.4f}")
print()
if p < 0.05:
    print("✓ Fark istatistiksel olarak anlamlı (p < 0.05)")
else:
    print("✗ Fark anlamlı değil")`,
  },
};

export default function PythonPlayground() {
  const [code, setCode] = useState(SNIPPETS.baslangic.kod);
  const [output, setOutput] = useState('▶ Çalıştır butonuna bas veya Cmd+Enter kullan.');
  const [imgSrc, setImgSrc] = useState(null);
  const [status, setStatus] = useState('Bekliyor');
  const [time, setTime] = useState('—');
  const [runs, setRuns] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [pyStatus, setPyStatus] = useState('yükleniyor');
  const [activeSnippet, setActiveSnippet] = useState('baslangic');
  const pyodideRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
    script.onload = async () => {
      try {
        setPyStatus('hazırlanıyor');
        const py = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/' });
        await py.loadPackage(['matplotlib', 'numpy', 'pandas', 'scipy']);
        // matplotlib backend ayarla
        await py.runPythonAsync(`
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
`);
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
      setOutput('⏳ Pyodide henüz yüklenmedi...');
      return;
    }
    setIsRunning(true);
    setStatus('Çalışıyor');
    setOutput('');
    setImgSrc(null);
    const t0 = performance.now();

    try {
      const py = pyodideRef.current;
      let out = '';

      py.globals.set('print', (...args) => {
        out += args.map(a => String(a)).join(' ') + '\n';
      });

      // Grafik kaydetme hook'u
      await py.runPythonAsync(`
import matplotlib.pyplot as plt
import io, base64, sys

_original_savefig = plt.savefig
_img_b64 = None

def _custom_savefig(fname, **kwargs):
    if isinstance(fname, str) and fname.endswith('.png'):
        buf = io.BytesIO()
        fig = plt.gcf()
        fig.savefig(buf, **{**kwargs, 'format': 'png'})
        buf.seek(0)
        import base64
        globals()['_img_b64'] = base64.b64encode(buf.read()).decode()
        buf.close()
    else:
        _original_savefig(fname, **kwargs)

plt.savefig = _custom_savefig
_img_b64 = None
`);

      await py.runPythonAsync(code);

      // Grafik var mı kontrol et
      const imgB64 = py.globals.get('_img_b64');
      if (imgB64) {
        setImgSrc(`data:image/png;base64,${imgB64}`);
      }

      // plt.show() çağrıldıysa da yakala
      try {
        await py.runPythonAsync(`
import io, base64
_figs = [plt.figure(n) for n in plt.get_fignums()]
if _figs and _img_b64 is None:
    buf = io.BytesIO()
    _figs[-1].savefig(buf, format='png', dpi=120, bbox_inches='tight', facecolor='white')
    buf.seek(0)
    _img_b64 = base64.b64encode(buf.read()).decode()
    buf.close()
plt.close('all')
`);
        const imgB64After = py.globals.get('_img_b64');
        if (imgB64After && !imgB64) {
          setImgSrc(`data:image/png;base64,${imgB64After}`);
        }
      } catch (e) {}

      const elapsed = ((performance.now() - t0) / 1000).toFixed(2);
      setOutput(out || (imgSrc ? '' : '(çıktı yok)'));
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

  const SNIPPET_GROUPS = [
    { key: 'baslangic', label: '🐍 Başlangıç' },
    { key: 'cubuk',     label: '📊 Çubuk' },
    { key: 'cizgi',     label: '📈 Çizgi' },
    { key: 'scatter',   label: '🔵 Scatter' },
    { key: 'histogram', label: '📉 Histogram' },
    { key: 'heatmap',   label: '🗺️ Heatmap' },
    { key: 'boxplot',   label: '📦 Boxplot' },
    { key: 'subplots',  label: '🔢 Dashboard' },
    { key: 'pandas',    label: '🐼 Pandas' },
    { key: 'istatistik',label: '📊 İstatistik' },
  ];

  return (
    <main className="min-h-screen">
      <article className="max-w-4xl mx-auto px-6 py-12">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-interactive inline-block mb-3">araç</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Python Playground
        </h1>
        <p className="text-sm mb-2" style={{ color: 'var(--color-text-mute)' }}>
          Tarayıcında gerçek Python + matplotlib çalıştır — kurulum yok, hesap yok
        </p>
        <div className="flex items-center gap-2 mb-6">
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor }} />
          <span className="text-xs" style={{ color: 'var(--color-text-mute)' }}>
            Pyodide {pyStatus} · matplotlib, numpy, pandas, scipy mevcut
          </span>
        </div>

        {/* Snippet bar */}
        <div className="flex gap-2 flex-wrap mb-4">
          {SNIPPET_GROUPS.map(({ key, label }) => (
            <button key={key} onClick={() => {
              setActiveSnippet(key);
              setCode(SNIPPETS[key].kod);
              setOutput('');
              setImgSrc(null);
            }} style={{
              fontSize: '12px', padding: '5px 12px', borderRadius: '999px',
              border: '0.5px solid var(--color-border)',
              background: activeSnippet === key ? 'var(--color-accent-soft)' : 'var(--color-cream-card)',
              color: activeSnippet === key ? 'var(--color-accent-text)' : 'var(--color-text-soft)',
              cursor: 'pointer', fontWeight: activeSnippet === key ? 500 : 400,
              transition: 'all .15s',
            }}>{label}</button>
          ))}
        </div>

        {/* Editor */}
        <div className="card mb-3" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', borderBottom: '0.5px solid var(--color-border)', background: 'var(--color-cream)' }}>
            <span className="font-mono text-xs" style={{ color: 'var(--color-text-mute)' }}>main.py</span>
            <div className="flex gap-2 items-center">
              <button onClick={() => { setCode(''); setOutput(''); setImgSrc(null); }}
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
              Cmd+Enter ile çalıştır · Tab ile girinti · plt.savefig() ile grafik görüntüle
            </span>
          </div>
        </div>

        {/* Output */}
        <div className="card mb-4" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', borderBottom: '0.5px solid var(--color-border)', background: 'var(--color-cream)' }}>
            <span className="font-mono text-xs" style={{ color: 'var(--color-text-mute)' }}>çıktı</span>
            <span className="text-xs" style={{ color: status.includes('Hata') ? '#E24B4A' : status.includes('Başarılı') ? '#1D9E75' : 'var(--color-text-mute)' }}>{status}</span>
          </div>

          {/* Grafik görüntüsü */}
          {imgSrc && (
            <div style={{ padding: '16px', background: 'var(--color-cream-card)', borderBottom: output ? '0.5px solid var(--color-border)' : 'none', textAlign: 'center' }}>
              <img src={imgSrc} alt="Matplotlib grafik" style={{ maxWidth: '100%', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />
              <div style={{ marginTop: '8px' }}>
                <a href={imgSrc} download="grafik.png" style={{ fontSize: '12px', color: 'var(--color-accent-text)', textDecoration: 'none' }}>
                  ⬇ Grafiği indir
                </a>
              </div>
            </div>
          )}

          {/* Text output */}
          {(output || !imgSrc) && (
            <pre style={{
              margin: 0, padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '13px',
              lineHeight: '1.65', minHeight: imgSrc ? 'auto' : '80px', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              color: status.includes('Hata') ? '#E24B4A' : 'var(--color-text)',
              background: 'var(--color-cream-card)',
            }}>{output}</pre>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Durum', val: status },
            { label: 'Son çalışma', val: time },
            { label: 'Toplam', val: `${runs} kez` },
          ].map(({ label, val }) => (
            <div key={label} className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs mb-1" style={{ color: 'var(--color-text-mute)' }}>{label}</div>
              <div className="text-sm font-medium">{val}</div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '0.5px solid var(--color-border)', paddingTop: '2rem' }}>
          <h2 className="font-serif text-2xl font-medium mb-4" style={{ color: 'var(--color-text)' }}>Nasıl çalışıyor?</h2>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', lineHeight: '1.75', color: 'var(--color-text)', marginBottom: '1rem' }}>
            Bu playground <strong>Pyodide</strong> kullanıyor — Python&apos;un WebAssembly versiyonu.
            <strong> matplotlib</strong> grafikleri tarayıcıda render eder, PNG olarak gösterir ve indirebilirsin.
          </p>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', lineHeight: '1.75', color: 'var(--color-text)' }}>
            Mevcut kütüphaneler: <strong>matplotlib</strong>, <strong>numpy</strong>,{' '}
            <strong>pandas</strong>, <strong>scipy</strong> ve Python standart kütüphanesi.
          </p>
        </div>
      </article>
    </main>
  );
}
